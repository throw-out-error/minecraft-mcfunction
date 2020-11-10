const assert = require("assert");
const { Selector } = require("..");

describe("Selector", function () {
  describe("arguments", function () {
    describe("gamemode", function () {
      it("should accept a string", function () {
        const sel = new Selector("executer", { gamemode: "adventure" });

        assert.strictEqual(sel.toString(), "@s[gamemode=adventure]");
      });

      it("should accept an object", function () {
        const sel = new Selector("executer", {
          gamemode: { adventure: false }
        });

        assert.strictEqual(sel.toString(), "@s[gamemode=!adventure]");
      });
    });
  });
});
