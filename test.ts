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

    it("onCancelled", (done) => {
        const cancel = new CancelSource();
        cancel.onCancelled(done);
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

    it("onCancelled", (done) => {
        const cancel = new CancelSource();
        cancel.onCancelled((error) => {
            try {
                assert(error instanceof CancelledError);
                done();
            } catch (error) {
                done(error);
            }
        });
        cancel.cancel();
    });

    it("offCancelled", (done) => {
        const cancel = new CancelSource();
        cancel.onCancelled(done);
        cancel.offCancelled(done);
        cancel.cancel();
        setImmediate(done);
    });
});
