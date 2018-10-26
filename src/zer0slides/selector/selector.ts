import {slideName} from '../core/core';

export const q = (selector: string) => {
    return `#${slideName()} ${selector}`;
}