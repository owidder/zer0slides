import {glowText} from './glowtext/GlowText';
import {showCode} from './showCode/showCode';
import {classUtil} from './classUtil/classUtil';
import {cube} from './cube/cube';
import {lifecycle} from '../slidar2/lifecycle/lifecycle';
import {steps} from '../slidar2/steps/steps';

const coolText = {glowText};
const initPhase = {markSlideAsReady: lifecycle.slideReady};
const _steps = {
    set: steps.setSteps
}

export const slidAR = {
    classUtil,
    coolText,
    cube,
    glowText,
    initPhase,
    showCode,
    steps: _steps,
};
