import {Slide} from './Slide';

export class SlideCore {

    private currentSlide: Slide

    private slides: {[key: string]: Slide} = {}

    private slideNames: string[] = []

    public addSlide(name: string) {
        const slide = new Slide(name)
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
    }

    public getCurrentSlide() {
        return this.currentSlide
    }
}
