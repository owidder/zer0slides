import * as _ from 'lodash';
import * as $ from 'jquery';

import {steps} from './gapslides/steps/steps';
import {lifecycle} from './gapslides/lifecycle/lifecycle';
import {click} from './gapslides/click/click';
import {core} from './gapslides/core/core';
import {controlElements} from './gapslides/html/controlElements';
import {showCode} from './gapslides/showCode/showCode';

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
