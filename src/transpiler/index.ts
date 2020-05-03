import { EventEmitter } from "events";
import { Command } from "../commands";
import { McFunction } from "..";

interface TranspilerEvents {
  command: [Command];
  "function:start": [string];
  "function:end": [];
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
  #scopes = new Map<string, Set<Command>>();
  #stack: string[] = [];

  push(name: string, scope?: Set<Command>) {
    if (this.#scopes.has(name)) {
      throw Error("Duplicate scope name");
    }
    this.#scopes.set(name, scope ?? new Set());
    this.#stack.unshift(name);
  }

  pop() {
    if (this.#stack.length < 1) {
      throw Error("Empty stack");
    }
    const name = this.#stack.shift() as string;
    return {
      name,
      scope: this.#scopes.get(name) as Set<Command>
    };
  }

  has(name: string) {
    return this.#scopes.has(name);
  }

  get scope() {
    return this.#scopes.get(this.name) as Set<Command>;
  }

  get name() {
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

  constructor() {
    super();

    this.on("command", cmd => {
      try {
        this.#stack.scope.add(cmd);
      } catch {
        throw Error("Commands are only allowed inside functions");
      }
    });
    this.on("function:start", this.startFunction.bind(this));
    this.on("function:end", this.endFunction.bind(this));
  }

  private startFunction(name: string) {
    // Check for repeated function call
    if (this.#stack.has(name)) {
      throw Error("Recursion detected");
    }

    // Construct new McFunction
    const fun = new McFunction(name);

    // Push new scope to stack
    this.#stack.push(name, fun.commands);

    // Register new function
    this.#functions.set(name, fun);
  }

  private endFunction() {
    // Pop stack
    const { scope: commands } = this.#stack.pop();

    for (let cmd of commands) {
      for (let sub of getSubCommands(cmd)) {
        commands.delete(sub);
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

    this.emit("function:start", name);
    source();
    this.emit("function:end");

    Transpiler.running = undefined;

    const rootFunction = this.#functions.get(name) as McFunction;

    return {
      rootFunction: rootFunction,
      functions: new Map(this.#functions.entries())
    };
  }
}
