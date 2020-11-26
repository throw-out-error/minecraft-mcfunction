import { Command } from "..";
import { Selector } from "../../arguments";

type ObjectivesAdd =
    | ["objectives", "add", string, string]
    | ["objectives", "add", string, string, string];
type ObjectivesList = ["objectives", "add"];
type ObjectivesModify1 = [
    "objectives",
    "modify",
    string,
    "displayname",
    string
];
type ObjectivesModify2 = [
    "objectives",
    "modify",
    string,
    "rendertype",
    "hearts" | "integer"
];
type ObjectivesRemove = ["objectives", "remove", string];
type ObjectivesSetdisplay =
    | ["objectives", "setdisplay", string, string]
    | ["objectives", "setdisplay", string];
type Objectives =
    | ObjectivesAdd
    | ObjectivesList
    | ObjectivesModify1
    | ObjectivesModify2
    | ObjectivesRemove
    | ObjectivesSetdisplay;

type PlayersList = ["players", "list"] | ["players", "list", "*" | Selector];
type PlayersGet = ["players", "get", Selector, string];
type PlayersSet = ["players", "set", Selector, string, number];
type PlayersAdd = ["players", "add", Selector, string, number];
type PlayersRemove = ["players", "remove", Selector, string, number];
type PlayersReset =
    | ["players", "reset", Selector]
    | ["players", "reset", Selector, string];
type PlayersEnable = ["players", "enable", Selector, string];
type PlayersOperation = [
    "players",
    "operation",
    Selector,
    string,
    "+=" | "-=" | "*=" | "/=" | "%=" | "=" | "<" | ">" | "><",
    Selector,
    string
];
type Players =
    | PlayersList
    | PlayersGet
    | PlayersSet
    | PlayersAdd
    | PlayersRemove
    | PlayersReset
    | PlayersEnable
    | PlayersOperation;

type Args = Objectives | Players;

export class ScoreboardCommand extends Command<"scoreboard", Args> {
    constructor(...args: Args) {
        super("scoreboard", args);
    }
}

export function scoreboard(...args: Args) {
    return new ScoreboardCommand(...args);
}

Command.registerCommand("scoreboard", scoreboard);
declare module "../" {
    interface CommandContext {
        scoreboard: typeof scoreboard;
    }
}
