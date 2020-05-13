import { ArgumentObject } from ".";

interface Relativity {
  absolute?: boolean;
  relative?: boolean;
  directional?: boolean;
}

interface Coords {
  x: number;
  y: number;
  z: number;
}

function format(coord: number, { directional, relative }: Relativity) {
  if (directional) return "^" + (coord || "");
  if (relative) return "~" + (coord || "");
  return coord;
}

export class Position extends ArgumentObject {
  x: number;
  y: number;
  z: number;

  readonly xRel: Relativity;
  readonly yRel: Relativity;
  readonly zRel: Relativity;

  constructor(coords?: Partial<Coords>, relativity?: keyof Relativity);
  constructor(
    coords?: Partial<Coords>,
    relativity?: Relativity & { x?: Relativity; y?: Relativity; z?: Relativity }
  );
  constructor(
    { x, y, z }: Partial<Coords> = {},
    relativity:
      | (Relativity & { x?: Relativity; y?: Relativity; z?: Relativity })
      | keyof Relativity = {}
  ) {
    super();
    if (typeof relativity === "string") {
      relativity = Position.relativity[relativity];
    }

    this.xRel = relativity.x ?? relativity;
    this.yRel = relativity.y ?? relativity;
    this.zRel = relativity.z ?? relativity;

    this.x = x ?? 0;
    this.y = y ?? 0;
    this.z = z ?? 0;
  }

  toString() {
    return [
      format(this.x, this.xRel),
      format(this.y, this.yRel),
      format(this.z, this.zRel)
    ].join(" ");
  }

  static absolute(coords: Partial<Coords> = {}) {
    return new Position(coords, "absolute");
  }

  static relative(coords: Partial<Coords> = {}) {
    return new Position(coords, "relative");
  }

  static directional(coords: Partial<Coords> = {}) {
    return new Position(coords, "directional");
  }

  static relativity: {
    [rel in keyof Relativity]-?: Relativity & { [r in rel]: true };
  } = {
    absolute: { absolute: true },
    directional: { directional: true },
    relative: { relative: true }
  };
}
