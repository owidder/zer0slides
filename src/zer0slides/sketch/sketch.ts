import * as Vivus from "vivus";

import {slideName} from '../core/core';

const rough = require("roughjs/dist/rough.umd");

class Sketch {

    private svgElement: SVGElement;

    r: any;

    constructor(svgElement: SVGElement) {
        this.svgElement = svgElement;
        this.r = rough.svg(svgElement);
    }

    add(node: HTMLElement, id: string, duration = 300, type = "sync") {
        const qid = `${slideName()}-${id}`;
        node.setAttribute("id", qid);
        this.svgElement.appendChild(node);

        new Vivus(qid, {duration, type});
    }

    rect(upperLeftX: number, upperLeftY: number, width: number, height: number, text: string, color = "red", fillStyle = "solid") {
        
    }
}

export const createSketch = (svgElement: SVGElement) => {
    return new Sketch(svgElement);
}
