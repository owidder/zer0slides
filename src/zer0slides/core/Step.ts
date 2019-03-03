export type StepFunction = () => undefined | Promise<void>

export class Step {
    public f: () => StepFunction
    public b: () => StepFunction

    constructor(f, b) {
        this.f = f;
        this.b = b;
    }

    public perform() {
        this.f()
    }

    public unperform() {
        this.b()
    }
}
