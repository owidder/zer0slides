import * as d3 from 'd3';
import * as $ from 'jquery';
import * as _ from 'lodash';
import {slideCore} from "../core/core";
import {addCleanFunction} from "../lifecycle/lifecycle";
import {getData, setData, resetData} from '../core/data';
import {Step} from '../core/Step';

import 'protip/protip.min.css';
import {q, selector} from "../selector/selector";

require('protip/main');


interface Tooltip {
    lineIndex?: number,
    selector?: string,
    text: string,
    position?: string,
    placement?: string,
}

export const initTooltip = () => {
    addCleanFunction(cleanAfterSlideFinished);
    refresh();
}

const cleanAfterSlideFinished = () => {
    d3.selectAll(".protip-container").remove();
}

const refresh = () => {
    ($ as any).protip();
}

export const reset = () => {
    const slideSelector = slideCore.getCurrentSlideSelector();
    const selector = `${slideSelector} .line-highlight`;

    d3.selectAll(selector)
        .classed("protip", false)

    refresh();
    ($(selector) as any).protipHide();
}

const createTooltipSelector = (tooltip: Tooltip) => {
    if(tooltip.selector) {
        return tooltip.selector;
    }

    const nth = tooltip.lineIndex > 0 ? tooltip.lineIndex + 1 : 1;
    const slideSelector = slideCore.getCurrentSlideSelector();
    const selector = `${slideSelector} .line-highlight:nth-of-type(${nth})`;

    return selector;
}

export const createTooltip = (tooltip: Tooltip) => {
    const selector = q(createTooltipSelector(tooltip));

    d3.selectAll(selector)
        .classed("protip", true)
        .attr("data-pt-title", tooltip.text.startsWith('.') ? q(tooltip.text) : tooltip.text)
        .attr("data-pt-gravity", false)
        .attr("data-pt-scheme", "pink")
        .attr("data-pt-position", tooltip.position ? tooltip.position : "bottom")
        .attr("data-pt-trigger", "sticky")
        .attr("data-pt-auto-show", true)
        .attr("data-pt-placement", _.isUndefined(tooltip.placement) ? "outside" : tooltip.placement);

    refresh();
    ($(selector) as any).protipShow();
}

export const addTooltipToDomNode = (selector: string, text: string, position: string, placement: string): Tooltip | undefined => {
    const _sel = q(selector);
    const old = getData(_sel);
    const tooltip = {selector, text, position, placement};
    createTooltip(tooltip);
    setData(_sel, tooltip);

    return old;
}

export const removeTooltipFromDomNode = (selector: string): Tooltip | undefined => {
    const _sel = q(selector);
    const old = getData(_sel);
    console.log("remove: " + selector);
    console.log(old);
    ($(_sel) as any).protipHide();
    resetData(_sel);

    return old;
}

export const addTooltipToDomNodeStep = (selector: string, text: string, position: string, placement: string): Step => {
    let old: Tooltip;

    const f = () => {
        old = addTooltipToDomNode(selector, text, position, placement)
    }

    const b = () => {
        if(old && old.text && old.text.length > 0) {
            addTooltipToDomNode(old.selector, old.text, old.position, old.placement);
        }
        else {
            removeTooltipFromDomNode(selector);
        }
    }

    return new Step(f, b);
}

export const removeTooltipFromDomNodeStep = (selector: string): Step => {
    let old: Tooltip;

    const f = () => {
        old = removeTooltipFromDomNode(selector);
    }

    const b = () => {
        if(old && old.text && old.text.length > 0) {
            addTooltipToDomNode(old.selector, old.text, old.position, old.placement);
        }
    }

    return new Step(f, b);
}

export const createTooltips = (tooltips: Tooltip[]) => {
    reset();
    tooltips.forEach(tooltip => {
        tooltip && createTooltip(tooltip)
    })
}

export const tooltip = {
    create: createTooltip,
    addTooltipToDomNode,
    addTooltipToDomNodeStep,
    removeTooltipFromDomNode,
    removeTooltipFromDomNodeStep,
}
