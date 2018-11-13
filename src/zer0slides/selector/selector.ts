import {slideName} from '../core/core';

export const q = (_selector: string) => {
    if(_selector.startsWith('#')) {
        return _selector;
    }
    return `#${slideName()} ${_selector}`;
}

export const selector = {
    q
}
