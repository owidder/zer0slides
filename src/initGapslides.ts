import * as d3 from 'd3';

import {steps} from './zer0slides/steps/steps';
import {lifecycle} from './zer0slides/lifecycle/lifecycle';
import {click} from './zer0slides/click/click';
import {core} from './zer0slides/core/core';
import {controlElements} from './zer0slides/html/controlElements';
import {showCode} from './zer0slides/showCode/showCode';
import {selector} from './zer0slides/selector/selector';
import {tooltip} from './zer0slides/showCode/tooltip';

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
    } as any

    (window as any).zer0slides = zer0slides;
    (window as any)._0 = zer0slides;
    (window as any).___ = lifecycle.slideReady;
}
