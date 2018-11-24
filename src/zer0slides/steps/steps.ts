import * as _ from 'lodash';

import {Step} from "../core/Step";
import {slideCore} from '../core/core';

const getCurrentSlide = () => {
    const slideName = slideCore.getCurrentSlide().name;
    return slideCore.getSlide(slideName);
}

const setSteps = (_steps: Step[]) => {
    const slide = getCurrentSlide();
    slide.steps = _steps;
}

const reverse = (step: Step) => new Step(step.b, step.f);

const createReverseStep = (step: Step) => {
    return {step, reverse: reverse(step)}
}

const combineSteps = (...steps: Step[]): Step => {
    const f = () => {
        steps.forEach(step => {
            step.f()
        });
    }

    const b = () => {
        steps.reverse().forEach(step => step.b());
    }

    return new Step(f, b);
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
    combineSteps,
    reverse,
}
