import { Command } from "..";
import { Argument, BlockID, Position, NBT } from "../../arguments";

type SetblockMode = "destroy" | "keep" | "replace";

type Setblock =
  | [Position, BlockID]
  | [Position, BlockID, NBT]
  | [Position, BlockID, SetblockMode]
  | [Position, BlockID, NBT, SetblockMode]
type Args = Setblock;

export class SetblockCommand extends Command<"setblock", Args> {
  position: Position;
  block: BlockID;
  nbt?: NBT;
  setblockMode?: SetblockMode;
  
  constructor(
    position: Position,
    block: BlockID,
    nbt?: NBT,
    setblockMode?: SetblockMode
  ) {
    super("setblock");
    this.position = position;
    this.block = block;
    this.nbt = nbt;
    this.setblockMode = setblockMode;
  }

  get [Command.ARGUMENTS]() {
    const args: Argument[] = [this.position, this.block];
    
    if (this.nbt) args.push(this.nbt);
    if (!this.setblockMode) this.setblockMode = "replace";

    args.push(this.setblockMode);

    return args as Args;
  }
}

export function setblock(
    position: Position,
    block: BlockID,
    nbt?: NBT,
    setblockMode?: SetblockMode    
): SetblockCommand {
    return new SetblockCommand(position, block, nbt, setblockMode);
};

Command.registerCommand("setblock", setblock);
declare module "../" {
  interface CommandContext {
    setblock: typeof setblock;
  }
}
