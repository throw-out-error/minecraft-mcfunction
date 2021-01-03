import { Command } from "..";
import { Argument, BlockID, Position, NBT } from "../../arguments";

type FillMode = "destroy" | "hollow" | "keep" | "outline" | "replace";

type Fill =
  | [Position, Position, BlockID]
  | [Position, Position, BlockID, NBT]
  | [Position, Position, BlockID, FillMode]
  | [Position, Position, BlockID, NBT, FillMode]
type Args = Fill;

export class FillCommand extends Command<"fill", Args> {
  begin: Position;
  end: Position;
  block: BlockID;
  nbt?: NBT;
  fillMode?: FillMode;
  
  constructor(
    begin: Position,
    end: Position,
    block: BlockID,
    nbt?: NBT,
    fillMode?: FillMode
  ) {
    super("fill");
    this.begin = begin;
    this.end = end;
    this.block = block;
    this.nbt = nbt;
    this.fillMode = fillMode;
  }

  get [Command.ARGUMENTS]() {
    const args: Argument[] = [this.begin, this.end, this.block];

    if (this.nbt) args.push(this.nbt);
    if (!this.fillMode) this.fillMode = "replace";

    args.push(this.fillMode);

    return args as Args;
  }
}

export function fill(
    begin: Position,
    end: Position,
    block: BlockID,
    nbt?: NBT,
    fillMode?: FillMode    
): FillCommand {
    return new FillCommand(begin, end, block, nbt, fillMode);
};

Command.registerCommand("fill", fill);
declare module "../" {
  interface CommandContext {
    fill: typeof fill;
  }
}
