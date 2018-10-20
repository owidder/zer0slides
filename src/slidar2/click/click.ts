import * as d3 from 'd3';

export const setClickHandler = (selector, fct: () => void) => {
    d3.selectAll(selector)
        .on('click', fct);
}

export const click = {
    setClickHandler,
}