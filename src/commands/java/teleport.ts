import { Command } from "..";
import { Selector, Position, Rotation } from "../../arguments";

type MeToTarget = [Selector];
type MeToLocation = [Position];
type OtherToTarget = [Selector, Selector];
type OtherToLocation = [Selector, Position] | [Selector, Position, Rotation];
type Facing = [Selector, Position, "facing", Position];
type FacingEntity =
  | [Selector, Position, "facing", "entity", Selector]
  | [Selector, Position, "facing", "entity", Selector, "eyes" | "feet"];

type Args =
  | MeToTarget
  | MeToLocation
  | OtherToTarget
  | OtherToLocation
  | Facing
  | FacingEntity;

export class TeleportCommand extends Command<"teleport", Args> {
  constructor(...args: Args) {
    super("teleport", args);
  }
}

export function teleport(...args: Args) {
  return new TeleportCommand(...args);
}

Command.registerCommand("teleport", teleport);
declare module "../" {
  interface CommandContext {
    teleport: typeof teleport;
  }
}
