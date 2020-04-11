import { Command } from "./";

type Disable = ["disable", string];
type Enable = ["enable", string] | ["enable", string, "first" | "last"];
type List = ["list"] | ["list", "available" | "enabled"];
type Args = Disable | Enable | List;

export class DatapackCommand extends Command<"datapack", Args> {
  constructor(...args: Args) {
    super("datapack", args);
  }
}

export function datapack(...args: Disable): DatapackCommand;
export function datapack(...args: Enable): DatapackCommand;
export function datapack(...args: List): DatapackCommand;
export function datapack(...args: Args) {
  return new DatapackCommand(...args);
}

Command.registerCommand("datapack", datapack);
declare module "./" {
  interface CommandContext {
    datapack: typeof datapack;
  }
}
