import { Command } from "..";
import { Selector, Item, Argument } from "../../arguments";

type Id = string;
type JSONText = string;
type Add = ["add", Id, JSONText];
type Get = ["get", Id, "max" | "players" | "value" | "visible"];
type List = ["list"];
type Remove = ["remove", Id];
type SetColor = [
    "set",
    Id,
    "color",
    "blue" | "green" | "pink" | "purple" | "red" | "white" | "yellow"
];
type SetMax = ["set", Id, "max", number];
type SetName = ["set", Id, "name", JSONText];
type SetPlayers = ["set", Id, "players", Selector];
type SetStyle = [
    "set",
    Id,
    "style",
    "notched_6" | "notched_10" | "notched_12" | "notched_20" | "progress"
];
type SetValue = ["set", Id, "value", number];
type SetVisible = ["set", Id, "visible", "true" | "false"];

type Args =
    | Add
    | Get
    | List
    | Remove
    | SetColor
    | SetMax
    | SetName
    | SetPlayers
    | SetStyle
    | SetValue
    | SetVisible;

export class BossbarCommand extends Command<"bossbar", Args> {
    constructor(...args: Args) {
        super("bossbar", args);
    }
}

export function bossbar(...args: Args) {
    return new BossbarCommand(...args);
}

Command.registerCommand("bossbar", bossbar);
declare module "../" {
    interface CommandContext {
        bossbar: typeof bossbar;
    }
}
