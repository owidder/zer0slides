import 'materialize-css/dist/css/materialize.css';

import * as React from 'react';

import {init} from './initGapslides';
import {initReadyPromise} from './slidar2/lifecycle/lifecycle';
import {slideCore} from './slidar2/core/core';
import {Slide} from './slidar2/core/Slide';
import {bindKeyToFunction} from './slidar2/core/keys';
import {renderSlide} from './slidar2/core/render';
import {paramValue} from './slidar2/url/queryUtil';

import './gapslides.css';

const renderFirstSlide = (startIndex) => {
    const slideNo = paramValue("slide");
    if(slideNo != null && Number(slideNo) > -1) {
        slideCore.setCurrentSlideWithIndex(Number(slideNo));
        renderSlide({slide: slideCore.getCurrentSlide()});
    }
    else {
        slideCore.setCurrentSlideWithIndex(startIndex)
        renderSlide({slide: slideCore.getCurrentSlide()});
    }
}

const bindKeys = () => {
    bindKeyToFunction("right", () => slideCore.nextSlide())
    bindKeyToFunction("left", () => slideCore.prevSlide())

    bindKeyToFunction("k", () => slideCore.nextSlide(false))
    bindKeyToFunction("j", () => slideCore.prevSlide(false))

    bindKeyToFunction("s", () => slideCore.nextSlide(true, "RotateX", "RotateX", "twin"))
    bindKeyToFunction("a", () => slideCore.prevSlide(true, "RotateX", "RotateX", "twin"))

    bindKeyToFunction("f", () => slideCore.nextSlide(true, "Z", "Z", "firstOutThenIn"))
    bindKeyToFunction("d", () => slideCore.prevSlide(true, "Z", "Z", "firstOutThenIn"))

    bindKeyToFunction("down", () => slideCore.getCurrentSlide().nextStep())
    bindKeyToFunction("up", () => slideCore.getCurrentSlide().prevStep())

    bindKeyToFunction("m", () => slideCore.getCurrentSlide().nextStep())
    bindKeyToFunction("i", () => slideCore.getCurrentSlide().prevStep())

    bindKeyToFunction("r", () => slideCore.refreshSlide())
    bindKeyToFunction("0", () => slideCore.setCurrentSlideWithIndex(0))
}

init();

renderSlide({slide: new Slide("init")});

initReadyPromise.then((startIndex) => {
    renderFirstSlide(startIndex);
    bindKeys();
});

