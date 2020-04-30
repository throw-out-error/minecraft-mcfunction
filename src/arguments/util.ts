export type Range =
  | [number, number]
  | [undefined, number]
  | [number, undefined]
  | number;

export function rangeToString(r: Range) {
  if (typeof r === "number") return `${r}`;

  const [min = -Infinity, max = Infinity] = r;

  return [min, max].map(n => (isFinite(n) ? n : "")).join("..");
}
