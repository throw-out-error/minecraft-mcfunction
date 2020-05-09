import { EventEmitter } from "events";
import { Command, run_function, execute, CommandContext } from "../commands";
import { McFunction } from "..";
import { Selector, Argument } from "../arguments";
import Stack from "./stack";

interface TranspilerEvents {
  command: [Command];
  "function:start": [];
  "function:end": Parameters<Transpiler["endFunction"]>;
  iteration: [Selector, Selector];
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

function getArguments(cmd: Command): Argument[] {
  return (
    cmd[Command.ARGUMENTS]?.flatMap(arg => {
      if (!(arg instanceof Command)) return [arg];
      return [arg, ...getArguments(arg)];
    }) ?? []
  );
}

const positionalCommands: (keyof CommandContext)[] = [];
const positionalSelectorArguments: (keyof Selector["arguments"])[] = [
  "x",
  "x_rotation",
  "y",
  "y_rotation",
  "z",
  "distance",
  "dx",
  "dy",
  "dz"
];

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
    this.on("iteration", (iterable, iterator) => {
      const scope = this.#stack.peek();
      scope.iterable = iterable;
      scope.iterator = iterator;
    });
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
    const scope = this.#stack.pop();

    const iterator = scope.iterator;
    let requiresLocation = false,
      requiresExecuter = false;
    for (let cmd of scope) {
      // Command uses the iterator
      // TODO: Also check subfunctions
      if (iterator) {
        // Executer
        if (cmd[Command.ARGUMENTS].some(arg => arg === iterator)) {
          requiresExecuter = true;
        }

        // Location
        if (positionalCommands.includes(cmd[Command.NAME])) {
          requiresLocation = true;
        }
      }

      for (let arg of getArguments(cmd)) {
        if (arg instanceof Command) {
          scope.delete(arg);
        }

        if (iterator && arg instanceof Selector) {
          if (arg === iterator) {
            requiresExecuter = true;
          }
          const args = arg.arguments;
          if (
            args.sort === "furthest" ||
            args.sort === "nearest" ||
            positionalSelectorArguments.some(
              arg => typeof args[arg] !== "undefined"
            )
          ) {
            requiresLocation = true;
          }
        }
      }
    }

    const fun = new McFunction(name, scope);
    this.#functions.set(name, fun);

    console.log({ requiresExecuter, requiresLocation });

    if (call) {
      if (scope.iterable && scope.iterator) {
        const exec = execute(run_function(name));

        if (requiresExecuter && requiresLocation) {
          exec.as(scope.iterable).at(Selector.executer());
        } else if (requiresLocation) {
          exec.at(scope.iterable);
        } else {
          exec.as(scope.iterable);
        }

        this.#stack.peek().add(exec);
      } else {
        this.#stack.peek().add(run_function(name));
      }
    }
  }

  transpile(
    source: () => void,
    name: string = source.name || "root"
  ): { rootFunction: McFunction; functions: Map<string, McFunction> } {
    if (Transpiler.running) throw Error("Transpilation in progress");
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
