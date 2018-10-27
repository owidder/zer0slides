import {slideName} from '../core/core';

export const q = (_selector: string) => {
    return `#${slideName()} ${_selector}`;
}

export const selector = {
    q
}
