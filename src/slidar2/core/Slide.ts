import _ from 'lodash';
import {Step} from './Step';
import {pathToHtml} from '../html/pathToHtml';
import {setStepCtr, showHideUp, showHideDown} from '../html/controlElements';
import {Transformation} from '../html/transformations/Transformation';

export class Slide {
    public steps: Step[] = []
    public currentStepNo: number = -1
    public name: string

    public transformationInNext: Transformation
    public transformationOutNext: Transformation
    public transformationInPrev: Transformation
    public transformationOutPrev: Transformation

    constructor(name: string) {
        this.name = name;
        this.createRandomTransformations()
    }

    public createRandomTransformations() {
        if(_.random(0, 1) === 1) {
            this.transformationInNext = "Left";
            this.transformationOutPrev = "Left";
        }
        else {
            this.transformationInNext = "Up";
            this.transformationOutPrev = "Up";
        }

        if(_.random(0, 1) === 1) {
            this.transformationOutNext = "Right";
            this.transformationInPrev = "Right";
        }
        else {
            this.transformationOutNext = "Down";
            this.transformationInPrev = "Down";
        }
    }

    public showStepCtr() {
        setStepCtr(this.currentStepNo, this.steps.length);
        showHideUp(this.currentStepNo > -1);
        showHideDown(this.currentStepNo < this.steps.length - 1);
    }

    public getPathToHtml() {
        return pathToHtml(this.name);
    }

    public nextStep() {
        if(this.currentStepNo < this.steps.length - 1) {
            this.currentStepNo++;
            this.steps[this.currentStepNo].perform();
            this.showStepCtr()
        }
    }

    public prevStep() {
        if(this.currentStepNo > -1) {
            this.steps[this.currentStepNo].unperform();
            this.currentStepNo--;
            this.showStepCtr();
        }
    }

    public performToCurrentStep() {
        if(this.currentStepNo > -1) {
            for(let i = 0; i <= this.currentStepNo; i++) {
                this.steps[i].perform();
            }
        }
        this.showStepCtr();
    }
}
