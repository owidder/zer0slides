import tippy from "tippy.js";
import * as d3 from "d3";

import {positions, registerPositionChangedCallback} from "./positions";

const ROOT_CLASS_NAME = "positions";

const getTippyObject = (selector: string) => {
    const tippyObject = () => (document.querySelector(selector) as any)._tippy;

    if(!tippyObject()) {
        document.querySelector(selector).setAttribute("data-tippy-content", "");
        tippy(selector, {
            trigger: "manual",
            onMount: () => {
                registerPositionChangedCallback(() => updatePositionTable())
            }
        });
    }

    return tippyObject();
}

export const renderPositions = (target: string) => {
    const tippyObject = getTippyObject(target);
    console.log(tippyObject);
    tippyObject.setContent(`<ol class='${ROOT_CLASS_NAME}'></ol>`);
    if(!tippyObject.state.isShown) {
        tippyObject.show();
    }
}

export const updatePositionTable = () => {
    const userNames = Object.keys(positions);
    const root = d3.select(`.${ROOT_CLASS_NAME}`);
    const data = root.selectAll("li.position").data(userNames);

    data.enter()
        .append("li")
        .attr("class", "position")
        .merge(data)
        .text(d => `${d}: ${positions[d].slideNo} / ${positions[d].stepNo}`)

    data.exit().remove()
}
