import tippy from "tippy.js";
import * as d3 from "d3";

import {positions} from "./positions";

const getTippyObject = (selector: string) => {
    const tippyObject = () => (document.querySelector(selector) as any)._tippy;

    if(!tippyObject()) {
        document.querySelector(selector).setAttribute("data-tippy-content", "");
        tippy(selector, {
            trigger: "manual",
            onMount: () => doRender("ol.positions")
        });
    }

    return tippyObject();
}

export const renderPositions = (target: string) => {
    const tippyObject = getTippyObject(target);
    console.log(tippyObject);
    tippyObject.setContent("<ol class='positions'></ol>");
    if(!tippyObject.state.isShown) {
        tippyObject.show();
    }
}

const doRender = (rootSelector: string) => {
    const userNames = Object.keys(positions);
    const root = d3.select(rootSelector);
    root.selectAll("li.position")
        .data(userNames)
        .enter()
        .append("li")
        .attr("class", "position")
        .text(d => d)
}
