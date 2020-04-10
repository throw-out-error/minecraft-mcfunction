import type { Command } from "./";

export class History implements Set<Command> {
  stack = [] as Set<Command>[];

  get top() {
    let head = this.stack?.[0];
    if (!head) {
      head = new Set();
      this.stack.push(head);
    }
    return head;
  }

  push() {
    this.stack.unshift(new Set());
  }

  pop() {
    return this.stack.shift() ?? new Set();
  }

  add(cmd: Command) {
    this.top.add(cmd);
    return this;
  }

  clear() {
    return this.top.clear();
  }

  delete(cmd: Command) {
    return this.top.delete(cmd);
  }

  entries() {
    return this.top.entries();
  }

  forEach(...args: Parameters<Set<Command>["forEach"]>) {
    return this.top.forEach(...args);
  }

  has(cmd: Command) {
    return this.top.has(cmd);
  }

  keys() {
    return this.top.keys();
  }

  get size() {
    return this.top.size;
  }

  values() {
    return this.top.values();
  }

  get [Symbol.toStringTag]() {
    return this.top[Symbol.toStringTag];
  }

  get [Symbol.iterator]() {
    return this.top[Symbol.iterator];
  }
}
