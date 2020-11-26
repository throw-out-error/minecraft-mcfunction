import { ArgumentObject } from ".";

export class Rotation extends ArgumentObject {
    alpha: number;
    beta: number;

    constructor({ alpha, beta }: { alpha: number; beta: number }) {
        super();
        this.alpha = alpha;
        this.beta = beta;
    }
    toString() {
        return `${this.alpha} ${this.beta}`;
    }
}
