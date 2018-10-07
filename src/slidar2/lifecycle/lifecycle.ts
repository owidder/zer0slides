import {SimplePromise} from '../core/SimplePromise';

const initReadyPromise = new SimplePromise();

export const lifecycle = {
    initReadyPromise,
}
