export class SimplePromise<T> {
    private _promise: Promise<T>
    private _resolve: (data?: T) => void

    constructor() {
        this._promise = new Promise<T>(resolve => {
            this._resolve = resolve
        })
    }

    public resolve(data?: T) {
        this._resolve(data)
    }

    public then(fct: (data: T) => void) {
        this._promise.then((data: T) => {
            fct(data)
        })
    }
}
