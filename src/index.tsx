import 'materialize-css/dist/css/materialize.css';

import * as React from 'react';

import {init} from './initGapslides';
import {initReadyPromise} from './zer0slides/lifecycle/lifecycle';
import {slideCore} from './zer0slides/core/core';
import {Slide} from './zer0slides/core/Slide';
import {bindKeyToFunction} from './zer0slides/core/keys';
import {renderSlide} from './zer0slides/core/render';
import {paramValue} from './zer0slides/url/queryUtil';
import {getParamValue} from './zer0slides/url/queryUtil2';
import {switchCurrentSlideToBlack} from './zer0slides/showCode/controlShowCode';
import {createControlElements} from './zer0slides/html/controlElements';

import 'materialize-css/dist/css/materialize.css';
import 'prismjs/themes/prism.css';
import './gapslides.less';

const renderFirstSlide = (startIndex) => {
    const slideNo = paramValue("slide");
    if (slideNo != null && Number(slideNo) > -1) {
        slideCore.setCurrentSlideWithIndex(Number(slideNo));
        renderSlide({slide: slideCore.getCurrentSlide()});
    }
    else {
        slideCore.setCurrentSlideWithIndex(startIndex)
        renderSlide({slide: slideCore.getCurrentSlide()});
    }
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

    bindKeyToFunction("down", () => slideCore.getCurrentSlide().nextStep())
    bindKeyToFunction("up", () => slideCore.getCurrentSlide().prevStep())

    bindKeyToFunction("m", () => slideCore.getCurrentSlide().nextStep())
    bindKeyToFunction("i", () => slideCore.getCurrentSlide().prevStep())

    bindKeyToFunction("r", () => slideCore.refreshSlide())
    bindKeyToFunction("t", () => window.location.reload())
    bindKeyToFunction("0", () => {
            slideCore.setCurrentSlideWithIndex(0);
            window.location.reload();
        }
    )

    bindKeyToFunction("b", () => switchCurrentSlideToBlack());
}

init();

const initName = getParamValue("init", true) || "init";
renderSlide({slide: new Slide(initName)});

initReadyPromise.then((startIndex) => {
    renderFirstSlide(startIndex);
    bindKeys();
    createControlElements();
});

