import * as d3 from 'd3';

import {q} from '../selector/selector';

export const setClickHandler = (selector, fct: () => void) => {
    d3.selectAll(q(selector))
        .on('click', fct);
}

export const click = {
    setClickHandler,
}