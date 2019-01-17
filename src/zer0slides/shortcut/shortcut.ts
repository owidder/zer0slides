import {slideCore} from '../core/core';
import {Step} from '../core/Step';
import {SLIDE_NAME_CONTENT} from '../html/HtmlSlide';

const openInNewTab = (url: string) => {
    window.open(url, "_blank");
}

const openShortcutSlide = () => {
    const url = slideCore.getShortCutSlideUrl();
    openInNewTab(url);
}

export const openContentPage = () => {
    const url = slideCore.getSlideUrl(SLIDE_NAME_CONTENT);
    const stepNo = slideCore.getCurrentIndex();
    const urlWithStep = `${url}&step=${stepNo}`;
    openInNewTab(urlWithStep);
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
