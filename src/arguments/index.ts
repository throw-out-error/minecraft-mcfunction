import { Range } from "./util";

export abstract class ArgumentObject {
  public abstract compile(): string;
  public toString(): string {
    return this.compile();
  }
}

export type Argument = ArgumentObject | string | number | Range;

export * from "./entity";
export * from "./nbt";
export * from "./position";
export * from "./rotation";
export * from "./selector";
export * from "./util";
export * from "./value";
