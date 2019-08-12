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
    tippyObject.setContent(`<div class='${ROOT_CLASS_NAME}'></div>`);
    if(!tippyObject.state.isShown) {
        tippyObject.show();
    }
}

const createTable = () => {
    const root = d3.select(`.${ROOT_CLASS_NAME}`);
    const table = root.selectAll("table").data([1]).enter().append("table");
    const tr = table.append("thead").append("tr");
    tr.append("th").text("name");
/*
    tr.append("th").text("slide#");
    tr.append("th").text("step#");
*/
    table.append("tbody")
}

export const updatePositionTable = () => {
    console.log(">>> updatePositionTable ");
    console.log(positions);
    console.log("<<< updatePositionTable ");

    createTable();
    const userNames = Object.keys(positions).sort();
    const tbody = d3.select(`.${ROOT_CLASS_NAME} tbody`);
    const data = tbody.selectAll("tr.position").data(userNames, d => d);

    const trEnter = data.enter()
        .append("tr")
        .attr("class", "position")

    trEnter.append("td")
        .attr("class", "position-name position")

/*
    trEnter.append("td")
        .attr("class", "position-slideno position")

    trEnter.append("td")
        .attr("class", "position-stepno position")
*/


    tbody.selectAll("td.position-name")
        .text(d => d)

/*
    tbody.selectAll("td.position-slideno")
        .text(d => positions[d] ? positions[d].slideNo : "")

    tbody.selectAll("td.position-stepno")
            .text(d => positions[d] ? positions[d].stepNo : "")
*/

    data.exit().remove()
}
