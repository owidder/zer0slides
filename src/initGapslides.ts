import * as _ from 'lodash';
import * as $ from 'jquery';

import {steps} from './slidar2/steps/steps';
import {lifecycle} from './slidar2/lifecycle/lifecycle';
import {click} from './slidar2/click/click';
import {core} from './slidar2/core/core';
import {controlElements} from './slidar2/html/controlElements';
import {showCode} from './slidar2/showCode/showCode';

export const init = () => {
    const gapslides = {
        controlElements,
        click,
        core,
        lifecycle,
        showCode2: showCode,
        steps2: steps,
    } as any

    (window as any).gapslides = gapslides;
    (window as any)._ = _;
    (window as any).$ = $;
}
