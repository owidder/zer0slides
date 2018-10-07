import {slidAR} from './slidarClassic/slidAR';
import {steps} from './slidar2/steps/steps';
import {lifecycle} from './slidar2/lifecycle/lifecycle';

export const init = () => {
    const gapslides = {
        lifecycle,
        steps,
        ...slidAR
    } as any

    (window as any).gapslides = gapslides;
}
