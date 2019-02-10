import 'materialize-css/dist/css/materialize.css';
import * as React from 'react';
import * as _ from 'lodash';

import {init} from './initZer0Slides';
import {initReadyPromise} from './zer0slides/lifecycle/lifecycle';
import {slideCore} from './zer0slides/core/core';
import {Slide, isSpecialSlideName} from './zer0slides/core/Slide';
import {bindKeyToFunction} from './zer0slides/core/keys';
import {renderSlide} from './zer0slides/core/render';
import {SPECIAL_NAME_CONTENT, SLIDE_NAME_CONTENT} from './zer0slides/html/HtmlSlide';
import {paramValue} from './zer0slides/url/queryUtil';
import {getParamValue} from './zer0slides/url/queryUtil2';
import {switchCurrentSlideToBlack} from './zer0slides/showCode/controlShowCode';
import {createControlElements} from './zer0slides/html/controlElements';
import {initTooltip} from './zer0slides/showCode/tooltip';
import {openContentPage, openShortcutSlide} from './zer0slides/shortcut/shortcut';

import 'materialize-css/dist/css/materialize.css';
import 'prismjs/themes/prism.css';
import './zer0slides.less';

const setStepNoOfCurrentSlideFromParam = () => {
    const stepNo = paramValue("step");
    if(stepNo != null && Number(stepNo) > -1) {
        slideCore.getCurrentSlide().currentStepNo = Number(stepNo);
    }
}

const renderFirstSlide = (startIndex: number, gotoStepNo?: string) => {
    const slideIndex = paramValue("slide");
    if (slideIndex != null && Number(slideIndex) > -1) {
        slideCore.setCurrentSlideWithIndex(Number(slideIndex));
        if(gotoStepNo != null && Number(gotoStepNo) > -1) {
            slideCore.getCurrentSlide().currentStepNo = Number(gotoStepNo);
        }
        renderSlide({slide: slideCore.getCurrentSlide()});
    }
    else {
        slideCore.setCurrentSlideWithIndex(startIndex)
        renderSlide({slide: slideCore.getCurrentSlide()});
    }
}

const nextStep = () => {
    const currentSlide = slideCore.getCurrentSlide();
    currentSlide.autoStepOff();
    currentSlide.nextStep();
}

const prevStep = () => {
    const currentSlide = slideCore.getCurrentSlide();
    currentSlide.autoStepOff();
    currentSlide.prevStep();
}

const bindKeys = () => {
    bindKeyToFunction("2", () => slideCore.nextSlide())
    bindKeyToFunction("1", () => slideCore.prevSlide())

    bindKeyToFunction("k", () => slideCore.nextSlide(false))
    bindKeyToFunction("j", () => slideCore.prevSlide(false))

    bindKeyToFunction("s", () => slideCore.nextSlide(true, "RotateX", "RotateX", "twin"))
    bindKeyToFunction("a", () => slideCore.prevSlide(true, "RotateX", "RotateX", "twin"))

    bindKeyToFunction("h", () => slideCore.nextSlide(true, "Up", "Down"))
    bindKeyToFunction("g", () => slideCore.prevSlide(true, "Down", "Up"))

    bindKeyToFunction("right", () => slideCore.nextSlide(true, "Slide", "Slide"))
    bindKeyToFunction("left", () => slideCore.prevSlide(true, "Slide", "Slide"))

    bindKeyToFunction("f", () => slideCore.nextSlide(true, "Z", "Z", "firstOutThenIn"))
    bindKeyToFunction("d", () => slideCore.prevSlide(true, "Z", "Z", "firstOutThenIn"))

    bindKeyToFunction("down", () => nextStep())
    bindKeyToFunction("up", () => prevStep())

    bindKeyToFunction("m", () => nextStep())
    bindKeyToFunction("i", () => prevStep())

    bindKeyToFunction("r", () => slideCore.refreshSlide())
    bindKeyToFunction("t", () => window.location.reload())
    bindKeyToFunction("9", () => openContentPage())
    bindKeyToFunction("0", () => {
            slideCore.setCurrentSlideWithIndex(0);
            window.location.reload();
        }
    )
    bindKeyToFunction("enter", () => {openShortcutSlide()})

    bindKeyToFunction("b", () => switchCurrentSlideToBlack());
}

initTooltip();
init();

const initName = getParamValue("init", true);
if(!_.isUndefined(initName) && initName.length > 0) {
    renderSlide({slide: new Slide(initName)});
}

initReadyPromise.then((startIndex) => {
    const stepNo = paramValue("step");
    slideCore.addSlide(SLIDE_NAME_CONTENT, "Content", SPECIAL_NAME_CONTENT);
    renderFirstSlide(startIndex, stepNo);
    bindKeys();
    createControlElements();
});

