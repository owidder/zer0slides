import {slidAR} from './slidarClassic/slidAR';

import {steps} from './slidar2/steps/steps';
import {lifecycle} from './slidar2/lifecycle/lifecycle';
import {core} from './slidar2/core/core';
import {controlElements} from './slidar2/html/controlElements';
import {showCode2} from './slidar2/showCode/showCode2';

export const init = () => {
    const gapslides = {
        controlElements,
        core,
        lifecycle,
        showCode2,
        steps,
        ...slidAR
    } as any

    (window as any).gapslides = gapslides;
    (window as any).slidAR = slidAR;
}
