import {Step} from './Step';
import {pathToHtml} from '../html/pathToHtml';

export class Slide {
    public steps: Step[] = []
    public currentStepNo: number
    public name: string

    constructor(name: string) {
        this.name = name;

    }

    public getPathToHtml() {
        return pathToHtml(this.name);
    }

    public nextStep() {
        if(this.currentStepNo < this.steps.length - 1) {
            this.currentStepNo++;
            this.steps[this.currentStepNo].perform();
        }
    }
}
