import { EventEmitter } from "events";
import { Command, run_function } from "../commands";
import { McFunction } from "..";

interface TranspilerEvents {
  command: [Command];
  "function:start": [];
  "function:end": Parameters<Transpiler["endFunction"]>;
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

class Stack {
  #stack: Set<Command>[] = [];

  push(scope?: Set<Command>) {
    this.#stack.unshift(scope ?? new Set());
  }

  pop() {
    if (this.#stack.length < 1) {
      throw Error("Empty stack");
    }
    return this.#stack.shift() as Set<Command>;
  }

  peek() {
    if (this.#stack.length < 1) {
      throw Error("Empty stack");
    }
    return this.#stack[0];
  }
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
  readonly #stack = new Stack();
  #root: string = ".";
  #counter: number = 0;

  constructor() {
    super();

    this.on("command", cmd => {
      try {
        this.#stack.peek().add(cmd);
      } catch {
        throw Error("Commands are only allowed inside functions");
      }
    });
    this.on("function:start", () => this.#stack.push());
    this.on("function:end", this.endFunction.bind(this));
  }

  private endFunction({
    name,
    call = true
  }: { name?: string; call?: boolean } = {}) {
    if (!name) {
      name = `${this.#root}/__${this.#counter}`;
    }

    if (this.#functions.has(name)) {
      throw Error(`Duplicate function name ${name}`);
    }

    // Pop stack
    const commands = this.#stack.pop();

    for (let cmd of commands) {
      for (let sub of getSubCommands(cmd)) {
        commands.delete(sub);
      }
    }

    const fun = new McFunction(name, commands);
    this.#functions.set(name, fun);

    if (call) {
      this.#stack.peek().add(run_function(name));
    }
  }

  transpile(
    source: () => void,
    name: string = source.name
  ): { rootFunction: McFunction; functions: Map<string, McFunction> } {
    if (Transpiler.running) throw Error("Compilation in progress");
    Transpiler.running = this;
    this.#functions.clear();
    this.#counter = 0;
    this.#root = name;

    this.emit("function:start");
    source();
    this.emit("function:end", { name, call: false });

    Transpiler.running = undefined;

    const rootFunction = this.#functions.get(name) as McFunction;

    return {
      rootFunction: rootFunction,
      functions: new Map(this.#functions.entries())
    };
  }
}