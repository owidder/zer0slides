import * as Vivus from "vivus";
import * as d3 from "d3";

import {slideName} from '../core/core';
import {Step} from '../core/Step';
import {q} from "../selector/selector";

const rough = require("roughjs/dist/rough.umd");

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

interface Rect {
    upperLeftX: number,
    upperLeftY: number,
    width: number,
    height: number
}

type RectOrFunc = Rect | (() => Rect);

interface Options {
    fill?: string,
    fillStyle?: string,
    roughness?: number,
    container?: string,
    strokeWidth?: number,
    stroke?: string,
    bowing?: number
}

class Sketch {

    private svgElement: SVGElement;

    r: any;

    constructor(svgElement: SVGElement) {
        console.log("Sketch");
        this.svgElement = svgElement;
        this.r = rough.svg(svgElement);
    }

    qid(id: string): string {
        return `${slideName()}-${id}`;
    }

    add(node: HTMLElement, id: string, containerSelector?: string, duration = 50, type = "sync") {
        const qid = this.qid(id);
        node.setAttribute("id", qid);

        if(containerSelector) {
            const containerElement = document.querySelector(q(containerSelector))
            containerElement.appendChild(node);
        } else {
            this.svgElement.appendChild(node);
        }

        new Vivus(qid, {duration, type});
    }

    rectProzFromRect(rect: Rect, upperLeftXProz: number, upperLeftYProz: number, widthProz: number, heightProz: number): Rect {
        const upperLeftX = rect.width * upperLeftXProz + rect.upperLeftX;
        const upperLeftY = rect.height * upperLeftYProz + rect.upperLeftY;
        const width = rect.width * widthProz;
        const height = rect.height * heightProz;

        return {upperLeftX, upperLeftY, width, height}
    }

    rectProzFromElement(selector: string, upperLeftXProz: number, upperLeftYProz: number, widthProz: number, heightProz: number): Rect {
        const rect = this.rectFromElement(selector);
        const upperLeftX = rect.width * upperLeftXProz + rect.upperLeftX;
        const upperLeftY = rect.height * upperLeftYProz + rect.upperLeftY;
        const width = rect.width * widthProz;
        const height = rect.height * heightProz;

        return {upperLeftX, upperLeftY, width, height}
    }

    rectProz(upperLeftXProz: number, upperLeftYProz: number, widthProz: number, heightProz: number): Rect {
        const upperLeftX = screenWidth * upperLeftXProz;
        const upperLeftY = screenHeight * upperLeftYProz;
        const width = screenWidth * widthProz;
        const height = screenHeight * heightProz;

        return {upperLeftX, upperLeftY, width, height}
    }

    createRect(id: string, rectOrFunc: RectOrFunc, text: string, options: Options) {
        const rect = rectOrFunc instanceof Function ? rectOrFunc() : rectOrFunc;

        const {fill = "pink", fillStyle = "solid", roughness = 1, container} = options;
        const node = this.r.rectangle(rect.upperLeftX, rect.upperLeftY, rect.width, rect.height, {...options, fill, fillStyle, roughness});
        this.add(node, id, container);

        if (text) {
            d3.select(`#${this.qid(id)}`)
                .append("text")
                .attr("class", "rect-text")
                .attr("font-family", "Mansalva")
                .attr("x", rect.upperLeftX + 10)
                .attr("y", rect.upperLeftY + 30)
                .text(text);
        }
    }

    rectFromElement(selector: string): Rect {
        const element = document.querySelector(q(selector));
        const boundingClientRext = element.getBoundingClientRect();
        return {
            upperLeftX: boundingClientRext.left,
            upperLeftY:boundingClientRext.top,
            height: boundingClientRext.height,
            width: boundingClientRext.width
        }
    }

    getCenter = (selector: string): {x: number, y: number} => {
        const el = document.querySelector(q(selector));
        const boundingRect = el.getBoundingClientRect();
        const x = boundingRect.left + boundingRect.width/2;
        const y = boundingRect.top + boundingRect.height/2;

        return {x, y}
    }

    createLine(id: string, fromSelector: string, toSelector: string, options: Options) {
        const fromCenter = this.getCenter(fromSelector);
        const toCenter = this.getCenter(toSelector);

        const node = this.r.line(fromCenter.x, fromCenter.y, toCenter.x, toCenter.y, options);
        this.add(node, id, options.container);
    }

    createLineStep(id: string, fromSelector: string, toSelector: string, options: Options = {}) {
        const {strokeWidth = 2, bowing = 4, stroke = "blue"} = options;
        const f = () => {
            this.createLine(id, fromSelector, toSelector, {...options, strokeWidth, bowing, stroke});
        }

        const b = () => {
            d3.select(`#${this.qid(id)}`).remove();
        }

        return new Step(f, b)
    }

    createRectStep(id: string, rectOrFunc: RectOrFunc, text: string, options: Options = {}) {
        const f = () => {
            this.createRect(id, rectOrFunc, text, options);
        }

        const b = () => {
            d3.select(`#${this.qid(id)}`).remove();
        }

        return new Step(f, b)
    }
}

export const createSketch = (svgElement: SVGElement) => {
    return new Sketch(svgElement);
}
