import tippy from "tippy.js";
import * as d3 from "d3";

import "./renderPositions.scss";

import {positions, registerPositionChangedCallback} from "./positions";

const ROOT_CLASS_NAME = "positions";

const getTippyObject = (selector: string) => {
    const tippyObject = () => (document.querySelector(selector) as any)._tippy;

    if(!tippyObject()) {
        document.querySelector(selector).setAttribute("data-tippy-content", "");
        tippy(selector, {
            theme: "transparent",
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
    tippyObject.setContent(`<table><thead><tr><th>name</th><th>slide#</th><th>step#</th></tr></thead><tbody class='${ROOT_CLASS_NAME}'></tbody></table>`);
    if(!tippyObject.state.isShown) {
        tippyObject.show();
    }
}

export const updatePositionTable = () => {
    const userNames = Object.keys(positions);
    const root = d3.select(`.${ROOT_CLASS_NAME}`);
    const data = root.selectAll("tr.position").data(userNames);

    const trEnter = data.enter()
        .append("tr")
        .attr("class", "position")

    trEnter.append("td")
        .attr("class", "position-name position")

    trEnter.append("td")
        .attr("class", "position-slideno position")

    trEnter.append("td")
        .attr("class", "position-stepno position")


    root.selectAll("td.position-name")
        .text(d => d)

    root.selectAll("td.position-slideno")
        .text(d => positions[d].slideNo)

    root.selectAll("td.position-stepno")
            .text(d => positions[d].stepNo)

    data.exit().remove()
}
