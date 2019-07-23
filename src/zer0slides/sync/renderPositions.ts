import tippy from 'tippy.js';

const getTippyObject = (selector: string) => {
    const tippyObject = () => (document.querySelector(selector) as any)._tippy;

    if(!tippyObject()) {
        document.querySelector(selector).setAttribute("data-tippy-content", "");
        tippy(selector, {trigger: "manual"});
    }

    return tippyObject();
}

export const renderPositions = (target: string) => {
    const tippyObject = getTippyObject(target);
    console.log(tippyObject);
    tippyObject.setContent("<h1>123</h1>");
    if(!tippyObject.state.isShown) {
        tippyObject.show();
    }
}
