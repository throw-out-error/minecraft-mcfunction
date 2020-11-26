import { Command } from "../";

export class SayCommand extends Command<"say", [string]> {
    constructor(message: string) {
        super("say", [message]);
    }
}

export function say(message: string) {
    return new SayCommand(message);
}

Command.registerCommand("say", say);
declare module "../" {
    interface CommandContext {
        say: typeof say;
    }
}
