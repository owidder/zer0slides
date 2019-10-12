import anime from "animejs/lib/anime.es";

import {q} from "../selector/selector";
import {Step} from '../core/Step';

export const moveY = (selector: string, translateY: number) => {
    return anime({
        targets: q(selector),
        translateY
    })
}

export const moveYStep = (selector: string, translateY: number) => {
    let _anime;
    const f = () => {
        _anime = moveY(selector, translateY);
    }
    const b = () => {
        _anime.reverse();
    }

    return new Step(f, b)
}
