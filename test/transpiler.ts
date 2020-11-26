import assert from "assert";
import { Transpiler } from "../src/transpiler";

describe("Transpiler", function () {
    describe("transpile()", function () {
        it("should throw when another Transpiler is running", function () {
            assert.throws(() => {
                const t = new Transpiler();
                t.transpile(() => {
                    t.transpile();
                });
            });
        });
    });
});
