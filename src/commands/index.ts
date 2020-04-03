import { Argument, ArgumentObject, rangeToString } from "../arguments";

type CommandName = "kill" | "tp" | string; //TODO

export class Command<
  T extends CommandName = string,
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

  /**
   * Outputs the command as a string
   */
  compile(): string {
    let cmd: string = this.name;
    const args: string[] = [];
    for (let arg of this.arguments) {
      if (typeof arg === "string") {
        args.push(`${arg}`);
        continue;
      }

      if (typeof arg === "number") {
        args.push("" + arg);
        continue;
      }

      if (arg instanceof ArgumentObject) {
        args.push(arg.toString());
        continue;
      }

      if (Array.isArray(arg) && arg.length === 2) {
        args.push(rangeToString(arg));
        continue;
      }

      throw Error("Unknown type of argument");
    }
    if (args.length) {
      cmd += ` ${args.join(" ")}`;
    }

    return cmd;
  }
}
