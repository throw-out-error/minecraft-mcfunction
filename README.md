# mcfunction

A simple way to create your mcfunction files using Typescript syntax.

# Commands

Every command is exposed as a function that returns an instance of the command to be executed.

```ts
import { difficulty } from "..";

// cmd is an instance of DifficultyCommand
const cmd = difficulty("peaceful");
```

Keep in mind, that some commands are still under development.

# Arguments

The commands usually take the same arguments as their corresponding commands.

## Selector

The `Selector` class takes an object of arguments to filter by:

```ts
import { Selector } from "..";

// @a[team=red]
const teamRed = new Selector("player", { team: "red" });

// @e[type=minecraft:sheep,distance=..10]
const closeSheep = new Selector("entity", {
  type: "minecraft:sheep",
  distance: [, 10]
});
```

For convenience the `Selector` class provides static methods for the different selector types.

```ts
import { Selector } from "..";

// @a
const allPlayers = Selector.player();

// @s
const me = Selector.executer();

// @e[type=minecraft:bat]
const bats = Selector.entity({ type: "minecraft:bat" });
```

## Range

Ranges can be expressed as a single number or a number array of length 2.
To represent an open range you can use `Infinity` or `undefined`.

```ts
import { Range } from "..";

// '..10'
const close: Range = [, 10];

// '30..'
const far: Range = [30, Infinity];

// '5'
const exact: Range = 5;
```
