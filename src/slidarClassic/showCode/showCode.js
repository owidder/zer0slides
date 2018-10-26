import * as $ from 'jquery';

import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

import {steps} from '../../zer0slides/steps/steps';
import {Step} from '../../zer0slides/core/Step';

const {createReverseStep} = steps;

const Prism = window.Prism;

const refresh = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            Prism.highlightAll();
            resolve();
        }, 0);
    })
}

const render = (selector, language, _string) => {
    const html = Prism.highlight(_string, Prism.languages[language]);
    $(selector).html(`<pre class="language-${language} line-numbers"><code>${html}</code></pre>`);
    return refresh();
}

export const css = (selector, cssString) => {
    return render(selector, "css", cssString);
}

export const js = (selector, jsString) => {
    return render(selector, "javascript", jsString);
}

export const bash = (selector, jsString) => {
    return render(selector, "clike", jsString);
}

export const remove = (selector) => {
    $(selector).empty();
}

export const highlightLines = (selector, lineString) => {
    console.log(lineString);
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

    return old;
}

export const highlightLinesStep = (selector, linesString) => {
    let old;
    return new Step(() => old = highlightLines(selector, linesString), () => highlightLines(selector, old))
}

export const cssStep = (selector, cssString) => {
    return new Step(() => css(selector, cssString), () => remove(selector))
}

export const jsStep = (selector, jsString) => {
    return new Step(() => js(selector, jsString), () => remove(selector))
}

export const cssStepWithReverse = (selector, cssString) => {
    const step = cssStep(selector, cssString);
    return createReverseStep(step);
}

export const jsStepWithReverse = (selector, jsString) => {
    const step = jsStep(selector, jsString);
    return createReverseStep(step);
}

export const showCode = {
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
