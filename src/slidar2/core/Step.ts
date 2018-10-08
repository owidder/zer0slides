export class Step {
    public f: () => void
    public b: () => void

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
