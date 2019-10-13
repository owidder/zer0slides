import * as d3 from "d3";

import {q} from "../selector/selector";
import {Step} from '../core/Step';

const addImage = (containerSelector: string, clazz: string, src: string) => {
    d3.selectAll(q(containerSelector))
        .append("img")
        .attr("class", clazz)
        .attr("src", src)
}

const remove = (clazz: string) => {
    d3.selectAll(q(`.${clazz}`)).remove()
}

export const addImageStep = (containerSelector: string, clazz: string, src: string) => {
    const f = () => {
        addImage(containerSelector, clazz, src)
    }

    const b = () => {
        remove(clazz)
    }

    return new Step(f, b)
}
