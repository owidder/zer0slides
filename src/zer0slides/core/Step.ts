import {slideCore} from "./core";

export type StepFunction = () => undefined | Promise<void>

const callWithBlockSteps = (stepFunction: StepFunction) => {
    let promise = stepFunction();

    if(!promise && slideCore.getCurrentSlide().afterStepDelay >= 0) {
        promise = new Promise<void>(resolve => {
            setTimeout(resolve, slideCore.getCurrentSlide().afterStepDelay)
        })
    }

    if(promise) {
        slideCore.blockSteps = true;
        promise.then(() => {
            slideCore.blockSteps = false;
        })
    }

    return promise
}

const callAndReturnPromise = (fct: StepFunction) => {
    const promise = fct();
    if(promise) {
        return promise;
    }
    else {
        return Promise.resolve();
    }
}

export class Step {
    public f: StepFunction
    public b: StepFunction
    public exitF: StepFunction
    public exitB: StepFunction

    constructor(f, b, exitF = () => undefined, exitB = () => undefined) {
        this.f = f;
        this.b = b;
        this.exitF = exitF;
        this.exitB = exitB;
    }

    public perform() {
        return callWithBlockSteps(this.f);
    }

    public unperform() {
        return callWithBlockSteps(this.b);
    }

    public doExitF() {
        return callAndReturnPromise(this.exitF);
    }

    public doExitB() {
        return callAndReturnPromise(this.exitB);
    }
}
