import * as React from "react";
import * as ReactDOM from "react-dom";

import {Slide} from "./Slide";
import {HtmlSlide} from '../html/HtmlSlide';

export interface RenderOptions {
    slide: Slide,
    oldSlide?: Slide,
    safeMode?: boolean,
    inOut?: boolean,
    type?: string,
}

const firstOutThenIn = (options: RenderOptions) => {
    const transformOutReady = new Promise(resolve => {
        ReactDOM.render(<HtmlSlide slide={options.oldSlide}
                                   safeMode={options.safeMode === true}
                                   action="transform-out"
                                   transformReadyCallback={resolve}
                                   transformType="Z"
        />, document.getElementById('root') as HTMLElement);
    })

    transformOutReady.then(() => {
        ReactDOM.render(<HtmlSlide slide={options.slide} safeMode={options.safeMode === true} action="transform-in" transformType="Left"/>,
            document.getElementById('root') as HTMLElement);
    })
}

const outAndInAtOnce = (options: RenderOptions) => {
    const transformInOutReady = new Promise(resolve => {
        ReactDOM.render(<HtmlSlide slideOut={options.oldSlide} slideIn={options.slide}
                                   safeMode={options.safeMode === true}
                                   action="transform-in-out"
                                   transformReadyCallback={resolve}
                                   transformOutType="Z"
                                   transformInType="Left"
        />, document.getElementById('root') as HTMLElement);
    })

    transformInOutReady.then(() => {
        ReactDOM.render(<HtmlSlide slide={options.slide} safeMode={options.safeMode === true} action="transform-in" transformType="Left"/>,
            document.getElementById('root') as HTMLElement);
    })
}

export const renderSlide = (options: RenderOptions) => {
    if(options.oldSlide) {
        if(options.inOut) {
            outAndInAtOnce(options);
        }
        else {
            firstOutThenIn(options);
        }
    }
    else {
        ReactDOM.render(<HtmlSlide slide={options.slide} safeMode={options.safeMode === true} action="show"/>,
            document.getElementById('root') as HTMLElement);
    }
}
