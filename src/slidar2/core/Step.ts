export class Step {
    public f: () => void
    public b: () => void

    public perform() {
        this.f()
    }

    public unperform() {
        this.b()
    }
}
