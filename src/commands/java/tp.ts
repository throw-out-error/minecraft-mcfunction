import { Command } from "..";
import { TeleportCommand, teleport } from "./teleport";

export class TpCommand extends TeleportCommand {}
export const tp = teleport;

Command.registerCommand("tp", tp);
declare module "../" {
    interface CommandContext {
        tp: typeof tp;
    }
}
