import * as _ from 'lodash';
import * as $ from 'jquery';

import {steps} from './zer0slides/steps/steps';
import {lifecycle} from './zer0slides/lifecycle/lifecycle';
import {click} from './zer0slides/click/click';
import {core} from './zer0slides/core/core';
import {controlElements} from './zer0slides/html/controlElements';
import {showCode} from './zer0slides/showCode/showCode';

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
