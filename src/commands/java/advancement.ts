import { Command } from "..";
import { Selector } from "../../arguments";

type Mode = "grant" | "revoke";
type Everything = [Mode, Selector, "everything"];
type Only =
	| [Mode, Selector, "only", string]
	| [Mode, Selector, "only", string, string];
type FTU = [Mode, Selector, "from" | "through" | "until", string];
type Args = Everything | Only | FTU;

export class AdvancementCommand extends Command<"advancement", Args> {
	constructor(...args: Args) {
		super("advancement", args);
	}
}

export function advancement(...args: Everything): AdvancementCommand;
export function advancement(...args: Only): AdvancementCommand;
export function advancement(...args: FTU): AdvancementCommand;
export function advancement(...args: Args) {
	return new AdvancementCommand(...args);
}

Command.registerCommand("advancement", advancement);
declare module "../" {
	interface CommandContext {
		advancement: typeof advancement;
	}
}
