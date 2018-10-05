import {slidAR} from './slidarClassic/slidAR';
import {steps} from './slidar2/steps/steps';

export const init = () => {
    const gapslides = {
        steps,
        ...slidAR
    } as any

    (window as any).gapslides = gapslides;
}
