import * as Vivus from "vivus";
import * as d3 from "d3";

import {slideName} from '../core/core';

const rough = require("roughjs/dist/rough.umd");

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

interface Rect {
    upperLeftX: number,
    upperLeftY: number,
    width: number,
    height: number
}

interface Options {
    fill?: string,
    fillStyle?: string,
    roughness?: number
}

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

    rectProzFromRect(rect: Rect, id: string, upperLeftXProz: number, upperLeftYProz: number, widthProz: number, heightProz: number, text?: string, options: Options = {}): Rect {
        const upperLeftX = rect.width * upperLeftXProz + rect.upperLeftX;
        const upperLeftY = rect.height * upperLeftYProz + rect.upperLeftY;
        const width = rect.width * widthProz;
        const height = rect.height * heightProz;

        this.rect(id, upperLeftX, upperLeftY, width, height, text, options);

        return {upperLeftX, upperLeftY, width, height}
    }

    rectProz(id: string, upperLeftXProz: number, upperLeftYProz: number, widthProz: number, heightProz: number, text?: string, options: Options = {}): Rect {
        const upperLeftX = screenWidth * upperLeftXProz;
        const upperLeftY = screenHeight * upperLeftYProz;
        const width = screenWidth * widthProz;
        const height = screenHeight * heightProz;

        this.rect(id, upperLeftX, upperLeftY, width, height, text, options);

        return {upperLeftX, upperLeftY, width, height}
    }

    async rect(id: string, upperLeftX: number, upperLeftY: number, width: number, height: number, text: string,
               {fill = "pink", fillStyle = "solid", roughness = 3}: Options) {
        const node = this.r.rectangle(upperLeftX, upperLeftY, width, height, {fill, fillStyle, roughness});
        const qid = await this.add(node, id);

        if (text) {
            d3.select(`#${qid}`)
                .append("text")
                .attr("class", "rect-text")
                .attr("font-family", "Mansalva")
                .attr("x", upperLeftX + 20)
                .attr("y", upperLeftY + 50)
                .text(text);
        }
    }
}

export const createSketch = (svgElement: SVGElement) => {
    return new Sketch(svgElement);
}
