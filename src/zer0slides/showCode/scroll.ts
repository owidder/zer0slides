import * as $ from 'jquery';

import {slideCore} from '../core/core';

export const scrollToCurrentLine = () => {
    const slideSelector = slideCore.getCurrentSlideSelector();
    const selector = `${slideSelector} .line-highlight`;
    const domElement = $(selector);
    domElement.animate({scrollTop: 20}, 800);
}
