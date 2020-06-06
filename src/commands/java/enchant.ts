import { Command } from "..";
import { Selector } from "../../arguments";

type Enchantment = string;
type Args = [Selector, Enchantment] | [Selector, Enchantment, number];

export class EnchantCommand extends Command<"enchant", Args> {
  constructor(...args: Args) {
    super("enchant", args);
  }
}

export function enchant(...args: Args) {
  return new EnchantCommand(...args);
}

Command.registerCommand("enchant", enchant);
declare module "../" {
  interface CommandContext {
    enchant: typeof enchant;
  }
}
