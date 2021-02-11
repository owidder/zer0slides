import * as d3 from "d3";
import * as $ from "jquery";
import * as _ from "lodash";
import tippy from 'tippy.js';

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
import {classUtil, removeClassStep} from "./zer0slides/util/classUtil";
import {metamaskLogo} from "./zer0slides/etc/metamaskLogo";
import {cast} from "./zer0slides/specials/cast";
import {shortcut} from "./zer0slides/shortcut/shortcut";
import {background} from "./zer0slides/background/background";
import {fitToScreen} from "./zer0slides/responsive/fitToScreen";
import {createSketch} from "./zer0slides/sketch/sketch";
import * as anime from "./zer0slides/transform/anime";
import * as transform from "./zer0slides/transform/transform";
import * as elements from "./zer0slides/dom/elements";
import rough from "roughjs";

import * as vivus from "vivus";

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
        addSlideWithConfig: core.addSlideWithConfig,
        addStep: steps.addStep,
        autoStepOn: steps.autoStepOn,
        backgroundImage: background.image,
        blur: background.blur,
        click: click.setClickHandler,
        codeBash: showCode.bash,
        codeCss: showCode.css,
        codeHtml: showCode.html,
        codeJs: showCode.js,
        combine: steps.combineSteps,
        createCast: cast.create,
        createCube: cube.create,
        d3select: selector.d3select,
        doNotUseTippy: tooltip.doNotUseTippy,
        el: elements,
        fitToScreen: fitToScreen,
        glowText: glowText.create,
        highlightLines: showCode.highlightLines,
        highlightLinesStep: showCode.highlightLinesStep,
        initReady: lifecycle.initReady,
        opacity: background.opacity,
        q: selector.q,
        qr: qrUtil.makeQrCode,
        qrCurrentAddress: qrUtil.qrCurrentAddress,
        readFile: file.read,
        removeClassStep: classUtil.removeClassStep,
        removeCube: cube.remove,
        removeTooltip: tooltip.removeTooltipFromDomNode,
        removeTooltipStep: tooltip.removeTooltipFromDomNodeStep,
        reverse: steps.reverse,
        saturate: background.saturate,
        selectFirst: selector.selectFirst,
        setAttribute: text.setAttribute,
        setClass: classUtil.setClass,
        setClassStep: classUtil.setClassStep,
        setSteps: steps.setSteps,
        setTippyTheme: tooltip.setTippyTheme,
        setTheme: tooltip.setTheme,
        shortcutFunctionStep: shortcut.setShortcutFunctionStep,
        showText: text.showText,
        slideReady: lifecycle.slideReady,
        startHueRotation: background.startHueRotation,
        startStopCube: cube.startStopAnimation,
        step: steps.createStep,
        switchBetweenClasses: classUtil.switchBetweenClasses,
        t: transform,
        tooltip: tooltip.addTooltipToDomNode,
        tooltipStep: tooltip.addTooltipToDomNodeStep,
        useTippy: tooltip.useTippy,
        anime,
        controlElements,
        createSketch,
        d3,
        metamaskLogo,
        rough,
        shortcut,
        slideCore,
        steps,
        tippy,
        vivus,
        $,
        _,
    };

    slideCore._0 = _0;
    (window as any)._0 = _0;
    (window as any).___ = lifecycle.slideReady;
}
