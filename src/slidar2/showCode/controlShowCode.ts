import {slideCore} from '../core/core';
import {switchToBlack} from './showCode2';

export const switchCurrentSlideToBlack = () => {
    const selector = slideCore.getCurrenzSlideSelector();
    switchToBlack(selector);
}
