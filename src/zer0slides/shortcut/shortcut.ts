import {slideCore} from '../core/core';
import {Step} from '../core/Step';

const openShortcutSlide = () => {
    const url = slideCore.getShortCutSlideUrl();
    window.open(url, "_blank");
}

const setShurtcutSlideIndexStep = (index: number) => {
    let oldIndex;
    return new Step(() => {
        oldIndex = slideCore.shortcutSlideIndex;
        slideCore.shortcutSlideIndex = index;
    }, () => {
        slideCore.shortcutSlideIndex = oldIndex;
    })
}

export const shortcut = {
    openShortcutSlide,
    setShurtcutSlideIndexStep,
}
