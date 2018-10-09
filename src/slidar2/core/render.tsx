import * as React from "react";
import * as ReactDOM from "react-dom";

import {Slide} from "./Slide";
import {GapSlides} from "./GapSlides";

export const renderSlide = (slide: Slide) => {
    ReactDOM.render(<GapSlides slide={slide}/>, document.getElementById('root') as HTMLElement);
}
