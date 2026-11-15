import { lessons } from "../../content/curriculum/index.ts";
import { lookup, type Entry } from "../../content/dictionary.ts";
import { vocabulary } from "../../content/course.ts";
export type Sense = {
  partOfSpeech: string;
  definition: string;
  examples: string[];
};
export function cleanTerm(value: string) {
  const s = value
    .normalize("NFC")
    .trim()
    .replace(/^[„“”"'.,!?;:()\s]+|[„“”"'.,!?;:()\s]+$/gu, "");
  return s.length <= 100 && /^\p{L}+(?:[-’' ]\p{L}+){0,5}$/u.test(s) ? s : "";
}
export function wordAt(text: string, offset: number) {
  return (
    [...text.matchAll(/\p{L}+(?:[-’']\p{L}+)*/gu)].find(
      (m) => offset >= m.index! && offset < m.index! + m[0].length,
    )?.[0] ?? ""
  );
}
const extra: Record<string, Entry> = {
  sehnsucht: {
    lemma: "die Sehnsucht",
    meaning: "longing; yearning",
    grammar: "Feminine noun; usually singular",
    note: "Sehnsucht nach + dative: Ich habe Sehnsucht nach dem Meer.",
  },
  voraussetzung: {
    lemma: "die Voraussetzung",
    meaning: "prerequisite; condition",
    grammar: "Feminine noun; plural: Voraussetzungen",
    note: "Eine Voraussetzung für + accusative. Geduld ist eine wichtige Voraussetzung.",
  },
  wahrnehmen: {
    lemma: "wahrnehmen",
    meaning: "to perceive; notice",
    grammar: "Separable verb: nimmt wahr; nahm wahr; hat wahrgenommen",
    note: "Wir nehmen die Welt unterschiedlich wahr. Also: einen Termin wahrnehmen (attend an appointment).",
  },
  wahr: {
    lemma: "wahrnehmen / wahr",
    meaning: "perceive (separable particle); true (adjective)",
    grammar: "Use the sentence to distinguish the particle from the adjective",
    note: "Nimmt … wahr belongs to wahrnehmen. Das ist wahr means That is true.",
  },
  zuversichtlich: {
    lemma: "zuversichtlich",
    meaning: "optimistic; confident",
    grammar: "Adjective; often followed by a dass-clause",
    note: "Ich bin zuversichtlich, dass es klappt.",
  },
  entscheiden: {
    lemma: "sich entscheiden",
    meaning: "to decide",
    grammar:
      "Reflexive verb: entscheidet sich; entschied sich; hat sich entschieden",
    note: "Sich für/gegen etwas entscheiden + accusative.",
  },
  entschieden: {
    lemma: "sich entscheiden",
    meaning: "decided",
    grammar:
      "Past participle: entschieden; also an adjective meaning firm or decisive",
    note: "Ich habe mich für diesen Weg entschieden.",
  },
};
const dailyLexicon = new Map(
  lessons.flatMap((l) =>
    l.vocabulary.flatMap((v) => {
      const entry = {
        lemma: v.term,
        meaning: v.meaning,
        grammar: v.grammar,
        note: `${v.example} — ${v.translation}`,
      };
      return [
        [v.term.toLocaleLowerCase("de-DE"), entry],
        [
          v.term.replace(/^(der|die|das) /, "").toLocaleLowerCase("de-DE"),
          entry,
        ],
      ] as [string, Entry][];
    }),
  ),
);
export function localEntry(term: string): Entry | undefined {
  const k = term.toLocaleLowerCase("de-DE");
  const direct =
    lookup(k) ??
    dailyLexicon.get(k) ??
    (Object.hasOwn(extra, k) ? extra[k] : undefined);
  if (direct) return direct;
  const w = vocabulary.find((w) =>
    [w.word, ...w.forms, w.plural.replace(/^die /, "")].some(
      (s) => s.toLocaleLowerCase("de-DE") === k,
    ),
  );
  return w
    ? {
        lemma: `${w.article} ${w.word}`,
        meaning: w.meaning,
        grammar: `Noun; plural: ${w.plural}`,
        note: w.collocations.join("; "),
      }
    : undefined;
}
export function plainText(html: string) {
  return html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(
      /&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,
      (_, v: string) => {
        const map: Record<string, string> = {
          amp: "&",
          lt: "<",
          gt: ">",
          quot: '"',
          apos: "'",
          nbsp: " ",
        };
        if (v[0] !== "#") return map[v.toLowerCase()] ?? "";
        const n =
          v[1].toLowerCase() === "x"
            ? parseInt(v.slice(2), 16)
            : Number(v.slice(1));
        return n > 0 && n <= 0x10ffff && !(n >= 0xd800 && n <= 0xdfff)
          ? String.fromCodePoint(n)
          : "";
      },
    )
    .trim()
    .slice(0, 1500);
}
export function parseDefinitions(payload: unknown): Sense[] {
  if (!payload || typeof payload !== "object") return [];
  const de = (payload as { de?: unknown }).de;
  if (!Array.isArray(de)) return [];
  const out: Sense[] = [];
  for (const section of de) {
    if (
      !section ||
      typeof section !== "object" ||
      !Array.isArray(section.definitions)
    )
      continue;
    for (const d of section.definitions) {
      if (!d || typeof d.definition !== "string") continue;
      const definition = plainText(d.definition);
      if (definition)
        out.push({
          partOfSpeech:
            typeof section.partOfSpeech === "string"
              ? plainText(section.partOfSpeech)
              : "German entry",
          definition,
          examples: Array.isArray(d.examples)
            ? d.examples
                .filter((x: unknown) => typeof x === "string")
                .slice(0, 2)
                .map(plainText)
            : [],
        });
      if (out.length === 6) return out;
    }
  }
  return out;
}
export const dictionaryLinks = (term: string) => ({
  wiktionary: `https://en.wiktionary.org/wiki/${encodeURIComponent(term.replace(/ /g, "_"))}#German`,
  dwds: `https://www.dwds.de/wb/${encodeURIComponent(term)}`,
  pons: `https://en.pons.com/translate/german-english/${encodeURIComponent(term)}`,
});
const cache = new Map<string, Sense[]>();
export async function onlineEntry(
  term: string,
  signal: AbortSignal,
): Promise<Sense[]> {
  const cached = cache.get(term);
  if (cached) return cached;
  const forms = [
    term,
    ...new Set([
      term[0].toLocaleUpperCase("de-DE") + term.slice(1),
      term.toLocaleLowerCase("de-DE"),
    ]),
  ].filter((v, i, a) => a.indexOf(v) === i);
  for (const form of forms) {
    const response = await fetch(
      `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(form)}`,
      { signal, credentials: "omit", headers: { Accept: "application/json" } },
    );
    if (response.status === 404) continue;
    if (!response.ok)
      throw new Error(
        "Online dictionary is unavailable. Use a source link below.",
      );
    const senses = parseDefinitions(await response.json());
    if (senses.length) {
      if (cache.size >= 100) cache.delete(cache.keys().next().value!);
      cache.set(term, senses);
      return senses;
    }
  }
  return [];
}
