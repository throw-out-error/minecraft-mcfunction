const assert = require("assert");
const { clone, Position } = require("..");

describe("/clone", function () {
  const begin = Position.relative();
  const end = Position.relative();
  const destination = Position.relative();

  describe("maskMode", function () {
    it("should default to 'replace'", function () {
      const cmd = clone(begin, end, destination);
      assert.strictEqual(cmd.maskMode, "replace");
    });

    it("should be ommitted if set to 'replace'", function () {
      const cmd = clone(begin, end, destination, "replace");

      assert.strictEqual(cmd.toString(), "clone ~ ~ ~ ~ ~ ~ ~ ~ ~");
    });

    it("should not omit 'masked'", function () {
      const cmd = clone(begin, end, destination, "masked");

      assert.strictEqual(cmd.toString(), "clone ~ ~ ~ ~ ~ ~ ~ ~ ~ masked");
    });
  });

  describe("filter", function () {
    it("should compile to 'filtered *filter*'", function () {
      const cmd = clone(begin, end, destination, "minecraft:dirt");

      assert.strictEqual(
        cmd.toString(),
        "clone ~ ~ ~ ~ ~ ~ ~ ~ ~ filtered minecraft:dirt"
      );
    });
  });

  describe("cloneMode", function () {
    it("should default to 'normal'", function () {
      const cmd = clone(begin, end, destination);

      assert.strictEqual(cmd.cloneMode, "normal");
    });

    it("should be omitted for 'normal'", function () {
      const cmd = clone(begin, end, destination, "masked", "normal");

      assert.strictEqual(cmd.toString(), "clone ~ ~ ~ ~ ~ ~ ~ ~ ~ masked");
    });
  });
});
