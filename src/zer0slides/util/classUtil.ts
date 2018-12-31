import * as d3 from 'd3';

import {steps} from '../steps/steps';
import {Step} from '../core/Step';

const {createReverseStep} = steps;

export const setRemoveClass = (selector: string, className: string, trueToSet: boolean, intervalInMs = 0) => {
    d3.selectAll(selector)
        .each(function(_, i) {
            const element = this;
            const fct = () => {
                d3.select(element).classed(className, trueToSet);
            }
            if(intervalInMs > 0) {
                setTimeout(fct, i * intervalInMs);
            }
            else {
                fct();
            }
        })
}

export const setClass = (selector: string, className: string, intervalInMs?: number) => {
    setRemoveClass(selector, className, true, intervalInMs);
}

export const setClasses = (selector: string, classNames: string[]) => {
    classNames.forEach((className) => {
        setClass(selector, className);
    })
}

export const removeClass = (selector: string, className: string, intervalInMs?: number) => {
    setRemoveClass(selector, className, false, intervalInMs);
}

export const removeClassStep = (selector: string, className: string, intervalInMs?: number) => {
    return new Step(() => removeClass(selector, className, intervalInMs), () => setClass(selector, className, intervalInMs))
}

export const switchClasses = (selector: string, fromClass: string, toClass) => {
    setRemoveClass(selector, fromClass, false);
    setRemoveClass(selector, toClass, true);
}

export const switchClassesStep = (selector: string, fromClass: string, toClass: string) => {
    return new Step(() => switchClasses(selector, fromClass, toClass), () => switchClasses(selector, toClass, fromClass))
}

export const switchClassesStepWithReverse = (selector: string, fromClass: string, toClass: string) => {
    return createReverseStep(switchClassesStep(selector, fromClass, toClass));
}

export const removeClassStepWithReverse = (selector: string, className: string, intervalInMs: number) => {
    const step = removeClassStep(selector, className, intervalInMs);
    return createReverseStep(step);
}

export const removeClasses = (selector: string, classNames: string[]) => {
    classNames.forEach((className) => {
        removeClass(selector, className);
    })
}

const _switchBetweenClassesRecursive = (selector: string, classNames: string[], intervalInMs: number, counter: number) => {
    const oldCounter = counter;
    const newCounter = counter < classNames.length-1 ? counter+1 : 0;
    switchClasses(selector, classNames[oldCounter], classNames[newCounter]);

    setTimeout(()=> _switchBetweenClassesRecursive(selector, classNames, intervalInMs, newCounter), intervalInMs);
}

export const switchBetweenClasses = (selector: string, classNames: string[], intervalInMs?: number) => {
    setClass(selector, classNames[0]);
    setTimeout(() => _switchBetweenClassesRecursive(selector, classNames, intervalInMs, 0), intervalInMs);
}

export const setClassStep = (selector: string, className: string, intervalInMs?: number) => {
    return new Step(() => setClass(selector,className, intervalInMs), () => removeClass(selector, className, intervalInMs))
}

export const setClassStepWithReverse = (selector: string, className: string, intervalInMs?: number) => {
    const step = setClassStep(selector, className, intervalInMs);
    return createReverseStep(step);
}

export const set2Classes = (selector: string, clasName1: string, className2: string, delay: number) => {
    setClass(selector, clasName1);
    setTimeout(() => setClass(selector, className2), delay);
}

export const set2ClassesStep = (selector: string, className1: string, className2: string, delay: number) => {
    return new Step(() => set2Classes(selector, className1, className2, delay), () => removeClasses(selector, [className1, className2]))
}

export const classUtil = {
    setRemoveClass,
    setClass,
    removeClass,
    removeClassStep,
    removeClassStepWithReverse,
    setClassStep,
    setClassStepWithReverse,
    setClasses,
    removeClasses,
    set2Classes,
    set2ClassesStep,
    switchClasses,
    switchClassesStep,
    switchClassesStepWithReverse,
    switchBetweenClasses,
};
