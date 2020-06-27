import { Command } from "../";
import { Selector, Position } from "../../arguments";

type Slot = string;
type LootTable = string;
type ToolArg = [hand: 'mainhand'|'offhand'] | [tool: string] | []

type TargetSpawn = [method:'spawn', position: Position]
type TargetReplace = [
  method: 'replace', 
  ...target: ([type:'entity',target:Selector] | [type:'block',block:Position]),
  slot: Slot,
  ...count: ([count:number]|[])
]
// TODO: Selector type parameter to specify only players
type TargetGive = [method: 'give', target: Selector];
type TargetInsert = [method: 'insert', block: Position];
type Target = [...target:(TargetSpawn|TargetReplace|TargetGive|TargetInsert)];

type SourceFish = [method:'fish', lootTable:LootTable, position:Position, ...tool:ToolArg]
type SourceLoot = [method:'loot', lootTable:LootTable]
type SourceKill = [method:'kill', target:Selector]
type SourceMine = [method:'mine', block:Position, ...tool:ToolArg]
type Source = SourceFish | SourceLoot | SourceKill | SourceMine;

type Args = [...target: Target, ...source: Source];

export class LootCommand extends Command<"loot", Args> {
  constructor(...args:Args) {
    super("loot", args);
  }
}

export function loot(...args:Args) {
  return new LootCommand(...args);
}

Command.registerCommand("loot", loot);
declare module "../" {
  interface CommandContext {
    loot: typeof loot;
  }
}
