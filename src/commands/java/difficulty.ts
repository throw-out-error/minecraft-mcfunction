import { Command } from "../";

type Difficulty = "peaceful" | "easy" | "normal" | "hard";

export class DifficultyCommand extends Command<"difficulty", [Difficulty]> {
    constructor(difficulty: Difficulty) {
        super("difficulty", [difficulty]);
    }
}

export function difficulty(difficulty: Difficulty) {
    return new DifficultyCommand(difficulty);
}

Command.registerCommand("difficulty", difficulty);
declare module "../" {
    interface CommandContext {
        difficulty: typeof difficulty;
    }
}
