import {Slide} from './Slide';
import {renderSlide, refreshSlide, InOut} from './render';
import {setSlideNo} from '../html/controlElements';
import {setHashValue} from '../url/queryUtil';
import {Transformation} from '../html/transformations/Transformation';

export class SlideCore {

    private currentSlide: Slide

    private slides: {[key: string]: Slide} = {}

    private slideNames: string[] = []

    public addSlide(name: string) {
        const slide = new Slide(name);
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

    public getCurrenzSlideSelector() {
        const currentName = this.getCurrentSlide().name;
        return `#${currentName}`;
    }

    public getCurrentIndex() {
        const currentName = this.currentSlide.name;
        return this.slideNames.indexOf(currentName);
    }

    private showCurrentIndex() {
        setSlideNo(this.getCurrentIndex());
    }

    public refreshSlide() {
        refreshSlide(this.getCurrentSlide());
    }

    public nextSlide(withTransformation = true, transformInType: Transformation = "Left", transformOutType: Transformation = "Right", inOut: InOut = "outAndInAtOnce") {
        const oldSlide = this.getCurrentSlide();
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
