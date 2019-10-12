import anime from "animejs/lib/anime.es";
import * as d3 from "d3";

import {q, selector} from "../selector/selector";
import {Step} from '../core/Step';

const moveY = (selector: string, translateY: number) => {
    return new Promise(resolve => {
        anime({
            targets: q(selector),
            translateY,
            complete: resolve
        })
    })
}

const scale = (selector: string, _scale: number) => {
    return new Promise(resolve => {
        anime({
            targets: q(selector),
            scale: _scale,
            complete: resolve
        })
    })

}

export const moveYStep = (selector: string, translateY: number, wait = false) => {
    const f = () => {
        const promise = moveY(selector, translateY);
        return wait ? promise : undefined;
    }
    const b = () => {
        const promise = moveY(selector, 0);
        return wait ? promise : undefined;
    }

    return new Step(f, b)
}

export const scaleStep = (selector: string, _scale: number, wait = false) => {
    const f = () => {
        const promise = scale(selector, _scale);
        return wait ? promise : undefined;
    }
    const b = () => {
        const promise = scale(selector, 1);
        return wait ? promise : undefined;
    }

    return new Step(f, b);
}