import {Step} from "../core/Step";
import {slideCore} from '../core/core';

const setSteps = (_steps: Step[]) => {
    const slideName = slideCore.getCurrentSlide().name;
    const slide = slideCore.getSlide(slideName);
    slide.steps = _steps;
}

const createReverseStep = (step: Step) => {
    const reverseStep = new Step(step.b, step.f);
    return {step, reverseStep}
}

const createStep = (f: () => void, b: () => void) => {
    return new Step(f, b);
}

export const autoStepOn = (intervalInMs: number) => {
    slideCore.getCurrentSlide().autoStepOn(intervalInMs);
}

export const steps = {
    createStep,
    createReverseStep,
    setSteps,
    autoStepOn,
}
