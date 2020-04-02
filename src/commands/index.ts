import { Argument, ArgumentObject } from "../arguments";

type CommandName = "kill" | "tp" | string; //TODO

export class Command<
  T extends CommandName = any,
  U extends Argument[] = any[]
> extends ArgumentObject {
  name: T;
  arguments: U;
  /**
   * @param {CommandName} method the command to be executed
   * @param {Argument[]} params the parameters to be passed to the command
   */
  constructor(method: T, params: U = [] as any) {
    super();
    this.name = method;
    this.arguments = params;
  }

  /**
   * Outputs the command as a string
   */
  compile(): string {
    let cmd: string = this.name;
    const args: string[] = [];
    for (let arg of this.arguments) {
      args.push(typeof arg === "string" ? arg : arg.compile());
    }
    if (args.length) {
      cmd += ` ${args.join(" ")}`;
    }

    return cmd;
  }
}
