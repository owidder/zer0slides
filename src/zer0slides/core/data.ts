import * as d3 from 'd3';
import {selector} from "../selector/selector";

export const setData = (selector: string, data: any) => {
    d3.select(selector)
        .attr("__z0__", data);
}

export const getData = (selector: string): any => {
    return d3.select(selector).attr("__z0__");
}

