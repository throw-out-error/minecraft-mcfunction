import { Range } from "./util";

export abstract class ArgumentObject {
  public async *compile(): AsyncGenerator<string, void, unknown> {
    yield this.toString();
  }
  public abstract toString(): string;
}

export type Argument = ArgumentObject | string | number | Range;

export * from "./entity";
export * from "./nbt";
export * from "./position";
export * from "./rotation";
export * from "./selector";
export * from "./util";
export * from "./value";
