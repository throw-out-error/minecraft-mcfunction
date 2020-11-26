import { Command } from "..";
import { Selector, Item, Argument } from "../../arguments";

type Args = [Selector, Item] | [Selector, Item, number];

export class GiveCommand extends Command<"give", Args> {
    target: Selector;
    item: Item;
    count: number;

    constructor(target: Selector, item: Item, count = 1) {
        if (count < 1 || count > 64)
            throw TypeError("Count has to be in range 1 to 64");

        super("give");
        this.target = target;
        this.item = item;
        this.count = count;
    }

    getArguments() {
        this.item.includeNBT = true;
        const args: Argument[] = [
            ...super.getArguments(),
            this.target,
            this.item,
        ];
        if (this.count > 1) args.push(this.count);
        return args as Args;
    }
}

export function give(target: Selector, item: Item, count = 1) {
    return new GiveCommand(target, item, count);
}

Command.registerCommand("give", give);
declare module "../" {
    interface CommandContext {
        give: typeof give;
    }
}
