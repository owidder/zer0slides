import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {GapSlides} from './GapSlides';

import {init} from './initGapslides';
import {initReadyPromise} from './slidar2/lifecycle/lifecycle';
import {slideCore} from './slidar2/core/core';
import {Slide} from './slidar2/core/Slide';
import {bindKeyToFunction} from './slidar2/core/keys';

const renderSlide = (slide: Slide) => {
    ReactDOM.render(
        <GapSlides slide={slide}/>,
        document.getElementById('root') as HTMLElement
    );
}

const setAndRenderSlide = (setSlideFunc: () => void) => {
    setSlideFunc();
    const currentSlide = slideCore.getCurrentSlide();
    renderSlide(currentSlide);
}

init();

const initialSlide = new Slide("init");
renderSlide(initialSlide)

initReadyPromise.then((startIndex) => {
    setAndRenderSlide(() => slideCore.setCurrentSlideWithIndex(startIndex));

    bindKeyToFunction("right", () => setAndRenderSlide(() => slideCore.nextSlide()))
    bindKeyToFunction("left", () => setAndRenderSlide(() => slideCore.prevSlide()))
});
