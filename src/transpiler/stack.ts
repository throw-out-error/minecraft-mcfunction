import Scope from "./scope";

export default class Stack {
    #stack: Scope[] = [];

    push(scope?: Scope) {
        this.#stack.unshift(scope ?? new Scope());
    }

    pop() {
        if (this.#stack.length < 1) throw Error("Empty stack");

        return this.#stack.shift() as Scope;
    }

    peek() {
        if (this.#stack.length < 1) throw Error("Empty stack");

        return this.#stack[0];
    }
}
