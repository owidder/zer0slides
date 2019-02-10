import * as $ from 'jquery';

import {slideCore} from '../core/core';

export const scrollToStart = () => {
    return new Promise(resolve => {
        $("html, body").animate({scrollTop: 0, scrollLeft: 0}, 10, "swing", resolve);
    })
}

export const scrollToCurrentLine = (): Promise<void> => {
    const slideSelector = slideCore.getCurrentSlideSelector();
    const selector = `${slideSelector} .line-highlight`;
    if($(selector).offset()) {
        const offset = $(selector).offset().top;
        return new Promise(resolve => {
            $("html, body").animate({scrollTop: offset}, 10, "swing", resolve);
        })
    }
    else {
        return Promise.resolve();
    }
}
