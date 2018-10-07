import {SlideCore} from './SlideCore';

export const slideCore = new SlideCore();

const addSlide = (slideName: string) => {
    slideCore.addSlide(slideName);
}

export const core = {
    addSlide,
}