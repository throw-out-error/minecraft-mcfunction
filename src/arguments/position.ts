import { ArgumentObject } from ".";

export class Position extends ArgumentObject {
  x: number;
  y: number;
  z: number;

  constructor({ x, y, z }: { x: number; y: number; z: number }) {
    super();
    this.x = x;
    this.y = y;
    this.z = z;
  }
  compile() {
    return `${this.x} ${this.y} ${this.z}`;
  }
}
