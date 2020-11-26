import { Selector } from "../src";

// @a
const allPlayers = Selector.player();

// @s
const me = Selector.executor();

// @e[type=minecraft:bat]
const bats = Selector.entity({ type: "minecraft:bat" });
