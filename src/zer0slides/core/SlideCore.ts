import {Slide} from './Slide';
import {renderSlide, refreshSlide, InOut} from './render';
import {setSlideNo} from '../html/controlElements';
import {setHashValue} from '../url/queryUtil';
import {Transformation} from '../html/transformations/Transformation';
import {autoStepOn} from "../steps/steps";
import {slideCore} from "./core";

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

    public addSlide(name: string, description?: string, specialName?: string, doPerformToCurrentStep = true) {
        const slide = new Slide(name, description ? description : name, specialName);
        slide.doPerformToCurrentStep = doPerformToCurrentStep;
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

    private doWithOldSlide(oldSlide: Slide) {
        oldSlide.aboutToBeRemoved();
    }

    private doWithNewSlide(newSlide: Slide) {
        if(this.autoStepIntervalInMs > -1) {
            newSlide.autoStepOn(this.autoStepIntervalInMs)
        }
    }

    public nextSlide(withTransformation = true, transformInType: Transformation = "Left", transformOutType: Transformation = "Right", inOut: InOut = "outAndInAtOnce") {
        this.nextSlideCallback();
        const oldSlide = this.getCurrentSlide();
        this.doWithOldSlide(oldSlide);

        const currentIndex = this.getCurrentIndex();
        if(currentIndex < (this.slideNames.length - 1)) {
            this.setCurrentSlideWithIndex(currentIndex + 1);
        }
        else {
            this.setCurrentSlideWithIndex(0);
        }
        const slide = this.getCurrentSlide();
        renderSlide({
            slide,
            oldSlide: withTransformation ? oldSlide : undefined,
            inOut,
            transformInType: transformInType === "Slide" ? slide.transformationInNext : transformInType,
            transformOutType: transformOutType === "Slide" ? oldSlide.transformationOutNext : transformOutType
        });
        this.showCurrentIndex();
    }

    public prevSlide(withTransformation = true, transformInType: Transformation = "Right", transformOutType: Transformation = "Left", inOut: InOut = "outAndInAtOnce") {
        const oldSlide = this.getCurrentSlide();
        oldSlide.aboutToBeRemoved();

        const currentIndex = this.getCurrentIndex();
        if(currentIndex > 0) {
            this.setCurrentSlideWithIndex(currentIndex - 1);
        }
        else {
            this.setCurrentSlideWithIndex(this.slideNames.length - 1);
        }
        const slide = this.getCurrentSlide();
        renderSlide({
            slide,
            oldSlide: withTransformation ? oldSlide : undefined,
            inOut,
            transformInType: transformInType === "Slide" ? slide.transformationInPrev : transformInType,
            transformOutType: transformOutType === "Slide" ? oldSlide.transformationOutPrev : transformOutType
        });
        this.showCurrentIndex();
    }
}
