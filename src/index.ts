import { mkdirIfNotExist } from "./utility";
import fs from "fs";
import pth from "path";
import { Command } from "./commands";
import { Readable, pipeline as pipeline_ } from "stream";
import { promisify } from "util";
const pipeline = promisify(pipeline_);

interface OptionsName {
  commands: Iterable<Command>;
}
interface OptionsSource {
  name?: string;
}

function isIterable(iter: any): iter is Iterable<any> {
  return typeof iter[Symbol.iterator] === "function";
}

export class McFunction {
  commands: Set<Command>;
  name: string;
  dependencies = new Set<McFunction>();

  constructor(name: string, opts?: OptionsName);
  constructor(name: string, cmds?: Iterable<Command>);
  constructor(source: () => void, opts?: OptionsSource);
  constructor(
    nameOrSource: string | (() => void),
    optsOrCmds: Partial<OptionsName & OptionsSource> | Iterable<Command> = {}
  ) {
    if (Array.isArray(optsOrCmds) || isIterable(optsOrCmds)) {
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

  compile(): ReturnType<McFunction["generate"]>;
  compile(path: string): Promise<void>;
  compile(path?: string) {
    if (!path) {
      return this.generate();
    }

    const functionPath = `${path}/${this.name}.mcfunction`;
    mkdirIfNotExist(pth.dirname(functionPath));
    const writeStream = fs.createWriteStream(functionPath);

    // pipeline accepts a generator, but typescript doesn't know that
    return pipeline(Readable.from(this.generate()), writeStream);
  }

  private async *generate() {
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

    for (let cmd of this.commands) {
      for await (let s of cmd.compile()) {
        yield s;
      }
      yield "\n";
    }
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
   * @deprecated This implementation only creates a shallow copy and copies aren't necessary anyways
   */
  static copy(funct: McFunction): McFunction {
    return funct;
  }

  /**
   * @deprecated Use the constructor instead
   */
  static from(source: () => void, opts: { name?: string } = {}) {
    return new McFunction(source, opts);
  }
}

export * from "./arguments";
export * from "./commands";
