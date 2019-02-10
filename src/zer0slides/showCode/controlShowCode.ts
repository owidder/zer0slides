import {slideCore} from '../core/core';
import {switchToBlack} from './showCode';

export const switchCurrentSlideToBlack = () => {
    const selector = slideCore.getCurrentSlideSelector();
    switchToBlack(selector);
}
