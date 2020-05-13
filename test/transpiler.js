const assert = require("assert");
const { Transpiler } = require("../dist/transpiler");

describe("Transpiler", function () {
  describe("transpile()", function () {
    it("should throw when another Transpiler is running", function () {
      assert.throws(() => {
        const t = new Transpiler();
        t.transpile(() => {
          t.transpile(() => {});
        });
      });
    });
  });
});
