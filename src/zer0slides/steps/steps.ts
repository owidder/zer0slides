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

const addStep = (_step: Step) => {
    const slide = getCurrentSlide();
    slide.addStep(_step);
}

const reverse = (step: Step) => new Step(step.b, step.f);

const createReverseStep = (step: Step) => {
    return {step, reverse: reverse(step)}
}

const callDelayedRecursively = (functions: Array<() => void>, index: number) => {
    if(index < functions.length) {
        setTimeout(() => {
            functions[index]();
            callDelayedRecursively(functions, index + 1);
        }, 0)
    }
}

const combineSteps2 = (...steps: Step[]): Step => {
    const f = () => {
        const functions = steps.map(step => step.f);
        callDelayedRecursively(functions, 0);
    }

    const b = () => {
        const functions = [...steps].reverse().map(step => step.b);
        callDelayedRecursively(functions, 0);
    }

    return new Step(f, b);
}

const combineSteps = (...steps: Step[]): Step => {
    const f = () => {
        steps.forEach(step => step.f());
    }

    const b = () => {
        const functions = [...steps].reverse().forEach(step => step.b());
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
    addStep,
    createStep,
    createReverseStep,
    setSteps,
    autoStepOn,
    combineSteps,
    reverse,
}
