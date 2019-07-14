import {Slide, SlideConfig} from './Slide';
import {renderSlide, refreshSlide, InOut} from './render';
import {setSlideNo} from '../html/controlElements';
import {setHashValue} from '../url/queryUtil2';
import {Transformation} from '../html/transformations/Transformation';
import {SimplePromise} from "./SimplePromise";
import {sendSlideNoAndStepNo} from "../sync/sync";

export class SlideCore {

    private currentSlide: Slide
    private slides: {[key: string]: Slide} = {}
    private attributes: {[key: string]: string} = {}
    private slideNames: string[] = []

    public version;

    public _0;

    public shortcutSlideIndex = 0
    public folderName: string;
    public autoStepIntervalInMs = -1;
    public blockSteps = false;
    public newSlideCallback= () => {}
    public firstStepCallback = () => {}
    public nextSlideCallback = () => {}

    public setAttribute = (attributeName: string, value: string) => {
        this.attributes[attributeName] = value;
    }

    public getAttribute = (attributeName: string): string => {
        return this.attributes[attributeName];
    }

    public getSlideUrl(slideName: string) {
        const index = this.slideNames.indexOf(slideName);
        return SlideCore.getSlideUrlWithIndex(index);
    }

    public static getSlideUrlWithIndex(index: number) {
        const currentUrl = window.location.href;
        return currentUrl.replace(/slide=\d+/,"slide=" + index);
    }

    public getShortCutSlideUrl() {
        return SlideCore.getSlideUrlWithIndex(this.shortcutSlideIndex);
    }

    public getSlideNames() {
        return [...this.slideNames];
    }

    public getDescription(slideName: string) {
        return this.getSlide(slideName).description;
    }

    public addSlide(name: string, description?: string, specialName?: string, doPerformToCurrentStep = true, centerCurrentLine = false, useTippyAsDefault = false) {
        return this.addSlideWithConfig(name, description, {
            specialName, doPerformToCurrentStep, centerCurrentLine, useTippyAsDefault
        })
    }

    public addSlideWithConfig(name: string, description?: string, slideConfig?: SlideConfig) {
        const slide = new Slide(name, description ? description : name, slideConfig);
        if(!this.currentSlide) {
            this.currentSlide = slide;
        }
        this.slideNames.push(name);
        this.slides[name] = slide;

        return slide
    }

    public getSlide(slideName: string) {
        return this.slides[slideName]
    }

    public getSlideWithName(index: number) {
        const name = this.slideNames[index];
        return this.slides[name]
    }

    public setCurrentSlideWithName(name: string) {
        this.currentSlide = this.slides[name]
    }

    public setCurrentSlideWithIndex(index: number) {
        setHashValue("slide", index);
        this.setCurrentSlideWithName(this.slideNames[index]);
    }

    public getCurrentSlide() {
        return this.currentSlide
    }

    public getCurrentSlideSelector() {
        const currentName = this.getCurrentSlide().name;
        return `#${currentName}`;
    }

    public getCurrentIndex() {
        const currentName = this.currentSlide ? this.currentSlide.name : undefined;
        return this.slideNames.indexOf(currentName);
    }

    public showCurrentIndex() {
        setSlideNo(this.getCurrentIndex());
    }

    public refreshSlide() {
        refreshSlide(this.getCurrentSlide());
    }

    private processOldSlide(): Slide {
        const oldSlide = this.getCurrentSlide();
        oldSlide.aboutToBeRemoved();

        return oldSlide;
    }

    public syncCurrentSlideNoAndStepNo() {
        const slideNo = this.getCurrentIndex();
        const stepNo = this.getCurrentSlide().currentStepNo;
        sendSlideNoAndStepNo(slideNo, stepNo);
    }

    private callRenderSlide = (oldSlide: Slide, withTransformation, transformInType: Transformation, transformOutType: Transformation, inOut: InOut) => {
        const slide = this.getCurrentSlide();
        renderSlide({
            slide,
            oldSlide: withTransformation ? oldSlide : undefined,
            inOut,
            transformInType: transformInType === "Slide" ? slide.transformationInNext : transformInType,
            transformOutType: transformOutType === "Slide" ? oldSlide.transformationOutNext : transformOutType
        });
        this.showCurrentIndex();
        this.syncCurrentSlideNoAndStepNo();
    }

    public gotoSlideNoAndStepNo(slideNo: number, stepNo: number, withTransformation = true, transformInType: Transformation = "Left", transformOutType: Transformation = "Right", inOut: InOut = "outAndInAtOnce") {
        if(this.getCurrentIndex() != slideNo) {
            const oldSlide = this.processOldSlide();
            this.setCurrentSlideWithIndex(slideNo);
            this.getCurrentSlide().currentStepNo = stepNo;
            this.callRenderSlide(oldSlide, withTransformation, transformInType, transformOutType, inOut);
        } else if(this.getCurrentSlide().currentStepNo != stepNo) {
            this.getCurrentSlide().currentStepNo = stepNo;
            this.getCurrentSlide().performToCurrentStep();
        }
    }

    public nextSlide(withTransformation = true, transformInType: Transformation = "Left", transformOutType: Transformation = "Right", inOut: InOut = "outAndInAtOnce") {
        this.nextSlideCallback();
        const oldSlide = this.processOldSlide();

        const currentIndex = this.getCurrentIndex();
        if(currentIndex < (this.slideNames.length - 1)) {
            this.setCurrentSlideWithIndex(currentIndex + 1);
        }
        else {
            this.setCurrentSlideWithIndex(0);
        }

        this.callRenderSlide(oldSlide, withTransformation, transformInType, transformOutType, inOut);
    }

    public prevSlide(withTransformation = true, transformInType: Transformation = "Right", transformOutType: Transformation = "Left", inOut: InOut = "outAndInAtOnce") {
        const oldSlide = this.processOldSlide();

        const currentIndex = this.getCurrentIndex();
        if(currentIndex > 0) {
            this.setCurrentSlideWithIndex(currentIndex - 1);
        }
        else {
            this.setCurrentSlideWithIndex(this.slideNames.length - 1);
        }

        this.callRenderSlide(oldSlide, withTransformation, transformInType, transformOutType, inOut);
    }
}
