import {SimplePromise} from '../core/SimplePromise';

export const initReadyPromise = new SimplePromise<number>();

const initReady = (startIndex: number) => {
    initReadyPromise.resolve(startIndex);
}

const slideReadyPromises: {[key: string]: SimplePromise<void>} = {};

export const resetSlideReadyPromise = (name: string) => {
    slideReadyPromises[name] = new SimplePromise();
}

const slideReady = (name: string) => {
    slideReadyPromises[name].resolve();
}

export const slideReadyPromise = (name: string) => {
    return slideReadyPromises[name];
}

export const lifecycle = {
    initReady,
    slideReady,
}
