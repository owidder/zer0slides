import {slideName} from '../core/core';

export const q = (_selector: string) => {
    if(_selector.startsWith('#')) {
        return _selector;
    }
    const id = slideName();
    const prefix = id ? `#${id} ` : '';
    return `${prefix}${_selector}`;
}

export const selector = {
    q
}
