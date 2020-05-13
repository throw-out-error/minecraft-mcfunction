import { Command } from "..";
import { Selector, Item, Argument } from "../../arguments";

type Args = [] | [Selector] | [Selector, Item] | [Selector, Item, number];

export class ClearCommand extends Command<"clear", Args> {
  target?: Selector;
  item?: Item;
  maxCount: number;

  constructor(target?: Selector, item?: Item, maxCount: number = Infinity) {
    super("clear");
    if (maxCount < 0) throw TypeError("maxCount can't be negative");
    this.target = target;
    this.item = item;
    this.maxCount = maxCount;
  }

  get [Command.ARGUMENTS]() {
    const args: Argument[] = [];

    if (!this.target) {
      return args as Args;
    }
    args.push(this.target);

    if (!this.item) {
      return args as Args;
    }
    this.item.includeNBT = false; // TODO: Needs to be verified
    args.push(this.item);

    if (this.maxCount === Infinity) {
      return args as Args;
    }
    args.push(this.maxCount);
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
