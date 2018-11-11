import * as $ from 'jquery';

import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

import {steps} from '../steps/steps';
import {Step} from '../core/Step';
import {scrollToCurrentLine} from './scroll';
import {createTooltips} from './tooltip';
import {getData, setData} from '../core/data';
import {selector} from "../selector/selector";

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

interface HighlightLinesOptions {
    lines: string,
    tooltip?: string,
    position?: string,
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

const createTooltipsForHighlights = (highlightLinesOptions: HighlightLinesOptions[]) => {
    const tooltips = highlightLinesOptions.map((hlOption, index) => {
        if(hlOption.tooltip) {
            return {
                lineIndex: index,
                position: hlOption.position,
                text: hlOption.tooltip
            }
        }

        return undefined;
    })

    createTooltips(tooltips);
}

export const highlightLines2 = (selector: string, optionsArray: HighlightLinesOptions[]) => {
    const oldOptionsArray = getData(selector);
    setData(selector, optionsArray);

    const allLinesArray = optionsArray.reduce((accLinesArray, currentOption) => {
        return [...accLinesArray, currentOption.lines];
    }, []);
    const allLinesString = allLinesArray.join(",");

    highlightLines(selector, allLinesString, () => {
        createTooltipsForHighlights(optionsArray);
    });

    return oldOptionsArray;
}

export const _highlightLines = (selector: string, lines: string | HighlightLinesOptions[]): string | HighlightLinesOptions[] => {
    let old = getData(selector);
    if(!old) {
       old =  dataLine(selector);
    }

    if(typeof lines === "string") {
        highlightLines(selector, lines);
    }
    else {
        highlightLines2(selector, lines);
    }

    return old;
}

export const _highlightLinesStep = (selector: string, lines: string | HighlightLinesOptions[]) => {
    let old;
    return new Step(() => old = _highlightLines(selector, lines), () => _highlightLines(selector, old))
}

const dataLine = (selector: string, value?: string): string | void => {
    const _sel = `${selector} pre`;
    if(!value) {
        return $(_sel).attr("data-line");
    }

    $(_sel).attr("data-line", value);
}

export const highlightLines2Step = (selector: string, optionsArray: HighlightLinesOptions[]) => {
    let old;
    return new Step(() => old = highlightLines2(selector, optionsArray), () => highlightLines(selector, old))
}

export const highlightLines = (selector: string, lineString: string, callbackWhenFinished?: () => void) => {
    const _sel = `${selector} pre`;
    const old = $(_sel).attr("data-line");

    if(lineString) {
        $(_sel).attr("data-line", lineString);
        refresh().then(() => {
            setTimeout(async () => {
                await scrollToCurrentLine();
                callbackWhenFinished && callbackWhenFinished();
            }, 10);
        })
    }
    else {
        $(_sel).removeAttr("data-line");
        $(`${_sel} div.line-highlight`).remove();
        refresh().then(() => {
            callbackWhenFinished && callbackWhenFinished();
        });
    }

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
    highlightLines2,
    highlightLines2Step,
    _highlightLines,
    _highlightLinesStep,
}
