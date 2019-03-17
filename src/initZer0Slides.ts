import * as d3 from "d3";
import * as $ from "jquery";
import * as _ from "lodash";

import {steps} from "./zer0slides/steps/steps";
import {lifecycle} from "./zer0slides/lifecycle/lifecycle";
import {click} from "./zer0slides/click/click";
import {core, slideCore} from "./zer0slides/core/core";
import {controlElements} from "./zer0slides/html/controlElements";
import {showCode} from "./zer0slides/showCode/showCode";
import {selector} from "./zer0slides/selector/selector";
import {tooltip} from "./zer0slides/tooltip/tooltip";
import {file} from "./zer0slides/file/file";
import {qrUtil} from "./zer0slides/qr/qr";
import {text} from "./zer0slides/text/text";
import {cube} from "./zer0slides/specials/cube";
import {glowText} from "./zer0slides/specials/GlowText";
import {classUtil} from "./zer0slides/util/classUtil";
import {metamaskLogo} from "./zer0slides/etc/metamaskLogo";
import {cast} from "./zer0slides/specials/cast";
import {shortcut} from "./zer0slides/shortcut/shortcut";
import {background} from "./zer0slides/background/background";

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

    const _0 = {
        $1: selector.$1,
        addSlide: core.addSlide,
        addStep: steps.addStep,
        autoStepOn: steps.autoStepOn,
        backgroundImage: background.image,
        blur: background.blur,
        click: click.setClickHandler,
        codeBash: showCode.bash,
        codeCss: showCode.css,
        codeJs: showCode.js,
        combine: steps.combineSteps,
        createCast: cast.create,
        createCube: cube.create,
        d3select: selector.d3select,
        enableTippy: tooltip.enableTippy,
        glowText: glowText.create,
        highlightLines: showCode.highlightLines,
        highlightLinesStep: showCode.highlightLinesStep,
        initReady: lifecycle.initReady,
        opacity: background.opacity,
        q: selector.q,
        qr: qrUtil.makeQrCode,
        qrCurrentAddress: qrUtil.qrCurrentAddress,
        readFile: file.read,
        removeTooltip: tooltip.removeTooltipFromDomNode,
        removeTooltipStep: tooltip.removeTooltipFromDomNodeStep,
        reverse: steps.reverse,
        selectFirst: selector.selectFirst,
        setAttribute: text.setAttribute,
        setClass: classUtil.setClass,
        setSteps: steps.setSteps,
        saturate: background.saturate,
        showText: text.showText,
        slideReady: lifecycle.slideReady,
        startHueRotation: background.startHueRotation,
        startStopCube: cube.startStopAnimation,
        step: steps.createStep,
        switchBetweenClasses: classUtil.switchBetweenClasses,
        tooltip: tooltip.addTooltipToDomNode,
        tooltipStep: tooltip.addTooltipToDomNodeStep,
        metamaskLogo,
        shortcut,
        slideCore,
        steps,
        d3,
        $,
        _
    };

    slideCore._0 = _0;
    (window as any)._0 = _0;
    (window as any).___ = lifecycle.slideReady;
}
