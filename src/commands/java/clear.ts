import { Command } from "..";
import { Selector, Item, Argument } from "../../arguments";

type Args = [Selector] | [Selector, Item] | [Selector, Item, number];

export class ClearCommand extends Command<"clear", Args> {
  target: Selector;
  item?: Item;
  maxCount: number;

  constructor(target: Selector, item?: Item, maxCount: number = Infinity) {
    super("clear");
    this.target = target;
    this.item = item;
    this.maxCount = maxCount;
  }

  get [Command.ARGUMENTS]() {
    const args: Argument[] = [this.target];
    if (this.item) {
      this.item.includeNBT = false; // TODO: Needs to be verified
      args.push(this.item);

      if (this.maxCount !== Infinity) {
        args.push(this.maxCount);
      }
    }
    return args as Args;
  }
}

export function clear(
  target: Selector,
  item?: Item,
  maxCount: number = Infinity
) {
  return new ClearCommand(target, item, maxCount);
}

Command.registerCommand("clear", clear);
declare module "../" {
  interface CommandContext {
    clear: typeof clear;
  }
}
