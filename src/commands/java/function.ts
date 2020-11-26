import { Command } from "../";
import { NamespacedArgument } from "../../arguments";

type FunctionArg = string | NamespacedArgument;

export class FunctionCommand extends Command<"function", [FunctionArg]> {
    constructor(funct: FunctionArg) {
        super("function", [funct]);
    }
}

export function run_function(funct: FunctionArg) {
    return new FunctionCommand(funct);
}

Command.registerCommand("function", run_function);
declare module "../" {
    interface CommandContext {
        function: typeof run_function;
    }
}
