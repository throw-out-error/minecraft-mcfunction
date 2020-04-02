export abstract class Argument {
  public abstract compile(): string;
  public toString(): string {
    return this.compile();
  }
}

export * from "./selector";
export * from "./util";
export * from "./nbt";
