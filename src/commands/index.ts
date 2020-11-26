import { Argument, ArgumentObject, rangeToString } from "../arguments";
import { Transpiler } from "../transpiler";

export abstract class Command<
    T extends keyof CommandContext = keyof CommandContext,
    U extends Argument[] = Argument[]
> extends ArgumentObject {
    readonly name: T;
    protected declare arguments: U;
    /**
     * @param {CommandName} name the command to be executed
     * @param {Argument[]} args the parameters to be passed to the command
     */
    constructor(name: T, args?: U) {
        super();
        this.name = name;
        if (args) this.arguments = args;

        Transpiler.emit("command", this);
    }

    getArguments(): U {
        return this.arguments;
    }

    async *compile() {
        yield this.name;
        for (const arg of this.arguments) {
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
                for await (const s of arg.compile()) yield s;

                continue;
            }

            if (Array.isArray(arg) && arg.length === 2) {
                yield rangeToString(arg);
                continue;
            }

            throw Error("Unknown type of argument");
        }
    }

    static commands = {} as CommandContext;

    static registerCommand<T extends keyof CommandContext>(
        name: T,
        cmd: CommandContext[T]
    ) {
        if (this.commands[name])
            throw Error(
                `Trying to register command ${name} failed. Command already registered.`
            );

        this.commands[name] = cmd;
    }
}

export * from "./java/advancement";
export * from "./java/bossbar";
export * from "./java/clear";
export * from "./java/clone";
export * from "./java/datapack";
export * from "./java/difficulty";
export * from "./java/effect";
export * from "./java/enchant";
export * from "./java/execute";
export * from "./java/function";
export * from "./java/gamemode";
export * from "./java/give";
export * from "./java/kill";
export * from "./java/say";
export * from "./java/scoreboard";
export * from "./java/summon";
export * from "./java/teleport";
export * from "./java/tp";
