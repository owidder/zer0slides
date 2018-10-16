import _ from 'lodash';

import {Transformation} from './Transformation';

const transformationsInNext: Transformation[] = []
const transformationsInPrev: Transformation[] = []
const transformationsOutNext: Transformation[] = []
const transformationsOutPrev: Transformation[] = []

export const initRandomTransformations = (max = 1000) => {
    for(let i = 0; i < max; i++) {
        if(_.random(0, 1) === 1) {
            transformationsInNext.push("Left");
            transformationsInPrev.push("Right");
        }
        else {
            this.transformationInNext = "Up";
            this.transformationInPrev = "Down";
        }

        if(_.random(0, 1) === 1) {
            this.transformationOutNext = "Right";
            this.transformationInPrev = "Left";
        }
        else {
            this.transformationInNext = "Down";
            this.transformationInPrev = "Up";
        }

    }
}