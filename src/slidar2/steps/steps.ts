import {slidarGlobal} from '../slidarGlobal';
import {Step} from "../core/Step";

const {core} = slidarGlobal;

const setSteps = (slideName: string, _steps: Step[]) => {
    const slide = core.getSlide(slideName);
    slide.steps = _steps;
}

const createReverseStep = (step: Step) => {
    const reverseStep = {f: step.b, b: step.f}
    return {step, reverseStep}
}

export const steps = {
    createReverseStep,
    setSteps,
}
