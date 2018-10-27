import {SimplePromise} from '../core/SimplePromise';
import {slideName} from '../core/core';

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
    slideReadyPromises[name].resolve();
}

export const slideReadyPromise = (name: string) => {
    return slideReadyPromises[name];
}

export const lifecycle = {
    initReady,
    slideReady,
}
