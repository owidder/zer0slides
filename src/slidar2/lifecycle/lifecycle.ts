import {SimplePromise} from '../core/SimplePromise';

export const initReadyPromise = new SimplePromise<number>();

const initReady = (startIndex: number) => {
    initReadyPromise.resolve(startIndex);
}

export const lifecycle = {
    initReady,
}
