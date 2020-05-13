import { Argument, ArgumentObject, rangeToString } from "../arguments";
import { Transpiler } from "../transpiler";

const NAME: unique symbol = Symbol("name");
const ARGUMENTS: unique symbol = Symbol("arguments");

export abstract class Command<
  T extends keyof CommandContext = keyof CommandContext,
  U extends Argument[] = Argument[]
> extends ArgumentObject {
  static readonly NAME: typeof NAME = NAME;
  static readonly ARGUMENTS: typeof ARGUMENTS = ARGUMENTS;

  readonly [NAME]: T;
  declare readonly [ARGUMENTS]: U;
  /**
   * @param {CommandName} name the command to be executed
   * @param {Argument[]} args the parameters to be passed to the command
   */
  constructor(name: T, args?: U) {
    super();
    this[NAME] = name;
    if (args) {
      this[ARGUMENTS] = args;
    }
    Transpiler.emit("command", this);
  }

  async *compile() {
    yield this[NAME];
    for (let arg of this[ARGUMENTS]) {
      yield " ";
      if (typeof arg === "string") {
        yield arg;
        continue;
      }

      if (typeof arg === "number") {
        yield `${arg}`;
        continue;
      }

      if (arg instanceof ArgumentObject) {
        for await (let s of arg.compile()) {
          yield s;
        }
        continue;
      }

      if (Array.isArray(arg) && arg.length === 2) {
        yield rangeToString(arg);
        continue;
      }

      throw Error("Unknown type of argument");
    }
  }

  /**
   * @deprecated Use compile instead */
  toString() {
    let cmd: string = this[NAME];
    for (let arg of this[ARGUMENTS]) {
      cmd += " ";
      if (typeof arg === "string") {
        cmd += arg;
        continue;
      }

      if (typeof arg === "number") {
        cmd += `${arg}`;
        continue;
      }

      if (arg instanceof ArgumentObject) {
        cmd += arg.toString();
        continue;
      }

      if (Array.isArray(arg) && arg.length === 2) {
        cmd += rangeToString(arg);
        continue;
      }

      throw Error("Unknown type of argument");
    }
    return cmd;
  }

  static commands = {} as CommandContext;

  static registerCommand<T extends keyof CommandContext>(
    name: T,
    cmd: CommandContext[T]
  ) {
    if (this.commands[name]) {
      throw Error(
        `Trying to register command ${name} failed. Command already registered.`
      );
    }

    this.commands[name] = cmd;
  }
}

export * from "./java/advancement";
export * from "./java/clear";
export * from "./java/datapack";
export * from "./java/difficulty";
export * from "./java/effect";
export * from "./java/execute";
export * from "./java/function";
export * from "./java/gamemode";
export * from "./java/give";
export * from "./java/kill";
export * from "./java/say";
export * from "./java/scoreboard";
export * from "./java/summon";
