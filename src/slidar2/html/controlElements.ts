import * as d3 from 'd3';

import {slideCore} from '../core/core';

const STEPCTR_SELECTOR = "#control-elements .stepctr";
const SLIDENO_SELECTOR = "#control-elements .slideno";
const UP_SELECTOR = "#control-elements .up";
const DOWN_SELECTOR = "#control-elements .down";

export const setStepCtr = (currentStepNo: number, noOfSteps: number) => {
    const stepCtrString = `[${currentStepNo+1}/${noOfSteps}]`;
    d3.selectAll(STEPCTR_SELECTOR)
        .text(stepCtrString);
}

export const setSlideNo = (slideNo: number) => {
    d3.selectAll(SLIDENO_SELECTOR)
        .text(slideNo);
}

export const showHideStepCtr = (trueIfShow: boolean) => {
    d3.selectAll(STEPCTR_SELECTOR)
        .style("visibility", trueIfShow ? "visible" : "hidden");
}

export const showHideUp = (trueIfShow: boolean) => {
    d3.selectAll(UP_SELECTOR)
        .style("visibility", trueIfShow ? "visible" : "hidden");
}

export const showHideDown = (trueIfShow: boolean) => {
    d3.selectAll(DOWN_SELECTOR)
        .style("visibility", trueIfShow ? "visible" : "hidden");
}

const upArrowClicked = () => {
    slideCore.getCurrentSlide().prevStep();
}

const downArrowClicked = () => {
    slideCore.getCurrentSlide().nextStep();
}

const rightArrowClicked = () => {
    slideCore.nextSlide();
}

const leftArrowClicked = () => {
    slideCore.prevSlide();
}

export const controlElements = {
    downArrowClicked,
    leftArrowClicked,
    rightArrowClicked,
    upArrowClicked,
}
