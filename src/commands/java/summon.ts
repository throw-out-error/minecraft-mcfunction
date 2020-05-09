import { Command } from "..";
import { Argument, EntityID, Position, NBT } from "../../arguments";

type Args = [EntityID] | [EntityID, Position] | [EntityID, Position, NBT];

export class SummonCommand extends Command<"summon", Args> {
  entity: EntityID;
  position?: Position;
  nbt?: NBT;

  constructor(entity: EntityID, position?: Position, nbt?: NBT) {
    super("summon");
    this.entity = entity;
    this.position = position;
    this.nbt = nbt;
  }

  get [Command.ARGUMENTS]() {
    const args: Argument[] = [this.entity];
    if (this.position) args.push(this.position);
    if (this.nbt) args.push(this.nbt);
    return args as Args;
  }
}

export function summon(entity: EntityID, position?: Position, nbt?: NBT) {
  return new SummonCommand(entity, position, nbt);
}

Command.registerCommand("summon", summon);
declare module "../" {
  interface CommandContext {
    summon: typeof summon;
  }
}
