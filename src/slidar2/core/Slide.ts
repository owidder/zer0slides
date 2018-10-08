import {Step} from './Step';
import {pathToHtml} from '../html/pathToHtml';
import {setStepCtr} from '../html/controlElements';

export class Slide {
    public steps: Step[] = []
    public currentStepNo: number = -1
    public name: string

    constructor(name: string) {
        this.name = name;

    }

    public showStepCtr() {
        setStepCtr(this.currentStepNo, this.steps.length);
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
            this.showStepCtr();
        }
    }
}
