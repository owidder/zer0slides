import * as $ from 'jquery';

import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

import {steps} from '../steps/steps';
import {Step} from '../core/Step';
import {scrollToCurrentLine} from './scroll';

const {createReverseStep} = steps;

const prism = require("prismjs");
require("prismjs/plugins/line-numbers/prism-line-numbers");
require("prismjs/plugins/line-highlight/prism-line-highlight");
require("prismjs/components/prism-bash");
require("prismjs/components/prism-javascript");
require("prismjs/components/prism-css");

interface ShowCodeOptions {
    backgroundColor?: boolean,
    lineNumbers?: boolean
}

const refresh = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            prism.highlightAll();
            resolve();
        }, 0);
    })
}

const render = (selector: string, language: string, _string: string, options: ShowCodeOptions) => {
    const html = prism.highlight(_string, prism.languages[language]);
    const style = options.backgroundColor ? `background-color: ${options.backgroundColor};` : "background-color: transparent";
    const lineNumbersClass = options.lineNumbers ? "line-numbers" : "";
    $(selector).html(`<pre style="${style}" class="language-${language} ${lineNumbersClass}"><code>${html}</code></pre>`);
    return refresh();
}

export const css = (selector: string, cssString: string, options: ShowCodeOptions = {}) => {
    return render(selector, "css", cssString, options);
}

export const js = (selector: string, jsString: string, options: ShowCodeOptions = {}) => {
    return render(selector, "javascript", jsString, options);
}

export const bash = (selector: string, jsString: string, options: ShowCodeOptions = {}) => {
    console.log("bash")
    return render(selector, "clike", jsString, options);
}

export const remove = (selector: string) => {
    $(selector).empty();
}

export const highlightLines = (selector: string, lineString: string) => {
    const _sel = `${selector} pre`;
    const old = $(_sel).attr("data-line");
    if(lineString) {
        $(_sel).attr("data-line", lineString);
    }
    else {
        $(_sel).removeAttr("data-line");
        $(`${_sel} div.line-highlight`).remove();
    }
    refresh();

    setTimeout(scrollToCurrentLine, 1000);

    return old;
}

export const highlightLinesStep = (selector: string, linesString: string) => {
    let old;
    return new Step(() => old = highlightLines(selector, linesString), () => highlightLines(selector, old))
}

export const cssStep = (selector: string, cssString: string) => {
    return new Step(() => css(selector, cssString), () => remove(selector))
}

export const jsStep = (selector: string, jsString: string) => {
    return new Step(() => js(selector, jsString), () => remove(selector))
}

export const cssStepWithReverse = (selector: string, cssString: string) => {
    const step = cssStep(selector, cssString);
    return createReverseStep(step);
}

export const jsStepWithReverse = (selector: string, jsString: string) => {
    const step = jsStep(selector, jsString);
    return createReverseStep(step);
}

export const switchToBlack = (selector: string) => {
    $(`${selector} .token`).addClass("onlyBlack");
}

export const showCode = {
    all: bash,
    css,
    js,
    bash,
    remove,
    cssStep,
    cssStepWithReverse,
    jsStep,
    jsStepWithReverse,
    highlightLines,
    highlightLinesStep,
    switchToBlack
}
