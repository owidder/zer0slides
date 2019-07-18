import "materialize-css/dist/css/materialize.css";
import * as React from "react";

import {init} from "./initZer0Slides";
import {initReadyPromise} from "./zer0slides/lifecycle/lifecycle";
import {slideCore} from "./zer0slides/core/core";
import {Slide, isSpecialSlideName} from "./zer0slides/core/Slide";
import {bindKeyToFunction} from "./zer0slides/core/keys";
import {renderSlide} from "./zer0slides/core/render";
import {SPECIAL_NAME_CONTENT, SLIDE_NAME_CONTENT} from "./zer0slides/html/HtmlSlide";
import {getParamValue, getParamValueWithDefault} from "./zer0slides/url/queryUtil2";
import {switchCurrentSlideToBlack} from "./zer0slides/showCode/controlShowCode";
import {createControlElements} from "./zer0slides/html/controlElements";
import {initTooltip} from "./zer0slides/tooltip/tooltip";
import {openContentPage, openShortcutSlide, doShortcut} from "./zer0slides/shortcut/shortcut";
import {initSync, firstMessagePromise, isSynced, Command} from "./zer0slides/sync/sync";

import "materialize-css/dist/css/materialize.css";
import "prismjs/themes/prism.css";
import "./zer0slides.less";
import {number} from "prop-types";

const version = require("../package.json").version;
slideCore.version = version;

const renderFirstSlide = (slideNo: number, stepNo: number) => {
    slideCore.setCurrentSlideWithIndex(slideNo);
    slideCore.getCurrentSlide().currentStepNo = stepNo;
    renderSlide({slide: slideCore.getCurrentSlide()});
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
    bindKeyToFunction("enter", () => {doShortcut()})

    bindKeyToFunction("b", () => switchCurrentSlideToBlack());
}

const commandCallback = (command: Command) => {
    slideCore.gotoSlideNoAndStepNo(command.slideNo, command.stepNo);
}

initTooltip();
init();
initSync(commandCallback);


const initName = getParamValue("init", true);
if(initName && initName.length > 0) {
    renderSlide({slide: new Slide(initName)});
}

const firstSlideViaSyncOrParams = (slideNoViaParam: number, stepNoViaParam: number) => {
    console.log(`firstSlideViaSyncOrParams [${new Date().toString()}]`);
    return new Promise(resolve => {
        if(isSynced()) {
            console.log("is synced");
            firstMessagePromise.then(({slideNo, stepNo}) => {
                console.log(`firstMessagePromise: ${slideNo} / ${stepNo}`)
                if(slideNo !== undefined && stepNo !== undefined) {
                    renderFirstSlide(slideNo, stepNo);
                } else {
                    renderFirstSlide(slideNoViaParam, stepNoViaParam);
                    slideCore.syncCurrentSlideNoAndStepNo();
                }
                resolve();
            })
        } else {
            console.log("is not synced");
            renderFirstSlide(slideNoViaParam, stepNoViaParam);
            resolve();
        }
    })
}

initReadyPromise.then(async () => {
    console.log("initReadyPromise");

    const stepNo = getParamValueWithDefault("step", "-1");
    const slideNo = getParamValueWithDefault("slide", "0");
    slideCore.addSlide(SLIDE_NAME_CONTENT, "Content", SPECIAL_NAME_CONTENT);
    await firstSlideViaSyncOrParams(Number(slideNo), Number(stepNo));
    bindKeys();
    createControlElements();
});

