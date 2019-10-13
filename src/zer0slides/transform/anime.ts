import anime from "animejs/lib/anime.es";

import {q, selector} from "../selector/selector";
import {Step} from '../core/Step';

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const getAbsX = (x: number) => {
    return Math.abs(x) < 1 ? screenWidth * x : x;
}

const getAbsY = (y: number) => {
    return Math.abs(y) < 1 ? screenHeight * y : y;
}

const moveY = (selector: string, translateY: number) => {
    return new Promise(resolve => {
        anime({
            targets: q(selector),
            translateY: getAbsY(translateY),
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