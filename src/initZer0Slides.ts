import * as d3 from 'd3';

import {steps} from './zer0slides/steps/steps';
import {lifecycle} from './zer0slides/lifecycle/lifecycle';
import {click} from './zer0slides/click/click';
import {core} from './zer0slides/core/core';
import {controlElements} from './zer0slides/html/controlElements';
import {showCode} from './zer0slides/showCode/showCode';
import {selector} from './zer0slides/selector/selector';
import {tooltip} from './zer0slides/showCode/tooltip';
import {file} from './zer0slides/file/file';
import {qrUtil} from './zer0slides/qr/qr';
import {text} from './zer0slides/text/text';
import {cube} from './zer0slides/specials/cube';
import {glowText} from './zer0slides/specials/GlowText';
import {classUtil} from './zer0slides/util/classUtil';


const createRoot = () => {
    const body = d3.select("body");
    body.selectAll("#root")
        .data([1])
        .enter()
        .append("div")
        .attr("id", "root");
}

export const init = () => {
    createRoot();
    const zer0slides = {
        controlElements,
        click,
        core,
        lifecycle,
        selector,
        showCode,
        steps,
        tooltip,
        file,
    } as any;

    const _0 = {
        addSlide: core.addSlide,
        autoStepOn: steps.autoStepOn,
        click: click.setClickHandler,
        codeBash: showCode.bash,
        codeCss: showCode.css,
        codeJs: showCode.js,
        combine: steps.combineSteps,
        createCube: cube.create,
        glowText: glowText.create,
        highlightLines: showCode.highlightLines,
        highlightLinesStep: showCode.highlightLinesStep,
        initReady: lifecycle.initReady,
        q: selector.q,
        qr: qrUtil.makeQrCode,
        qrCurrentAddress: qrUtil.qrCurrentAddress,
        readFile: file.read,
        removeTooltip: tooltip.removeTooltipFromDomNode,
        removeTooltipStep: tooltip.removeTooltipFromDomNodeStep,
        reverse: steps.reverse,
        setAttribute: text.setAttribute,
        setClass: classUtil.setClass,
        setSteps: steps.setSteps,
        showText: text.showText,
        slideReady: lifecycle.slideReady,
        startStopCube: cube.startStopAnimation,
        switchBetweenClasses: classUtil.switchBetweenClasses,
        tooltip: tooltip.addTooltipToDomNode,
        tooltipStep: tooltip.addTooltipToDomNodeStep,
    } as any;

    (window as any).zer0slides = zer0slides;
    (window as any)._0 = _0;
    (window as any).___ = lifecycle.slideReady;
}
