import * as $ from "jquery";

import {q} from "../selector/selector";

export const fitToScreen = (rootSelector = "body") => {

    const widthFactor = screen.width / 1440;
    const heightFactor = screen.height / 900;

    const factor = Math.min(widthFactor, heightFactor);

    $(rootSelector).css("transform", `scale(${factor})`)
}
