import assert from "assert";
import { advancement, clear, Selector, Item } from "../src";

describe("/advancement", function () {
  const me = Selector.executor();

  describe("function", function () {
    it("should allow everything to be granted", function () {
      const adv = advancement("grant", me, "everything");
      assert.strictEqual(adv.compile(), "advancement grant @s everything");
    });

    it("should allow grant only specific advencements", function () {
      const adv = advancement("grant", me, "only", "minecraft:foo", "baz");
      assert.strictEqual(
        adv.compile(),
        "advancement grant @s only minecraft:foo baz"
      );
    });

    it("should grant until", function () {
      const adv = advancement("grant", me, "until", "minecraft:foo");
      assert.strictEqual(
        adv.compile(),
        "advancement grant @s until minecraft:foo"
      );
    });
  });
});

describe("/clear", function () {
  const me = Selector.executor();

  describe("function", function () {
    it("should no require any arguments", function () {
      assert.doesNotThrow(() => clear());
      const cmd = clear();
      assert.strictEqual(cmd.compile(), "clear");
    });

    it("should accept a target", function () {
      assert.doesNotThrow(() => clear(me));
      const cmd = clear(me);
      assert.strictEqual(cmd.toString(), "clear @s");
    });

    it("should accept an item", function () {
      const cmd = clear(me, new Item("dirt"));
      assert.strictEqual(cmd.toString(), "clear @s dirt");
    });

    it("should accept a count", function () {
      const cmd = clear(me, new Item("bedrock"), 64);
      assert.strictEqual(cmd.toString(), "clear @s bedrock 64");
    });

    it("should not allow negative counts", function () {
      assert.throws(() => clear(me, new Item("barrier"), -100));
      assert.throws(() => clear(me, new Item("barrier"), -Infinity));
    });
  });
});
