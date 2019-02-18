import {q, selector} from "../selector/selector";

export const styleFromElement = (selector: string): string => {
    const element = document.querySelector(q(selector));
    return element.getAttribute("style");
}

export const setStyleOfElement = (selector: string, style: string) => {
    const element = document.querySelector(q(selector));
    element.setAttribute("style", style);
}
