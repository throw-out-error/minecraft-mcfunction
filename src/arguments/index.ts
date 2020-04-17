import { Range } from "./util";

export abstract class ArgumentObject {
  public async *compile(): AsyncGenerator<string, void, unknown> {
    yield this.toString();
  }
  public abstract toString(): string;
}

const NAMESPACE: unique symbol = Symbol("namesapce");
export abstract class NamespacedArgument extends ArgumentObject {
  static readonly NAMESPACE: typeof NAMESPACE = NAMESPACE;
  [NAMESPACE]: string = "minecraft";
}

export type Argument = ArgumentObject | string | number | Range;

export * from "./entity";
export * from "./item";
export * from "./nbt";
export * from "./position";
export * from "./rotation";
export * from "./selector";
export * from "./util";
