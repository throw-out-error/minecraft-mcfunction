import type { Command } from "../commands";
import type { Selector } from "../arguments";

export default class Scope extends Set<Command> {
  public iterator?: Selector;
  public iterable?: Selector;
}
