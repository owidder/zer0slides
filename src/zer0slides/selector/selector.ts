import * as $ from "jquery";

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

export const selector = {
    q,
    selectFirst,
    $1
}
