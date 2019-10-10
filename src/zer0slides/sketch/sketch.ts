import * as Vivus from "vivus";
import * as d3 from "d3";

import {slideName} from '../core/core';
import {q} from "../selector/selector";

const rough = require("roughjs/dist/rough.umd");

class Sketch {

    private svgElement: SVGElement;

    r: any;

    constructor(svgElement: SVGElement) {
        console.log("Sketch");
        this.svgElement = svgElement;
        this.r = rough.svg(svgElement);
    }

    add(node: HTMLElement, id: string, duration = 50, type = "sync") {
        const qid = `${slideName()}-${id}`;
        node.setAttribute("id", qid);
        this.svgElement.appendChild(node);

        return new Promise((resolve) => {
            new Vivus(qid, {duration, type});
            setTimeout(() => {
                resolve(qid)
            }, duration)
        })
    }

    async rect(id: string, upperLeftX: number, upperLeftY: number, width: number, height: number, text?: string, fill = "pink", fillStyle?: string) {
        const node = this.r.rectangle(upperLeftX, upperLeftY, width, height, {fill, fillStyle, roghness: 3});
        const qid = await this.add(node, id);

        if(text) {
            d3.select(`#${qid}`)
                .append("text")
                .attr("class", "rect-text")
                .attr("font-family", "Mansalva")
                .attr("x", 20)
                .attr("y", 50)
                .text(text);
        }
    }
}

export const createSketch = (svgElement: SVGElement) => {
    return new Sketch(svgElement);
}
