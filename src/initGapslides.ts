import * as _ from 'lodash';
import * as $ from 'jquery';

import {steps2} from './slidar2/steps/steps2';
import {lifecycle} from './slidar2/lifecycle/lifecycle';
import {click} from './slidar2/click/click';
import {core} from './slidar2/core/core';
import {controlElements} from './slidar2/html/controlElements';
import {showCode2} from './slidar2/showCode/showCode2';

export const init = () => {
    const gapslides = {
        controlElements,
        click,
        core,
        lifecycle,
        showCode2,
        steps2,
    } as any

    (window as any).gapslides = gapslides;
    (window as any)._ = _;
    (window as any).$ = $;
}
