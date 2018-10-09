import * as React from "react";
import * as ReactDOM from "react-dom";

import {Slide} from "./Slide";
import {GapSlides} from "./GapSlides";

export const renderSlide = (slide: Slide, safeMode: boolean = false) => {
    ReactDOM.render(<GapSlides slide={slide} safeMode={safeMode}/>, document.getElementById('root') as HTMLElement);
}
