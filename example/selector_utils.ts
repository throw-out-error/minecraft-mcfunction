import { Selector } from "..";

// @a
const allPlayers = Selector.player();

// @s
const me = Selector.executer();

// @e[type=minecraft:bat]
const bats = Selector.entity({ type: "minecraft:bat" });
