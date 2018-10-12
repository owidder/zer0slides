import * as React from "react";
import * as ReactDOM from "react-dom";

import {Slide} from "./Slide";
import {HtmlSlide} from '../html/HtmlSlide';

export const renderSlide = (slide: Slide, oldSlide?: Slide, safeMode: boolean = false) => {
    if(oldSlide) {
        const transformOutReady = new Promise(resolve => {
            ReactDOM.render(<HtmlSlide slide={oldSlide}
                                       safeMode={safeMode}
                                       action="transform-out"
                                       transformReadyCallback={resolve}
                                       transformType="Z"
            />, document.getElementById('root') as HTMLElement);
        })

        transformOutReady.then(() => {
            ReactDOM.render(<HtmlSlide slide={slide} safeMode={safeMode} action="transform-in" transformType="Left"/>,
                document.getElementById('root') as HTMLElement);
        })
    }
    else {
        ReactDOM.render(<HtmlSlide slide={slide} safeMode={safeMode} action="show"/>,
            document.getElementById('root') as HTMLElement);
    }
}
