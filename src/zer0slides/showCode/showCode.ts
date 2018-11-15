import * as $ from 'jquery';
import * as _ from 'lodash';

import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

import {steps} from '../steps/steps';
import {Step} from '../core/Step';
import {scrollToCurrentLine} from './scroll';
import {createTooltips, reset} from './tooltip';
import {getData, setData, resetData} from '../core/data';
import {q} from "../selector/selector";

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
    const lineNumbersClass = options.lineNumbers === false ? "" : "line-numbers";
    $(q(selector)).html(`<pre style="${style}" class="language-${language} ${lineNumbersClass}"><code>${html}</code></pre>`);
    return refresh();
}

export const css = (selector: string, cssString: string, options: ShowCodeOptions = {}) => {
    return render(selector, "css", cssString, options);
}

export const js = (selector: string, jsString: string, options: ShowCodeOptions = {}) => {
    return render(selector, "javascript", jsString, options);
}

export const bash = (selector: string, jsString: string, options: ShowCodeOptions = {}) => {
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
                text: hlOption.tooltip,
                ...hlOption
            }
        }

        return undefined;
    })

    createTooltips(tooltips);
}

export const highlightLines = (selector: string, lines: string | HighlightLinesOptions[], tooltip?: string, position?: string): string | HighlightLinesOptions[] => {
    let old = getData(selector);
    if(!old) {
       old =  dataLine(selector);
    }

    resetData(selector);

    if(typeof lines === "string") {
        if(_.isUndefined(tooltip)) {
            highlightLinesNoTooltip(selector, lines);
        }
        else {
            highlightLinesWithSimpleTooltip(selector, lines, tooltip, position);
        }
    }
    else {
        highlightLinesWithComplexTooltip(selector, lines);
    }

    return old;
}

export const highlightLinesStep = (selector: string, lines: string | HighlightLinesOptions[], tooltip?: string, position?: string) => {
    let old;
    return new Step(() => {
        old = highlightLines(selector, lines, tooltip, position);
    }, () => {
        highlightLines(selector, old);
    })
}

const dataLine = (selector: string, value?: string): string | void => {
    const _sel = `${selector} pre`;
    if(!value) {
        return $(_sel).attr("data-line");
    }

    $(_sel).attr("data-line", value);
}

const highlightLinesWithSimpleTooltip = (selector: string, lines: string, tooltip: string, position?: string) => {
    const simpleOptionsArray = [{lines, tooltip, position}];
    setData(q(selector), simpleOptionsArray);

    reset();
    highlightLinesNoTooltip(selector, lines, () => {
        createTooltipsForHighlights(simpleOptionsArray);
    });
}

const highlightLinesWithComplexTooltip = (selector: string, optionsArray: HighlightLinesOptions[] = []) => {
    setData(q(selector), optionsArray);

    const allLinesArray = optionsArray.reduce((accLinesArray, currentOption) => {
        return [...accLinesArray, currentOption.lines];
    }, []);
    const allLinesString = allLinesArray.join(",");

    reset();
    highlightLinesNoTooltip(selector, allLinesString, () => {
        createTooltipsForHighlights(optionsArray);
    });
}

const highlightLinesNoTooltip = (selector: string, lineString: string, callbackWhenFinished?: () => void) => {
    const _sel = `${q(selector)} pre`;

    if(lineString) {
        $(_sel).attr("data-line", lineString);
        refresh().then(() => {
            callbackWhenFinished && callbackWhenFinished();
            scrollToCurrentLine();
        })
    }
    else {
        $(_sel).removeAttr("data-line");
        $(`${_sel} div.line-highlight`).remove();
        refresh().then(() => {
            callbackWhenFinished && callbackWhenFinished();
        });
    }
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
}
