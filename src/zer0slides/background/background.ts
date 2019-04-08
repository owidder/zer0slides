import {q} from "../selector/selector";
import {styleFromElement, setStyleOfElement} from "../util/styleUtil";
import {slideCore} from "../core/core";

import "./hueRotate.less";

const BACKGROUND_IMAGE_CLASS = "_background_image_";

const hueRotateAnimationStyle = (rotateIntervalInSec: number) => {
    return rotateIntervalInSec ? `animation-name: huerotate; animation-duration: ${rotateIntervalInSec}s; animation-iteration-count: infinite;` : "";
}

const opacityStyle = (opacity: number) => {
    return opacity ? `opacity: ${opacity};` : "";
}

const image = (selector: string, imgPath: string, opacity?: number, rotateIntervalInSec?: number) => {

    const backgroundContainer = document.querySelector(q(selector));
    const currentClass = backgroundContainer.getAttribute("class");
    const currentStyle = backgroundContainer.getAttribute("style") || "";
    backgroundContainer.setAttribute("class", `${currentClass} ${BACKGROUND_IMAGE_CLASS}`);
    backgroundContainer.setAttribute("style", `${currentStyle} background-image: url("${imgPath}"); ${hueRotateAnimationStyle(rotateIntervalInSec)} ${opacityStyle(opacity)}`);
}

export const _addFilterToStyle = (currentStyle: string, filter: string): string => {
    if(currentStyle && currentStyle.length > 0) {
        const filterRegex = /(^.*)filter\:(.*?);(.*)$/;
        if(filterRegex.test(currentStyle)) {
            const currentFilterMatch = currentStyle.match(filterRegex);
            return `${currentFilterMatch[1]}filter:${currentFilterMatch[2]} ${filter};${currentFilterMatch[3]}`;
        }

        return `${currentStyle} filter: ${filter};`
    }

    return `filter: ${filter};`;
}

const _addFilterToElement = (selector: string, filter: string) => {
    const currentStyle = styleFromElement(q(selector));
    const newStyle = _addFilterToStyle(currentStyle, filter);
    setStyleOfElement(q(selector), newStyle);
}

const opacity = (selector: string, percent: number) => {
    _addFilterToElement(selector, `opacity(${percent}%)`);
}

const blur = (selector: string, px: number) => {
    _addFilterToElement(selector, `blur(${px}px)`);
}

const saturate = (selector: string, percent: number) => {
    _addFilterToElement(selector, `saturate(${percent}%)`)
}

export const _replaceHueRotation = (currentStyle: string, newRotationDeg: number) => {
    const regexp = /hue\-rotate\(\d+deg\)/;
    const newHueRotate = `hue-rotate(${newRotationDeg}deg)`;
    if(regexp.test(currentStyle)) {
        return currentStyle.replace(regexp, newHueRotate);
    }

    return _addFilterToStyle(currentStyle, newHueRotate);
}

const startHueRotation = (selector: string, intervalInMs = 100) => {

    const currentStyle = styleFromElement(q(selector));

    let currentHueRotation = 0;
    let intervalId = undefined;

    slideCore.getCurrentSlide().exitFunctions.push(() => {
        if(intervalId) {
            clearInterval(intervalId);
            intervalId = undefined;
        }
    })

    intervalId = setInterval(() => {
        setStyleOfElement(q(selector), _replaceHueRotation(currentStyle, currentHueRotation));
        currentHueRotation++;
    }, intervalInMs)
}

export const background = {
    image,
    opacity,
    blur,
    saturate,
    startHueRotation,
}