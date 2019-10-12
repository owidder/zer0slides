import anime from "animejs/lib/anime.es";
import * as d3 from "d3";

import {q, selector} from "../selector/selector";
import {Step} from '../core/Step';

const moveY = (selector: string, translateY: number) => {
    return anime({
        targets: q(selector),
        translateY
    })
}

const scale = (selector: string, _scale: number) => {
    return anime({
        targets: q(selector),
        scale: _scale
    })
}

export const moveYStep = (selector: string, translateY: number) => {
    const f = () => {
        moveY(selector, translateY);
    }
    const b = () => {
        moveY(selector, 0);
    }

    return new Step(f, b)
}

export const scaleStep = (selector: string, _scale: number) => {
    const f = () => {
        scale(selector, _scale);
    }
    const b = () => {
        scale(selector, 1);
    }

    return new Step(f, b);
}