import { mkdirIfNotExist } from "./utility";
import fs from "fs";
import { dirname as getDirname } from "path";
import { Command } from "./commands";
export * from "./arguments";
export * from "./commands";

interface OptionsName {
  commands: Iterable<Command>;
}
interface OptionsSource {
  name?: string;
}

export class McFunction {
  commands: Set<Command>;
  name: string;

  constructor(name: string, opts?: OptionsName);
  constructor(name: string, cmds?: Command[]);
  constructor(source: () => void, opts?: OptionsSource);
  constructor(
    nameOrSource: string | (() => void),
    optsOrCmds: Partial<OptionsName & OptionsSource> | Command[] = {}
  ) {
    if (Array.isArray(optsOrCmds)) {
      optsOrCmds = { commands: optsOrCmds };
    }

    if (typeof nameOrSource === "function") {
      Command.history.push();

      nameOrSource();

      optsOrCmds.commands = Command.history.pop();
      nameOrSource = nameOrSource.name;
    }

    this.name = optsOrCmds.name ?? nameOrSource;
    this.commands = new Set(optsOrCmds.commands ?? []);
  }

  async *compile(path?: string) {
    let file: fs.WriteStream | null = null;

    if (path) {
      let functionPath = `${path}/${this.name}.mcfunction`;
      mkdirIfNotExist(getDirname(functionPath));
      file = fs.createWriteStream(functionPath);
    }

    const deleteSubCommands = (cmd: Command) => {
      const cmds = cmd[Command.ARGUMENTS].filter(
        a => a instanceof Command
      ) as Command[];

      for (let c of cmds) {
        deleteSubCommands(c);
        this.commands.delete(c);
      }
    };

    this.commands.forEach(deleteSubCommands);

    console.info(`Compiling ${this.commands.size} commands.`);

    for (let cmd of this.commands) {
      for await (let s of cmd.compile()) {
        yield s;
        file?.write(s);
      }
      yield "\n";
    }

    file?.end();
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

  static from(source: () => void, opts: { name?: string } = {}) {
    return new McFunction(source, opts);
  }
}
