import { Range, Selector, Position, Rotation } from "../arguments";
import { Command } from "./";

type Path = string;
type Type = "byte" | "short" | "int" | "long" | "float" | "double";

type Align = ["x" | "y" | "z" | "xy" | "xz" | "yz" | "xyz"];
type Anchored = ["eyes" | "feet"];
type As = [Selector];
type At = [Selector];
type Facing = [Position] | ["entity", Selector, "eyes" | "feet"];
type In = ["overworld" | "the_nether" | "the_end" | string];
type Positioned = [Position] | ["positioned", "as", Selector];
type Rotated = [Rotation] | ["rotated", "as", Selector];
type Store_ReturnType = "result" | "success";
type Store_Block = [Store_ReturnType, "block", Position, Path, Type, number];
type Store_Bossbar = [Store_ReturnType, "bossbar", string, "value" | "max"];
type Store_Entity = [Store_ReturnType, "entity", Selector, Type, number];
type Store_Score = [Store_ReturnType, "score", string, string];
type Store_Storage = [Store_ReturnType, "storage", string, Path, Type, number];
type Store =
  | Store_Block
  | Store_Bossbar
  | Store_Entity
  | Store_Score
  | Store_Storage;

type If_Block = ["block", Position, string];
type If_Blocks = ["blocks", Position, Position, Position, "all" | "masked"];
type If_Data_Block = ["data", "block", Position, Path];
type If_Data_Entity = ["entity", Selector, Path];
type If_Data_Storage = ["storage", string, Path];
type If_Data = If_Data_Block | If_Data_Entity | If_Data_Storage;
type If_Entity = ["entity", Selector];
type If_Predicate = ["predicate", string];
type If_Score_Compare = [
  "score",
  Selector,
  string,
  "<" | "<=" | "=" | ">=" | ">",
  Selector,
  string
];
type If_Score_Range = ["score", Selector, string, "matches", Range];
type If_Score = If_Score_Compare | If_Score_Range;
type If = If_Block | If_Blocks | If_Data | If_Entity | If_Predicate | If_Score;
type Unless = If;

export class ExecuteCommand extends Command<"execute"> {
  run: Command;

  constructor(run: Command) {
    super("execute");
    this.run = run;
  }

  align(...args: Align) {
    this.arguments.push("align", ...args);
    return this;
  }

  anchored(...args: Anchored) {
    this.arguments.push("anchored", ...args);
    return this;
  }

  as(...args: As) {
    this.arguments.push("as", ...args);
    return this;
  }

  at(...args: At) {
    this.arguments.push("at", ...args);
    return this;
  }

  facing(...args: Facing) {
    this.arguments.push("facing", ...args);
    return this;
  }

  in(...args: In) {
    this.arguments.push("in", ...args);
    return this;
  }

  positioned(...args: Positioned) {
    this.arguments.push("positioned", ...args);
    return this;
  }

  rotated(...args: Rotated) {
    this.arguments.push("rotated", ...args);
    return this;
  }

  store(...args: Store) {
    this.arguments.push("store", ...args);
    return this;
  }

  if(...args: If) {
    this.arguments.push("if", ...args);
    return this;
  }

  unless(...args: Unless) {
    this.arguments.push("unless", ...args);
    return this;
  }

  async *compile() {
    for await (let s of super.compile()) {
      yield s;
    }
    yield " run ";
    for await (let s of this.run.compile()) {
      yield s;
    }
  }

  toString() {
    return super.toString() + " run " + this.run.toString();
  }
}

export function execute(run: Command): ExecuteCommand {
  return new ExecuteCommand(run);
}

Command.registerCommand("execute", execute);
declare module "./" {
  interface CommandContext {
    execute: typeof execute;
  }
}
