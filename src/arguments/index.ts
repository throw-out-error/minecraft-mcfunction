export abstract class ArgumentObject {
  public abstract compile(): string;
  public toString(): string {
    return this.compile();
  }
}

export type Argument = ArgumentObject | string;

export * from "./selector";
export * from "./util";
export * from "./nbt";
