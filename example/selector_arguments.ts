import { Selector } from "..";

// @a[team=red]
const teamRed = new Selector("player", { team: "red" });

// @e[type=minecraft:sheep,distance=..10]
const closeSheep = new Selector("entity", {
  type: "minecraft:sheep",
  distance: [, 10]
});
