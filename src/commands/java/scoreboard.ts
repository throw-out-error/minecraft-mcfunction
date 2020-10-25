import { Command } from "..";
import { Selector } from "../../arguments";

type ObjectivesAdd = [method: "add", objective: string, criterion: string, ...displayName: ([displayName: string] | [])];
type ObjectivesList = [method: "list"];
type ModifyDisplayName = [option: "displayname", displayName: string];
type ModifyRenderType = [option: "rendertype", renderType: "hearts" | "integer"];
type ObjectivesModify = [method: "modify", objective: string, ...option: (ModifyDisplayName|ModifyRenderType)];
type ObjectivesRemove = [method: "remove", objective: string];
type ObjectivesSetdisplay = [method: "setdisplay", slot: string, ...objective: ([objective: string]|[])];
type Objectives = [
  command: "objectives",
  ...arguments: (
    | ObjectivesAdd
    | ObjectivesList
    | ObjectivesModify
    | ObjectivesRemove
    | ObjectivesSetdisplay
  )
];

type PlayersList = [method: "list", ...target: ([target: "*" | Selector] | [])];
type PlayersGet = [method: "get", target: Selector, objective: string];
type PlayersSet = [method: "set", targets: Selector, objective: string, score: number];
type PlayersAdd = [method: "add", targets: Selector, objective: string, score: number];
type PlayersRemove = [method: "remove", targets: Selector, objective: string, score: number];
type PlayersReset = [method: "reset", targets: Selector, ...objective: ([objective: string] | [])]
type PlayersEnable = [method: "enable", targets: Selector, objective: string];
type Operator = "+=" | "-=" | "*=" | "/=" | "%=" | "=" | "<" | ">" | "><";
type PlayersOperation = [
  method: "operation",
  targets: Selector,
  targetObjective: string,
  operator: Operator,
  source: Selector,
  sourceObjective: string
];
type Players = [
  command: "players",
  ...arguments: (
    | PlayersList
    | PlayersGet
    | PlayersSet
    | PlayersAdd
    | PlayersRemove
    | PlayersReset
    | PlayersEnable
    | PlayersOperation
  )
];

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
