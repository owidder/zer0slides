import {Slide} from './Slide';
import {renderSlide} from './render';

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
        this.setCurrentSlideWithName(this.slideNames[index]);
        renderSlide(this.getCurrentSlide());
    }

    public getCurrentSlide() {
        return this.currentSlide
    }

    public getCurrentIndex() {
        const currentName = this.currentSlide.name;
        return this.slideNames.indexOf(currentName);
    }

    public nextSlide() {
        const currentIndex = this.getCurrentIndex();
        if(currentIndex < (this.slideNames.length - 1)) {
            this.setCurrentSlideWithIndex(currentIndex + 1);
        }
        else {
            this.setCurrentSlideWithIndex(0);
        }
        renderSlide(this.getCurrentSlide());
    }

    public prevSlide() {
        const currentIndex = this.getCurrentIndex();
        if(currentIndex > 0) {
            this.setCurrentSlideWithIndex(currentIndex - 1);
        }
        else {
            this.setCurrentSlideWithIndex(this.slideNames.length - 1);
        }
        renderSlide(this.getCurrentSlide());
    }
}
