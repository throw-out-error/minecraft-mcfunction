import { Command } from "../";
import { Selector } from "../../arguments";

export class KillCommand extends Command<"kill"> {
  constructor(target: Selector) {
    super("kill", [target]);
  }
}

export function kill(target: Selector) {
  return new KillCommand(target);
}

Command.registerCommand("kill", kill);
declare module "../" {
  interface CommandContext {
    kill: typeof kill;
  }
}
