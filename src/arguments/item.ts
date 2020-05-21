import { ArgumentObject } from ".";
import { NBT } from "./nbt";

export class Item<T extends string = string> extends ArgumentObject {
  item: T;
  nbt?: NBT;
  includeNBT = false;

  constructor(item: T, nbt?: NBT) {
    super();
    this.item = item;
    this.nbt = nbt;
  }

  async *compile() {
    yield this.item;
    if (this.nbt) {
      yield "[";
      for await (const c of this.nbt.compile()) {
        yield c;
      }
      yield "]";
    }
  }

  toString() {
    let str: string = this.item;
    const nbt = this.nbt;
    if (nbt) {
      str += `[${nbt.toString()}]`;
    }
    return str;
  }
}
