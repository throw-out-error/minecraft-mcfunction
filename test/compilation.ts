import assert from "assert";
import { McFunction, kill, Selector, give, Item, execute } from "../src";

async function collect(gen) {
  let str = "";
  for await (let chunk of gen) {
    str += chunk;
  }
  return str;
}

describe("Compilation", function () {
  it("compiles correctly", function () {
    function killBats() {
      const bats = Selector.entity({
        level: [30, Infinity],
        type: "minecraft:bat",
        team: {
          red: false,
          blue: false
        },
        scores: { abc: 1 },
        distance: [undefined, 50],
        dy: 5,
        gamemode: { creative: true, spectator: false },
        advancements: { d: false, e: { f: false } }
      });

      execute(kill(bats)).in("overworld");
    }

    const mcf = McFunction.from(killBats);

    return collect(mcf.compile()).then(str => {
      assert.strictEqual(
        str.trim(),
        "execute in overworld run kill @e[type=minecraft:bat,gamemode=!spectator,gamemode=creative,team=!blue,team=!red,scores={abc=1},advancements={d=false,e={f=false}},distance=..50,dy=5,level=30..]"
      );
    });
  });

  it("compiles correctly", function () {
    function giveMeCommandblock() {
      const me = Selector.executor();

      const cmdBlock = new Item("dirt");
      give(me, cmdBlock);
    }

    const fun = McFunction.from(giveMeCommandblock);
    return collect(fun.compile()).then(str => {
      assert.strictEqual(str.trim(), "give @s dirt");
    });
  });
});
