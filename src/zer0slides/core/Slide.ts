import * as _ from 'lodash';
import {Step} from './Step';
import {pathToHtml} from '../html/pathToHtml';
import {setStepCtr, showHideUp, showHideDown} from '../html/controlElements';
import {Transformation} from '../html/transformations/Transformation';

export class Slide {
    public steps: Step[] = []
    public currentStepNo: number = -1
    public name: string
    public autoStepIntervalId: number = -1

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

    public nextStep(roundRobin = false) {
        if(this.currentStepNo >= this.steps.length - 1) {
            if(roundRobin) {
                this.currentStepNo = -1;
            }
            else {
                return;
            }
        }

        this.currentStepNo++;
        this.steps[this.currentStepNo] && this.steps[this.currentStepNo].perform();
        this.showStepCtr()
    }

    public prevStep(roundRobin = false) {
        if(this.currentStepNo <= -1) {
            if(roundRobin) {
                this.currentStepNo = this.steps.length;
            }
            else {
                return;
            }
        }

        this.steps[this.currentStepNo] && this.steps[this.currentStepNo].unperform();
        this.currentStepNo--;
        this.showStepCtr();
    }

    public performToCurrentStep() {
        if(this.currentStepNo > -1) {
            for(let i = 0; i <= this.currentStepNo; i++) {
                this.steps[i].perform();
            }
        }
        this.showStepCtr();
    }

    public autoStepOn(intervalInMs: number) {
        this.autoStepIntervalId = window.setInterval(() => {
            this.nextStep(true);
        }, intervalInMs)
    }

    public autoStepOff() {
        if(this.autoStepIntervalId > -1) {
            window.clearInterval(this.autoStepIntervalId);
            console.log("interval off: " + this.autoStepIntervalId);
            this.autoStepIntervalId = -1;
        }
    }

    public aboutToBeRemoved() {
        this.autoStepOff();
    }
}
