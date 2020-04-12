import { Command } from "..";
import { Selector } from "../../arguments";

type EffectId = string;

type Give =
  | ["give", Selector, EffectId]
  | ["give", Selector, EffectId, number]
  | ["give", Selector, EffectId, number, number]
  | ["give", Selector, EffectId, number, number, "true" | "false"];
type Clear = ["clear", Selector] | ["clear", Selector, EffectId];
type Args = Give | Clear;

export class EffectCommand extends Command<"effect", Args> {
  constructor(...args: Args) {
    super("effect", args);
  }
}

export function effect(...args: Args) {
  return new EffectCommand(...args);
}

Command.registerCommand("effect", effect);
declare module "../" {
  interface CommandContext {
    effect: typeof effect;
  }
}
