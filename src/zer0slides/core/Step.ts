import {slideCore} from "./core";

export type StepFunction = () => undefined | Promise<void>

const callWithBlockSteps = (stepFunction: StepFunction) => {
    const promise = stepFunction();
    if(promise) {
        slideCore.blockSteps = true;
        promise.then(() => {
            slideCore.blockSteps = false;
        })
    }
}

export class Step {
    public f: StepFunction
    public b: StepFunction

    constructor(f, b) {
        this.f = f;
        this.b = b;
    }

    public perform() {
        callWithBlockSteps(this.f);
    }

    public unperform() {
        callWithBlockSteps(this.b);
    }
}
