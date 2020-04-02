import { ArgumentObject, Range, rangeToString, NBT } from "./";

export enum SelectorTarget {
  nearest = "p",
  random = "r",
  player = "a",
  entity = "e",
  executer = "s"
}

type EntityType = "minecraft:area_effect_cloud" | "minecraft:armor_stand" | "minecraft:arrow" | "minecraft:bat" | "minecraft:bee" | "minecraft:blaze" | "minecraft:boat" | "minecraft:cat" | "minecraft:cave_spider" | "minecraft:chest_minecart" | "minecraft:chicken" | "minecraft:cod" | "minecraft:command_block_minecart" | "minecraft:cow" | "minecraft:creeper" | "minecraft:dolphin" | "minecraft:donkey" | "minecraft:dragon_fireball" | "minecraft:drowned" | "minecraft:egg" | "minecraft:elder_guardian" | "minecraft:end_crystal" | "minecraft:ender_dragon" | "minecraft:ender_pearl" | "minecraft:enderman" | "minecraft:endermite" | "minecraft:evoker" | "minecraft:evoker_fangs" | "minecraft:experience_bottle" | "minecraft:experience_orb" | "minecraft:eye_of_ender" | "minecraft:falling_block" | "minecraft:fireball" | "minecraft:firework_rocket" | "minecraft:fox" | "minecraft:furnace_minecart" | "minecraft:ghast" | "minecraft:giant" | "minecraft:guardian" | "minecraft:hopper_minecart" | "minecraft:horse" | "minecraft:husk" | "minecraft:illusioner" | "minecraft:iron_golem" | "minecraft:item" | "minecraft:item_frame" | "minecraft:leash_knot" | "minecraft:lightning_bolt" | "minecraft:llama" | "minecraft:llama_spit" | "minecraft:magma_cube" | "minecraft:minecart" | "minecraft:mooshroom" | "minecraft:mule" | "minecraft:ocelot" | "minecraft:painting" | "minecraft:panda" | "minecraft:parrot" | "minecraft:phantom" | "minecraft:pig" | "minecraft:pillager" | "minecraft:polar_bear" | "minecraft:potion" | "minecraft:pufferfish" | "minecraft:rabbit" | "minecraft:ravager" | "minecraft:salmon" | "minecraft:sheep" | "minecraft:shulker" | "minecraft:shulker_bullet" | "minecraft:silverfish" | "minecraft:skeleton" | "minecraft:skeleton_horse" | "minecraft:slime" | "minecraft:small_fireball" | "minecraft:snow_golem" | "minecraft:snowball" | "minecraft:spawner_minecart" | "minecraft:spectral_arrow" | "minecraft:spider" | "minecraft:squid" | "minecraft:stray" | "minecraft:tnt" | "minecraft:tnt_minecart" | "minecraft:trader_llama" | "minecraft:trident" | "minecraft:tropical_fish" | "minecraft:turtle" | "minecraft:vex" | "minecraft:villager" | "minecraft:vindicator" | "minecraft:wandering_trader" | "minecraft:witch" | "minecraft:wither" | "minecraft:wither_skeleton" | "minecraft:wither_skull" | "minecraft:wolf" | "minecraft:zombie" | "minecraft:zombie_horse" | "minecraft:zombie_pigman" | "minecraft:zombie_villager"

interface SelectorArguments {
  x?: number;
  y?: number;
  z?: number;
  distance?: number;
  dx?: number;
  dy?: number;
  dz?: number;
  scores?: {
    [score: string]: Range;
  };
  team?: {
    [team: string]: boolean;
  };
  limit?: number;
  sort?: "nearest" | "furthest" | "random" | "arbitrary";
  level?: Range;
  gamemode?: {
    spectator?: boolean;
    adventure?: boolean;
    creative?: boolean;
    survival?: boolean;
  };
  name?: {
    [name: string]: boolean;
  };
  x_rotation?: Range;
  y_rotation?: Range;
  type?: {
    [type in EntityType]?: boolean;
  };
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

function boolanMapToString(map: { [val: string]: boolean }, key: string) {
  return Object.entries<boolean>(map).map(
    ([val, v]) => `${key}=${v ? "" : "!"}${val}`
  );
}

export class Selector extends ArgumentObject {
  public target: SelectorTarget;
  public arguments: SelectorArguments;

  constructor(target: SelectorTarget, args: SelectorArguments = {}) {
    super();
    this.target = target;
    this.arguments = args;
  }

  compile() {
    const argList: string[] = [];
    for (let [arg, val] of Object.entries(this.arguments)) {
      switch (arg) {
        case "scores":
          const scores = Object.entries<Range>(val).map(
            ([s, r]) => `${s}=${rangeToString(r)}`
          );
          if (!scores.length) break;
          argList.push(`scores={${scores.join(",")}}`);
          break;
        case "level":
          argList.push(`level=${rangeToString(val)}`);
          break;
        case "team":
        case "gamemode":
        case "name":
        case "type":
        case "tag":
        case "predicate":
          argList.push(...boolanMapToString(val, arg));
          break;
        case "x_rotation":
        case "y_rotation":
          argList.push(`${arg}=${rangeToString(val)}`);
          break;
        case "advancements":
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
        default:
          argList.push(`${arg}=${val}`);
      }
    }

    const args = argList.length ? `[${argList.join(",")}]` : "";

    return `@${this.target}${args}`;
  }
}
