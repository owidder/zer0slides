import * as _ from 'lodash';
import {Step} from './Step';
import {pathToHtml} from '../html/pathToHtml';
import {setStepCtr, showHideUp, showHideDown} from '../html/controlElements';
import {Transformation} from '../html/transformations/Transformation';
import {SimplePromise} from './SimplePromise';
import {slideCore} from "./core";

export const isSpecialSlideName = (name: string) => {
    return name.startsWith("_0_");
}

export const getSpecialSlideType = (name: string) => {
    return name.substr(3);
}

export class Slide {
    public exitFunctions: Array<() => void> = []

    public steps: Step[] = []
    public currentStepNo: number = -1
    public name: string
    public description: string
    public autoStepIntervalId: number = -1
    public firstStepPromise = new SimplePromise()
    public specialName
    public doPerformToCurrentStep
    public shortcutFunction: () => void

    public transformationInNext: Transformation
    public transformationOutNext: Transformation
    public transformationInPrev: Transformation
    public transformationOutPrev: Transformation

    constructor(name: string, description?: string, specialName?: string) {
        this.name = name;
        this.description = description;
        this.specialName = specialName;
        this.createRandomTransformations();
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

    public addStep(step: Step) {
        this.steps.push(step);
    }

    public clearSteps() {
        this.steps.length = 0;
        if(!this.doPerformToCurrentStep) {
            this.currentStepNo = -1;
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
        if(!slideCore.blockSteps) {
            if(!(this.currentStepNo > 0)) {
                slideCore.firstStepCallback();
            }
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
    }

    public prevStep(roundRobin = false) {
        if(!slideCore.blockSteps) {
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
    }

    private _performToCurrentStepRecursively = (steps: Step[], counter: number, resolve: () => void) => {
        const next = () => this._performToCurrentStepRecursively(steps, counter + 1, resolve);

        if (counter >= steps.length || counter > this.currentStepNo) {
            resolve();
        }
        else {
            if (steps[counter] == null) next();

            const promise = steps[counter].perform();
            if (promise) {
                promise.then(() => next())
            } else {
                next();
            }
        }
    }


    public performToCurrentStep(): Promise<void> {
        const promise = (this.doPerformToCurrentStep && this.currentStepNo > -1) ?
            new Promise<void>(resolve => {
                this._performToCurrentStepRecursively(this.steps, 0, resolve);
            }) :
            Promise.resolve();

        promise.then(() => this.showStepCtr());

        return promise;
    }

    public autoStepOn(intervalInMs: number) {
        this.autoStepIntervalId = window.setInterval(() => {
            this.nextStep(true);
        }, intervalInMs)
    }

    public autoStepOff() {
        if(this.autoStepIntervalId > -1) {
            window.clearInterval(this.autoStepIntervalId);
            this.autoStepIntervalId = -1;
        }
    }

    public aboutToBeRemoved() {
        this.autoStepOff();
        this.exitFunctions.forEach(exitFunction => exitFunction())
    }
}
