import {bind} from 'keyboardjs';

export const bindKeyToFunction = (key: string, func: () => void) => {
    bind(key, func);
}
