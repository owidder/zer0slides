import {SimplePromise} from '../core/SimplePromise';
import {slideName} from '../core/core';

const cleanFunctions: Array<() => void> = [];

export const addCleanFunction = (cleanFunction: () => void) => {
    cleanFunctions.push(cleanFunction);
}

export const cleanAfterSlideFinished = () => {
    cleanFunctions.forEach(cleanFunction => cleanFunction());
}

export const initReadyPromise = new SimplePromise<number>();

const initReady = (startIndex = 0) => {
    initReadyPromise.resolve(startIndex);
}

const slideReadyPromises: {[key: string]: SimplePromise<void>} = {};

export const resetSlideReadyPromise = (name: string) => {
    slideReadyPromises[name] = new SimplePromise();
}

const slideReady = () => {
    const name = slideName();
    slideReadyPromises[name] && slideReadyPromises[name].resolve();
}

export const slideReadyPromise = (name: string) => {
    return slideReadyPromises[name];
}

export const lifecycle = {
    initReady,
    slideReady,
}
