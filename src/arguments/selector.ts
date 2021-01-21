import { ArgumentObject, Range, rangeToString, NBT, EntityID } from "./";
import { Transpiler } from "../transpiler";

export enum SelectorTarget {
  nearest = "p",
  random = "r",
  player = "a",
  entity = "e",
  executer = "s"
}

type GameMode = "spectator" | "adventure" | "creative" | "survival";

interface SelectorArguments {
  x?: number;
  y?: number;
  z?: number;
  distance?: Range;
  dx?: number;
  dy?: number;
  dz?: number;
  scores?: {
    [score: string]: Range;
  };
  team?: string | Record<string, false>;
  limit?: number;
  sort?: "nearest" | "furthest" | "random" | "arbitrary";
  level?: Range;
  gamemode?: GameMode | Record<GameMode, false>;
  name?: {
    [name: string]: boolean;
  };
  x_rotation?: Range;
  y_rotation?: Range;
  type?: EntityID | Record<EntityID, false>;
  tag?: {
    [tag: string]: boolean;
  };
  nbt?: NBT;
  advancements?: {
    [advancement: string]: boolean | { [criteria: string]: boolean };
  };
  predicate?: {
    [predicate: string]: boolean;
  };
}

function boolanMapToKVPairs<T extends string>(
  map: { [val: string]: boolean },
  key: T
) {
  return Object.entries<boolean>(map).map(([val, v]) => [
    key,
    `${v ? "" : "!"}${val}`
  ]) as [T, string][];
}

export class Selector extends ArgumentObject {
  public target: SelectorTarget;
  public arguments: SelectorArguments;

  constructor(
    target: SelectorTarget | keyof typeof SelectorTarget,
    args: SelectorArguments = {}
  ) {
    super();
    this.target = SelectorTarget[target] ?? target;
    this.arguments = args;
  }

  async *compile() {
    yield `@${this.target}`;

    const args = Object.entries(this.arguments) as [
      keyof SelectorArguments,
      any
    ][];

    const list: [keyof SelectorArguments, string][] = [];
    args.forEach(([arg, val]) => {
      switch (arg) {
        case "scores": {
          const scores = Object.entries<Range>(val).map(
            ([s, r]) => `${s}=${rangeToString(r)}`
          );
          if (!scores.length) return;
          list.push(["scores", `{${scores.join(",")}}`]);
          break;
        }
        case "distance":
        case "level":
          list.push([arg, `${rangeToString(val)}`]);
          break;

        case "team":
        case "gamemode":
        case "name":
        case "type":
        case "tag":
        case "predicate":
          if (typeof val === "string") {
            list.push([arg, val]);
            break;
          }
          list.push(...boolanMapToKVPairs(val, arg));
          break;

        case "x_rotation":
        case "y_rotation":
          list.push([arg, rangeToString(val)]);
          break;

        case "advancements": {
          type Adv = boolean | { [criteria: string]: boolean };
          const advancements = Object.entries<Adv>(val).map(([adv, v]) => {
            if (typeof v === "boolean") {
              return `${adv}=${v ? "true" : "false"}`;
            }
            const criterias = Object.entries<boolean>(v).map(([c, v]) => {
              return `${c}=${v ? "true" : "false"}`;
            });
            return `${adv}={${criterias.join(",")}}`;
          });
          if (!advancements.length) return;
          list.push([arg, `{${advancements.join(",")}}`]);
          break;
        }
        default:
          list.push([arg, val.toString()]);
          break;
      }
    });

    list.sort(([a1, v1], [a2, v2]) => {
      if (a1 === "type" && v1.charAt(0) !== "!") return -1;
      if (a2 === "type" && v2.charAt(0) !== "!") return 1;

      if (a1 === "gamemode") return -1;
      if (a2 === "gamemode") return 1;

      if (a1 === "team") return -1;
      if (a2 === "team") return 1;

      if (a1 === "type") return -1;
      if (a2 === "type") return 1;

      if (a1 === "tag") return -1;
      if (a2 === "tag") return 1;

      if (a1 === "name") return -1;
      if (a2 === "name") return 1;

      if (a1 === "scores") return -1;
      if (a2 === "scores") return 1;

      if (a1 === "advancements") return -1;
      if (a2 === "advancements") return 1;

      if (a1 === "nbt") return -1;
      if (a2 === "nbt") return 1;

      return a1.localeCompare(a2);
    });

    if (list.length) {
      yield "[";
      for (let i = 0; i < list.length; i++) {
        if (i > 0) yield ",";
        const [arg, val] = list[i];
        yield arg;
        yield "=";
        yield val;
      }
      yield "]";
    }
  }

  toString() {
    const argList: string[] = [];
    for (const [arg, val] of Object.entries(this.arguments)) {
      switch (arg) {
        case "scores": {
          const scores = Object.entries<Range>(val).map(
            ([s, r]) => `${s}=${rangeToString(r)}`
          );
          if (!scores.length) break;
          argList.push(`scores={${scores.join(",")}}`);
          break;
        }
        case "level":
          argList.push(`level=${rangeToString(val)}`);
          break;
        case "team":
        case "gamemode":
        case "name":
        case "type":
        case "tag":
        case "predicate":
          if (typeof val === "string") {
            argList.push(`${arg}=${val}`);
            break;
          }
          argList.push(
            ...boolanMapToKVPairs(val, arg).map(p => `${p[0]}=${p[1]}`)
          );
          break;
        case "x_rotation":
        case "y_rotation":
          argList.push(`${arg}=${rangeToString(val)}`);
          break;
        case "advancements": {
          type Adv = boolean | { [criteria: string]: boolean };
          const advancements = Object.entries<Adv>(val).map(([adv, v]) => {
            if (typeof v === "boolean") {
              return `${adv}=${v ? "true" : "false"}`;
            }
            const criterias = Object.entries<boolean>(v).map(([c, v]) => {
              return `${c}=${v ? "true" : "false"}`;
            });
            return `${adv}={${criterias.join(",")}}`;
          });
          if (!advancements.length) break;
          argList.push(`advancements={${advancements.join(",")}}`);
          break;
        }
        default:
          argList.push(`${arg}=${val}`);
      }
    }

    const args = argList.length ? `[${argList.join(",")}]` : "";

    return `@${this.target}${args}`;
  }

  static entity(args: SelectorArguments = {}) {
    return new Selector(SelectorTarget.entity, args);
  }
  static executer(args: Omit<SelectorArguments, "sort" | "limit"> = {}) {
    return new Selector(SelectorTarget.executer, args);
  }
  static nearest(args: Omit<SelectorArguments, "type"> = {}) {
    return new Selector(SelectorTarget.nearest, args);
  }
  static player(args: Omit<SelectorArguments, "type"> = {}) {
    return new Selector(SelectorTarget.player, args);
  }
  static random(args: SelectorArguments = {}) {
    return new Selector(SelectorTarget.random, args);
  }

  *[Symbol.iterator]() {
    Transpiler.emit("function:start");
    const iterator = new Selector("executer");
    Transpiler.emit("iteration", this, iterator);
    yield iterator;
    Transpiler.emit("function:end");
  }
}
