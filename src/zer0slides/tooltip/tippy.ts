import * as d3 from "d3";
import tippy, {Instance, Placement} from 'tippy.js';
import {getData, setData, resetData} from '../core/data';
import {Step} from '../core/Step';
import {Tooltip, createTooltipSelector} from "./_tooltip";

import '../less/tippy.less';
import {q, selector} from "../selector/selector";
import {addCleanFunction} from "../lifecycle/lifecycle";
import {slideCore} from "../core/core";

let theme = "transparent";
export const setTheme = (_theme: string) => {
    theme = _theme;
}

export const initTooltip = () => {
    addCleanFunction(cleanAfterSlideFinished);
}

const cleanAfterSlideFinished = () => {
    d3.selectAll(".tippy-popper").remove();
}

export const createTooltip = (tooltip: Tooltip) => {
    const selector = q(createTooltipSelector(tooltip));

    const options = {
        content: tooltip.text,
        sticky: true,
        hideOnClick: false,
        trigger: "manual",
        theme,
        animateFill: false,
        arrow: true,
        placement: (tooltip.position ? tooltip.position : "bottom") as Placement
    }

    let instance = (document.querySelector(selector) as any)._tippy;
    if(instance) {
        instance.set(options);
    } else {
        instance = tippy(selector, options)[0];
    }

    instance.show();
}

export const addTooltipToDomNode = (selector: string, text: string, position?: string, placement?: string): Tooltip | undefined => {
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
    const element: any = (document.querySelector(_sel) as any);
    if(element) {
        const instance = element._tippy;
        if(slideCore.getCurrentSlide().hideToRemoveTippy) {
            instance && instance.hide();
        } else {
            instance && instance.destroy();
        }
    }
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

export const initElementForTippy = (selector: string) => {
    d3.selectAll(selector).attr("data-tippy-content", "init")
}

export const createTooltips = (tooltips: Tooltip[]) => {
    tooltips.forEach(tooltip => {
        tooltip && createTooltip(tooltip)
    })
}
