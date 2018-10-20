import {Step} from "../core/Step";
import {slideCore} from '../core/core';

const setSteps = (slideName: string, _steps: Step[]) => {
    const slide = slideCore.getSlide(slideName);
    slide.steps = _steps;
}

const createReverseStep = (step: Step) => {
    const reverseStep = new Step(step.b, step.f);
    return {step, reverseStep}
}

export const steps2 = {
    createReverseStep,
    setSteps,
}
