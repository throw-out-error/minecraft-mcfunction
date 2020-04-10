import { Argument, ArgumentObject, rangeToString } from "../arguments";
import { History } from "./history";
export interface CommandContext {}

export abstract class Command<
  T extends keyof CommandContext = keyof CommandContext,
  U extends Argument[] = Argument[]
> extends ArgumentObject {
  name: T;
  arguments: U;
  /**
   * @param {CommandName} name the command to be executed
   * @param {Argument[]} args the parameters to be passed to the command
   */
  constructor(name: T, args: U = [] as any) {
    super();
    this.name = name;
    this.arguments = args;
  }

  async *compile() {
    yield this.name;
    for (let arg of this.arguments) {
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

  toString() {
    let cmd = this.name + " ";
    for (let arg of this.arguments) {
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

  static commands: Partial<CommandContext> = {};

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

export * from "./execute";
