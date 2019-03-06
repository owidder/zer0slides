import * as $ from "jquery";
import * as d3 from "d3";

import {slideName} from '../core/core';

export const q = (_selector: string) => {
    if(_selector.startsWith('#')) {
        return _selector;
    }
    const id = slideName();
    const prefix = id ? `#${id} ` : '';
    return `${prefix}${_selector}`;
}

export const $1 = (selector: string) => {
    return $(q(selector));
}

export const selectFirst = (selector: string) => {
    return document.querySelector(q(selector));
}

export const d3select = (selector: string) => {
    return d3.select(q(selector));
}

export const selector = {
    q,
    selectFirst,
    $1,
    d3select,
}
