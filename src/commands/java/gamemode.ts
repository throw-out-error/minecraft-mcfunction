import { Command } from "../";
import { Selector, Argument } from "../../arguments";

type Gamemode = "survival" | "creative" | "adventure" | "spectator";

type Args = [Gamemode] | [Gamemode, Selector];

export class GamemodeCommand extends Command<"gamemode", Args> {
    gamemode: Gamemode;
    target?: Selector;

    constructor(gamemode: Gamemode, target?: Selector) {
        super("gamemode");
        this.gamemode = gamemode;
        this.target = target;
    }

    getArguments() {
        const args: Argument[] = [...super.getArguments(), this.gamemode];
        if (this.target) args.push(this.target);

        return args as Args;
    }
}

export function gamemode(gamemode: Gamemode, target?: Selector) {
    return new GamemodeCommand(gamemode, target);
}

Command.registerCommand("gamemode", gamemode);
declare module "../" {
    interface CommandContext {
        gamemode: typeof gamemode;
    }
}
