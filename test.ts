import { CancelSource, CancelledError } from ".";
import assert = require('assert');

describe("isCancelled: false", () => {
    it("isCancelled", () => {
        const cancel = new CancelSource();
        assert.strictEqual(false, cancel.isCancelled);
    });

    it("throwIfCancelled", () => {
        const cancel = new CancelSource();
        cancel.throwIfCancelled();
    });

    it("once", (done) => {
        const cancel = new CancelSource();
        cancel.once(done);
        setImmediate(done);
    });
});

describe("isCancelled: true", () => {
    it("isCancelled", () => {
        const cancel = new CancelSource();
        cancel.cancel();
        assert.strictEqual(true, cancel.isCancelled);
    });

    it("throwIfCancelled", () => {
        const cancel = new CancelSource();
        cancel.cancel();
        assert.throws(
            () => cancel.throwIfCancelled(),
            (error: unknown) => error instanceof CancelledError,
        );
    });

    it("once", (done) => {
        const cancel = new CancelSource();
        cancel.once((error) => {
            try {
                assert(error instanceof CancelledError);
                done();
            } catch (error) {
                done(error);
            }
        });
        cancel.cancel();
    });

    it("off", (done) => {
        const cancel = new CancelSource();
        cancel.once(() => cancel.off(done));
        cancel.once(done);
        cancel.cancel();
        setImmediate(done);
    });
});
