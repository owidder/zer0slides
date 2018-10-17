import * as $ from 'jquery';

import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

import {steps} from '../steps/steps';
import {Step} from '../core/Step';

const {createReverseStep} = steps;

const Prism = (window as any).Prism;

const refresh = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            Prism.highlightAll();
            resolve();
        }, 0);
    })
}

const render = (selector: string, language: string, _string: string) => {
    const html = Prism.highlight(_string, Prism.languages[language]);
    $(selector).html(`<pre class="language-${language} line-numbers"><code>${html}</code></pre>`);
    return refresh();
}

export const css = (selector: string, cssString: string) => {
    return render(selector, "css", cssString);
}

export const js = (selector: string, jsString: string) => {
    return render(selector, "javascript", jsString);
}

export const bash = (selector: string, jsString: string) => {
    return render(selector, "clike", jsString);
}

export const remove = (selector: string) => {
    $(selector).empty();
}

export const highlightLines = (selector: string, lineString: string) => {
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
