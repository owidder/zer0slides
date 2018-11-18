import * as d3 from 'd3';

import {slideCore} from '../core/core';
import * as mojs from '../effects/mojs';
import {timingSafeEqual} from "crypto";

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

const createCounter = (root: any) => {
    const counterDiv = root.append("div");
    counterDiv.append("span").attr("class", "stepctr counter").text("[0/0]");
    counterDiv.append("span").attr("class", "slideno counter").text("0");
}

const createArrow = (root: any, className: string, onClick: () => void, text: string) => {
    root.append("a")
        .attr("class", className)
        .attr("href", "#")
        .on("click", onClick)
        .append("i")
        .attr("class", "material-icons icon-" + className)
        .text(text)
}

const createControlElementsDefaultContainer = () => {
    const body = d3.select("body");
    body.selectAll(".screencontainer")
        .data([1])
        .enter()
        .append("div")
        .attr("id", "control-elements")
        .attr("class", "controlcontainer")

    d3.selectAll(".screencontainer").raise();
}

let effectInterval;
let timeline;

const startEffect = () => {
    if(!(slideCore.getCurrentSlide().currentStepNo > 0)) {
                timeline = mojs.doubleBurst(document.querySelector("i.icon-down"), 2);
                mojs.startEffect(timeline)
                effectInterval = setInterval(() => {
                    mojs.startEffect(timeline);
                }, 5000)
    }
}

const stopEffect = () => {
    if(effectInterval) {
        clearInterval(effectInterval);
        effectInterval = undefined;
    }
    if(timeline) {
        mojs.stopEffect(timeline, document.querySelector("i.icon-down"));
        timeline = undefined;
    }
}

export const createControlElements = () => {
    createControlElementsDefaultContainer();
    const root = d3.selectAll("#control-elements");

    createCounter(root);
    createArrow(root, "right", rightArrowClicked, "arrow_forward");
    createArrow(root, "left", leftArrowClicked, "arrow_back");
    createArrow(root, "up", upArrowClicked, "arrow_upward");
    createArrow(root, "down", downArrowClicked, "arrow_downward");


    slideCore.newSlideCallback = startEffect;
    slideCore.firstStepCallback = stopEffect;
    slideCore.nextSlideCallback = stopEffect;
}

export const controlElements = {
    downArrowClicked,
    leftArrowClicked,
    rightArrowClicked,
    upArrowClicked,
}
