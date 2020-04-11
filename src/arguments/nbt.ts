import { parse, stringify, Tag } from "nbt-ts";
import { ArgumentObject } from ".";

export class NBT<T extends Tag = Tag> extends ArgumentObject {
  tag: T;

  constructor(tag: T | string) {
    super();
    if (typeof tag === "string") {
      tag = parse(tag) as T;
    }
    this.tag = tag;
  }

  toString() {
    return stringify(this.tag);
  }
}
