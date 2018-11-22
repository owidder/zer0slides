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
        highlightLines: showCode.highlightLines,
        highlightLinesStep: showCode.highlightLinesStep,
        setSteps: steps.setSteps,
        autoStepOn: steps.autoStepOn,
        codeJs: showCode.js,
        codeCss: showCode.css,
        codeBash: showCode.bash,
        q: selector.q,
        readFile: file.read,
        qrCurrentAddress: qrUtil.qrCurrentAddress,
        qr: qrUtil.makeQrCode,
        showText: text.showText,
        setAttribute: text.setAttribute,
        click: click.setClickHandler,
        tooltip: tooltip.addTooltipToDomNode,
        removeTooltip: tooltip.removeTooltipFromDomNode,
        tooltipStep: tooltip.addTooltipToDomNodeStep,
        removeTooltipStep: tooltip.removeTooltipFromDomNodeStep,
        combine: steps.combineSteps,
        reverse: steps.reverse,
        ...lifecycle
    } as any;

    (window as any).zer0slides = zer0slides;
    (window as any)._0 = _0;
    (window as any).___ = lifecycle.slideReady;
}
