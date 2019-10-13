import * as d3 from "d3";
import {q, selector} from "../selector/selector";
import {Step} from '../core/Step';

const translateY = (selector: string, tlY: number) => {
    d3.select(q(selector))
        .attr("transform", `translateY(${tlY})`)
}

const cancelAll = (selector: string) => {
    d3.select(q(selector))
        .attr("transform", null)
}

export const yStep = (selector: string, tlY: number) => {
    const f = () => {
        translateY(selector, tlY)
    }

    const b = () => {
        translateY(selector, -tlY)
    }

    return new Step(f, b)
}
