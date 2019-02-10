import {slideCore} from '../core/core';
import {Step} from '../core/Step';
import {SLIDE_NAME_CONTENT} from '../html/HtmlSlide';

const openUrl = (url: string, sameTab = false, withReload?: boolean) => {
    if(sameTab) {
        window.open(url, "_self");
        if(withReload) {
            window.location.reload();
        }
    }
    else {
        window.open(url, "_blank");
    }
}

export const openShortcutSlide = () => {
    const url = slideCore.getShortCutSlideUrl();
    openUrl(url, true, true);
}

export const openContentPage = () => {
    const url = slideCore.getSlideUrl(SLIDE_NAME_CONTENT);
    const stepNo = slideCore.getCurrentIndex();
    const urlWithStep = `${url}&step=${stepNo}`;
    openUrl(urlWithStep);
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
