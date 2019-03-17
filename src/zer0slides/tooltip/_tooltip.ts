import {slideCore} from "../core/core";

export interface Tooltip {
    lineIndex?: number,
    selector?: string,
    text: string,
    position?: string,
    placement?: string,
}

export const createTooltipSelector = (tooltip: Tooltip) => {
    if(tooltip.selector) {
        return tooltip.selector;
    }

    const nth = tooltip.lineIndex > 0 ? tooltip.lineIndex + 1 : 1;
    const slideSelector = slideCore.getCurrentSlideSelector();
    const selector = `${slideSelector} .line-highlight:nth-of-type(${nth})`;

    return selector;
}

