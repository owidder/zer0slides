import * as _ from 'lodash';
import {selector} from "../selector/selector";

export const setData = (selector: string, data: any) => {
    const elem: any = document.querySelector(selector);
    if(elem != null) {
        elem.__z0__ = data;
    }
}

export const getData = (selector: string): any | void => {
    const elem: any = document.querySelector(selector);
    if(elem != null) {
        return elem.__z0__;
    }
}

export const resetData = (selector: string) => {
    const elem: any = document.querySelector(selector);
    if(elem != null) {
        delete elem.__z0__;
    }
}