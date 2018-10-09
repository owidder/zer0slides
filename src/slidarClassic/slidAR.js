import {glowText} from './glowtext/GlowText';
import {showCode} from './showCode/showCode';
import {classUtil} from './classUtil/classUtil';
import {cube} from './cube/cube';
import {lifecycle} from '../slidar2/lifecycle/lifecycle';

const coolText = {glowText};
const initPhase = {markSlideAsReady: lifecycle.slideReady};

export const slidAR = {
    classUtil,
    coolText,
    cube,
    glowText,
    initPhase,
    showCode,
};
