import * as d3 from 'd3';
import {q, selector} from '../selector/selector';

export const showText = (selector, text) => {
    const root = d3.select(q(selector));
    root.text(text);
}

export const setAttribute = (selector: string, attributeName: string, text: string) => {
    const root = d3.select(q(selector));
    root.attr(attributeName, text);
}

export const text = {
    showText,
    setAttribute,
}