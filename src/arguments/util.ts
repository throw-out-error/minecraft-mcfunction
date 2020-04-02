export type Range =
  | [number, number]
  | [undefined, number]
  | [number, undefined]
  | number;

export function rangeToString(r: Range) {
  if (typeof r === "number") return `${r}`;
  return `${r[0] ?? ""}..${r[1] ?? ""}`;
}
