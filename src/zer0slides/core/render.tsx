import * as React from "react";
import * as ReactDOM from "react-dom";

import {Slide, isSpecialSlideName, getSpecialSlideType} from "./Slide";
import {HtmlSlide} from '../html/HtmlSlide';
import {ContentSlide} from '../html/ContentSlide';
import {Transformation} from '../html/transformations/Transformation';
import {slideCore} from "./core";
import {scrollToStart} from '../showCode/scroll';

export type InOut = "outAndInAtOnce" | "twin" | "firstOutThenIn";

export interface RenderOptions {
    slide: Slide,
    oldSlide?: Slide,
    inOut?: InOut,
    type?: string,
    transformInType?: Transformation,
    transformOutType?: Transformation,
}

const firstOutThenIn = (options: RenderOptions) => {
    const transformOutReady = new Promise<void>(resolve => {
        ReactDOM.render(<HtmlSlide slide={options.oldSlide}
                                   action="transform-out"
                                   transformReadyCallback={resolve}
                                   transformType={options.transformOutType || "Right"}
        />, document.getElementById('root') as HTMLElement);
    })

    return new Promise<void>(resolve => {
        transformOutReady.then(() => {
            ReactDOM.render(<HtmlSlide slide={options.slide}
                                       action="transform-in"
                                       transformReadyCallback={resolve}
                                       transformType={options.transformInType || "Left"}/>,
                document.getElementById('root') as HTMLElement);
        })
    })
}

const outAndInAtOnce = (options: RenderOptions) => {
    return new Promise<void>(resolve => {
        ReactDOM.render(<HtmlSlide slideOut={options.oldSlide} slide={options.slide}
                                   action="transform-in-out"
                                   transformReadyCallback={resolve}
                                   transformOutType={options.transformOutType || "Right"}
                                   transformType={options.transformInType || "Left"}
        />, document.getElementById('root') as HTMLElement);
    })

}

const twin = (options: RenderOptions) => {
    const twinReady = new Promise<void>(resolve => {
        ReactDOM.render(<HtmlSlide slideOut={options.oldSlide} slide={options.slide}
                                   action="twinMove"
                                   transformReadyCallback={resolve}
                                   transformType={options.transformInType || "RotateX"}
        />, document.getElementById('root') as HTMLElement);
    })

    return new Promise<void>(resolve => {
        twinReady.then(() => {
            ReactDOM.render(<HtmlSlide slide={options.slide}
                                       transformReadyCallback={resolve}
                                       action="show"/>,
                document.getElementById('root') as HTMLElement);
        })
    })
}

const newSlideActions = (slide: Slide) => {
    scrollToStart().then(() => {
        slide.performToCurrentStep().then(() => {
            slideCore.newSlideCallback();
        })
    })
}

const root = (): HTMLElement => {
    return document.getElementById('root') as HTMLElement
}

export const renderSlide = (options: RenderOptions) => {
    if (options.oldSlide) {
        new Promise(resolve => {
            switch (options.inOut) {
                case "outAndInAtOnce":
                    outAndInAtOnce(options).then(resolve);
                    break;

                case "twin":
                    twin(options).then(resolve);
                    break;

                default:
                    firstOutThenIn(options).then(resolve);
            }
        }).then(() => newSlideActions(options.slide));
    }
    else {
        ReactDOM.render(<HtmlSlide
                slide={options.slide}
                action="show"
                renderReadyCallback={() => {
                    newSlideActions(options.slide)
                }}
            />, root());
    }
}

const renderSpecialSlide = (slide: Slide):boolean => {
    if(isSpecialSlideName(slide.name)) {
        switch (getSpecialSlideType(slide.name)) {
            case "content":
                renderContentSlide(slide.name);
                break;

            default:
            // do nothing
        }
        return true;
    }

    return false;
}

const renderContentSlide = (slideName: string) => {
    ReactDOM.render(<ContentSlide slideName={slideName}/>, root());
}

export const refreshSlide = (slide: Slide) => {
    ReactDOM.render(<HtmlSlide slide={slide}
                               action="refresh"
                               renderReadyCallback={() => {
                                   newSlideActions(slide)
                               }}/>, root());
}

export const resetSlide = (slide: Slide) => {
    ReactDOM.render(<HtmlSlide slide={slide} action="refresh"/>, root());
}
