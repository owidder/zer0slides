import {Slide} from './Slide';
import {Step} from './Step';

export class SlideCore {

    private currentSlideName: string

    private slides: {
        [key: string]: Slide
    }

    private slideNames: string[]

    public addSlide(name: string): Slide {
        const slide = new Slide();
        this.slides[name] = slide;

        return slide
    }

    public getSlide(slideName: string) {
        return this.slides[slideName]
    }

    public getSlideName(index: number) {
        return this.slideNames[index]
    }

    public setSteps(slideName: string, steps: Step[]) {
        const slide = this.getSlide(slideName);
        slide.steps = steps;
    }

    public getCurrentSlide() {
        return this.slides[this.currentSlideName]
    }
}
