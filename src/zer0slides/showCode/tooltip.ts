import * as d3 from 'd3';
import {slideCore} from "../core/core";

interface Tooltip {
    lineIndex?: number,
    selector?: string,
    text: string,
    position?: string,
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
    const selector = createTooltipSelector(tooltip);

    d3.selectAll(selector)
        .classed("protip", true)
        .attr("data-pt-title", tooltip.text)
        .attr("data-pt-gravity", tooltip.position ? tooltip.position : true)

}

export const createTooltips = (tooltips: Tooltip[]) => {
    tooltips.forEach(tooltip => {
        tooltip && createTooltip(tooltip)
    })
}

export const tooltip = {
    create: createTooltip,
}
