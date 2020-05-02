import { EventEmitter } from "events";
import { Command } from "../commands";
import { McFunction } from "..";

interface TranspilerEvents {
  command: [Command];
  "function:start": [];
  "function:end": [string];
}

export interface Transpiler {
  on<K extends keyof TranspilerEvents>(
    type: K,
    listener: (...args: TranspilerEvents[K]) => void
  ): this;
  emit<K extends keyof TranspilerEvents>(
    type: K,
    ...args: TranspilerEvents[K]
  ): boolean;
}

function getSubCommands(cmd: Command): Command[] {
  return (
    cmd[Command.ARGUMENTS]?.flatMap(arg => {
      if (!(arg instanceof Command)) return [];
      return [arg, ...getSubCommands(arg)];
    }) ?? []
  );
}

export class Transpiler extends EventEmitter {
  static running?: Transpiler;
  static emit<T extends keyof TranspilerEvents>(
    type: T,
    ...args: TranspilerEvents[T]
  ) {
    return this.running?.emit<T>(type, ...args);
  }

  readonly #functions = new Map<string, McFunction>();
  readonly #commands = new Set<Command>();

  constructor() {
    super();

    this.on("command", cmd => this.#commands.add(cmd));
    this.on("function:start", () => this.#commands.clear());
    this.on("function:end", name => {
      this.purgeSubCommands();
      if (this.#functions.has(name)) {
        throw Error("Duplicate function");
      }
      this.#functions.set(name, new McFunction(name, this.#commands));
    });
  }

  purgeSubCommands() {
    for (let cmd of this.#commands) {
      for (let sub of getSubCommands(cmd)) {
        this.#commands.delete(sub);
      }
    }
  }

  transpile(
    source: () => void,
    name: string = source.name
  ): { rootFunction: McFunction; functions: Map<string, McFunction> } {
    if (Transpiler.running) throw Error("Compilation in progress");
    Transpiler.running = this;
    this.#functions.clear();

    this.emit("function:start");
    source();
    this.emit("function:end", name);

    Transpiler.running = undefined;

    const rootFunction = this.#functions.get(name) as McFunction;

    return {
      rootFunction: rootFunction,
      functions: new Map(this.#functions.entries())
    };
  }
}
