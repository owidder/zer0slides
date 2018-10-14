import {Slide} from './Slide';
import {renderSlide} from './render';
import {setSlideNo} from '../html/controlElements';
import {setHashValue} from '../url/queryUtil';

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

    public getCurrentIndex() {
        const currentName = this.currentSlide.name;
        return this.slideNames.indexOf(currentName);
    }

    private showCurrentIndex() {
        setSlideNo(this.getCurrentIndex());
    }

    public refreshSlide() {
        renderSlide({slide: this.getCurrentSlide(), safeMode: true});
    }

    public nextSlide() {
        const oldSlide = this.getCurrentSlide();
        const currentIndex = this.getCurrentIndex();
        if(currentIndex < (this.slideNames.length - 1)) {
            this.setCurrentSlideWithIndex(currentIndex + 1);
        }
        else {
            this.setCurrentSlideWithIndex(0);
        }
        renderSlide({
            slide: this.getCurrentSlide(),
            oldSlide,
            inOut: false,
        });
        this.showCurrentIndex();
    }

    public prevSlide() {
        const oldSlide = this.getCurrentSlide();
        const currentIndex = this.getCurrentIndex();
        if(currentIndex > 0) {
            this.setCurrentSlideWithIndex(currentIndex - 1);
        }
        else {
            this.setCurrentSlideWithIndex(this.slideNames.length - 1);
        }
        renderSlide({slide: this.getCurrentSlide(), oldSlide});
        this.showCurrentIndex();
    }
}
