import {slidarGlobal} from '../slidarGlobal';
import {Step} from "../core/Step";

const {core} = slidarGlobal;

const setSteps = (slideName: string, _steps: Step[]) => {
    const slide = core.getSlide(slideName);
    slide.steps = _steps;
}

export const steps = {
    setSteps,
}
