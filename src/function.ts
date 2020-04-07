import { mkdirIfNotExist } from "./utility";
import fs from "fs";
import { dirname as getDirname } from "path";
import { Command, CommandContext } from "./commands";
export * from "./arguments";
export * from "./commands";

export class McFunction {
  commands: Command[];
  path: string;
  /**
   * @param {string} path the path of the file relative to namspace/functions
   * @param {Command[]} commands the commands of the file in an array
   */
  constructor(path: string, commands: Command[] = []) {
    this.path = path;
    this.commands = commands;
  }

  async *compile(path?: string) {
    let file: fs.WriteStream | null = null;

    if (path) {
      let functionPath = `${path}/${this.path}.mcfunction`;
      mkdirIfNotExist(getDirname(functionPath));
      file = fs.createWriteStream(functionPath);
    }

    for (let cmd of this.commands) {
      for await (let s of cmd.compile()) {
        yield s;
        file?.write(s);
      }
    }

    file?.end();
  }

  get context(): CommandContext {
    type cmdFun = (...args: any[]) => Command;

    const handler: ProxyHandler<cmdFun> = {
      apply: (...args) => {
        const cmd = Reflect.apply(...args);
        this.commands.push(cmd);
        return cmd;
      }
    };

    function wrap<T extends cmdFun>(cmd: T) {
      return new Proxy<T>(cmd, handler);
    }

    const ctx = {} as CommandContext;
    for (let name in Command.commands) {
      ctx[name] = wrap(Command.commands[name]);
    }

    return ctx;
  }
  /**
   * Add a command to the function
   * @param {Command} command the command to be added
   * @deprecated pass the commands as an array to the constructor instead
   */
  addCommand(command: Command) {}
  /**
   * Copies the function
   * @param {McFunction} funct the function to be copied
   * @returns {McFunction} a reference to the function
   */
  static copy(funct: McFunction): McFunction {
    let copy = new McFunction("_", []);
    for (let key of Object.getOwnPropertyNames(funct)) copy[key] = funct[key];
    return copy;
  }
}
