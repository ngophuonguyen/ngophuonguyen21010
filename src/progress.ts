export type Category = "day" | "word" | "listening" | "attempt";
export type Item = {
  category: Category;
  item_id: string;
  value: boolean | { score: number; total: number; day: number; at: string };
};
export type Items = Record<string, Item>;
export const itemKey = (i: Pick<Item, "category" | "item_id">) =>
  `${i.category}:${i.item_id}`;
export function validItem(x: unknown): x is Item {
  if (!x || typeof x !== "object") return false;
  const i = x as Item;
  if (typeof i.item_id !== "string" || i.item_id.length > 200) return false;
  if (i.category === "attempt") {
    const v = i.value;
    return (
      !!v &&
      typeof v === "object" &&
      Number.isInteger(v.score) &&
      v.score >= 0 &&
      Number.isInteger(v.total) &&
      v.total > 0 &&
      v.score <= v.total &&
      Number.isInteger(v.day) &&
      v.day >= 1 &&
      v.day <= 30 &&
      typeof v.at === "string"
    );
  }
  if (typeof i.value !== "boolean") return false;
  if (i.category === "day") return /^([1-9]|[12][0-9]|30)$/.test(i.item_id);
  if (i.category === "word") return /^[0-7]$/.test(i.item_id);
  return i.category === "listening" && /^[a-z0-9-]{1,100}$/.test(i.item_id);
}
export function readItems(raw: string | null): Items {
  try {
    const parsed = JSON.parse(raw || "{}");
    return Object.fromEntries(
      Object.values(parsed)
        .filter(validItem)
        .map((i) => [itemKey(i), i]),
    );
  } catch {
    return {};
  }
}
export function selected(items: Items, category: Category) {
  return Object.values(items)
    .filter((i) => i.category === category && i.value === true)
    .map((i) => i.item_id);
}
export function legacyItems(days: unknown, words: unknown): Items {
  const result: Items = {};
  for (const [category, values] of [
    ["day", days],
    ["word", words],
  ] as const) {
    if (Array.isArray(values))
      for (const id of values) {
        const i = { category, item_id: String(id), value: true };
        if (validItem(i)) result[itemKey(i)] = i;
      }
  }
  return result;
}
