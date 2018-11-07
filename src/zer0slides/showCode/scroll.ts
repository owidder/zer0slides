import * as $ from 'jquery';

import {slideCore} from '../core/core';

export const scrollToCurrentLine = () => {
    const slideSelector = slideCore.getCurrentSlideSelector();
    const selector = `${slideSelector} .line-highlight`;
    const offset = $(selector).offset().top;
    $("html, body").animate({scrollTop: offset}, 800);
}
