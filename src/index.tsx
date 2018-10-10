import 'materialize-css/dist/css/materialize.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {GapSlides} from './slidar2/core/GapSlides';

import {init} from './initGapslides';
import {initReadyPromise} from './slidar2/lifecycle/lifecycle';
import {slideCore} from './slidar2/core/core';
import {Slide} from './slidar2/core/Slide';
import {bindKeyToFunction} from './slidar2/core/keys';
import {renderSlide} from './slidar2/core/render';
import {paramValue} from './slidar2/url/queryUtil';

init();

const initialSlide = new Slide("init");
renderSlide(initialSlide)

initReadyPromise.then((startIndex) => {
    const slideNo = paramValue("slide");
    if(slideNo != null && Number(slideNo) > -1) {
        slideCore.setCurrentSlideWithIndex(Number(slideNo));
    }
    else {
        slideCore.setCurrentSlideWithIndex(startIndex)
    }

    bindKeyToFunction("right", () => slideCore.nextSlide())
    bindKeyToFunction("left", () => slideCore.prevSlide())
    bindKeyToFunction("down", () => slideCore.getCurrentSlide().nextStep())
    bindKeyToFunction("up", () => slideCore.getCurrentSlide().prevStep())
    bindKeyToFunction("m", () => slideCore.getCurrentSlide().nextStep())
    bindKeyToFunction("i", () => slideCore.getCurrentSlide().prevStep())
    bindKeyToFunction("r", () => slideCore.refreshSlide())
    bindKeyToFunction("f", () => slideCore.setCurrentSlideWithIndex(0))

});

