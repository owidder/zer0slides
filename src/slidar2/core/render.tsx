import * as React from "react";
import * as ReactDOM from "react-dom";

import {Slide} from "./Slide";
import {HtmlSlide} from '../html/HtmlSlide';

export const renderSlide = (slide: Slide, oldSlide?: Slide, safeMode: boolean = false) => {
    const transformOutReady = new Promise(resolve => {
        if(oldSlide) {
            ReactDOM.render(<HtmlSlide slide={oldSlide}
                                       safeMode={safeMode}
                                       action="transform-out"
                                       transformReadyCallback={resolve}
            />, document.getElementById('root') as HTMLElement);
        }
        else {
            resolve();
        }
    })

    transformOutReady.then(() => {
        ReactDOM.render(<HtmlSlide slide={slide} safeMode={safeMode} action="show"/>, document.getElementById('root') as HTMLElement);
    })
}
