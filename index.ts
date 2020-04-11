// tslint:disable: max-classes-per-file

export interface Cancel {
    readonly isCancelled: boolean;
    offCancelled(listener: CancelledListener): void;
    onCancelled(listener: CancelledListener): void;
    throwIfCancelled(): void;
}

export class CancelledError extends Error {
    public constructor(message?: string) {
        super(message);
        this.name = "CancelledError";
    }
}

type CancelledListener = (error: CancelledError) => void;

export class CancelSource implements Cancel {
    private _error?: CancelledError;
    private readonly _listeners = new Array<CancelledListener>();

    public constructor(...parents: Cancel[]) {
        for (const parent of parents) {
            parent.onCancelled(this.cancel.bind(this));
        }
    }

    public cancel(error?: CancelledError) {
        if (this._error) {
            return;
        }
        this._error = error || new CancelledError();
        for (const listener of this._listeners) {
            process.nextTick(listener, this._error);
        }
        this._listeners.length = 0;
    }

    public get isCancelled() {
        return !!this._error;
    }

    public offCancelled(listener: CancelledListener) {
        const i = this._listeners.indexOf(listener);
        if (i >= 0) {
            this._listeners.splice(i, 1);
        }
    }

    public onCancelled(listener: CancelledListener) {
        if (this._error) {
            process.nextTick(listener, this._error);
        } else {
            this._listeners.push(listener);
        }
    }

    public throwIfCancelled() {
        if (this._error) {
            throw this._error;
        }
    }
}
