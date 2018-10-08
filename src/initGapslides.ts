import {slidAR} from './slidarClassic/slidAR';
import {steps} from './slidar2/steps/steps';
import {lifecycle} from './slidar2/lifecycle/lifecycle';
import {core} from './slidar2/core/core';
import {controlElements} from './slidar2/html/controlElements';

export const init = () => {
    const gapslides = {
        controlElements,
        core,
        lifecycle,
        steps,
        ...slidAR
    } as any

    (window as any).gapslides = gapslides;
}
