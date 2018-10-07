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

init();

const initialSlide = new Slide("init");
renderSlide(initialSlide)

initReadyPromise.then((startIndex) => {
    slideCore.setCurrentSlideWithIndex(startIndex);
    const currentSlide = slideCore.getCurrentSlide();
    renderSlide(currentSlide);

    bindKeyToFunction("right", () => slideCore.nextSlide())
    bindKeyToFunction("left", () => slideCore.prevSlide())
});
