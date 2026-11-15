import { textLines } from "./catalog.ts";
export type MaterialPage = {
  page: number;
  text: string;
  topics: string[];
  grammar: string[];
  skills: string[];
  vocabulary: string[];
};
export type Material = {
  id: string;
  scope: string;
  sha: string;
  name: string;
  level: "B1" | "B2" | "Mixed";
  createdAt: string;
  blob: Blob;
  pages: MaterialPage[];
  emptyPages: number;
};
const topics: Record<string, RegExp> = {
  work: /arbeit|beruf|kolleg|betrieb|bewerbung/i,
  education: /lernen|schule|kurs|prüfung|unterricht/i,
  travel: /reise|urlaub|zug|bahnhof|flug/i,
  health: /gesund|arzt|krank|bewegung|erholung/i,
  housing: /wohnung|miete|nachbar|umzug/i,
  environment: /umwelt|klima|reparatur|energie|nachhalt/i,
  media: /internet|nachricht|medien|digital/i,
  relationships: /freund|familie|beziehung|gemeinsam/i,
};
const grammars: Record<string, RegExp> = {
  "Relative clauses": /\b(dessen|deren|welcher|welche|welches)\b/i,
  "Konjunktiv II": /\b(hätte|hätten|wäre|wären|würde|würden|könnte|könnten)\b/i,
  "Subordinate clauses": /\b(weil|obwohl|nachdem|bevor|damit|falls|dass)\b/i,
  "Comparative pairs": /\bje\b[\s\S]{0,150}\bdesto\b/i,
  "Passive candidates":
    /\b(wird|werden|wurde|wurden)\b[\s\S]{0,90}\b\p{L}+(t|en)\b/iu,
  "Infinitive clauses": /\b(um|statt|ohne)\b[\s\S]{0,80}\bzu\b/i,
};
export function classifyPage(text: string, page: number): MaterialPage {
  const skills = [
    ["reading", /lesen|leseverstehen/i],
    ["listening", /hören|hörverstehen|transkription|hörtext/i],
    ["writing", /schreiben|schriftlich/i],
    ["speaking", /sprechen|mündlich|gespräch/i],
  ]
    .filter(([, r]) => (r as RegExp).test(text))
    .map(([s]) => s as string);
  const counts = new Map<string, number>();
  for (const word of text.match(/\b[A-ZÄÖÜ][a-zäöüß]{4,}\b/gu) ?? [])
    counts.set(word, (counts.get(word) ?? 0) + 1);
  return {
    page,
    text: text.slice(0, 30000),
    topics: Object.entries(topics)
      .filter(([, r]) => r.test(text))
      .map(([k]) => k),
    grammar: Object.entries(grammars)
      .filter(([, r]) => r.test(text))
      .map(([k]) => k),
    skills: skills.length ? skills : ["reading"],
    vocabulary: [...counts]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([w]) => w),
  };
}
const DB = "deutsch-material-library-v1";
function database() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (!globalThis.indexedDB) {
      reject(Error("Persistent PDF storage is unavailable in this browser."));
      return;
    }
    const request = indexedDB.open(DB, 1);
    request.onupgradeneeded = () =>
      request.result.createObjectStore("materials", { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function request<T>(
  mode: IDBTransactionMode,
  operation: (s: IDBObjectStore) => IDBRequest<T>,
) {
  const db = await database();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction("materials", mode);
    const r = operation(tx.objectStore("materials"));
    let value: T;
    r.onsuccess = () => {
      value = r.result;
    };
    tx.oncomplete = () => {
      db.close();
      resolve(value);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error ?? r.error);
    };
    tx.onabort = () => {
      db.close();
      reject(tx.error ?? Error("Library transaction aborted."));
    };
  });
}
export async function listMaterials(scope: string) {
  const rows = (await request("readonly", (s) => s.getAll())) as Material[];
  return rows
    .filter(
      (r) =>
        r.scope === scope &&
        typeof r.name === "string" &&
        Array.isArray(r.pages) &&
        r.blob instanceof Blob,
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export async function findMaterial(scope: string, sha: string) {
  return (await request("readonly", (s) =>
    s.get(`${encodeURIComponent(scope)}:${sha}`),
  )) as Material | undefined;
}
export async function addMaterial(material: Material) {
  const db = await database();
  return new Promise<Material>((resolve, reject) => {
    const tx = db.transaction("materials", "readwrite"),
      s = tx.objectStore("materials");
    let saved = material;
    const get = s.get(material.id);
    get.onsuccess = () => {
      if (get.result) saved = get.result;
      else s.add(material);
    };
    tx.oncomplete = () => {
      db.close();
      resolve(saved);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
    tx.onabort = () => {
      db.close();
      reject(tx.error ?? Error("Library save aborted."));
    };
  });
}
export type TextPdf = {
  numPages: number;
  getPage: (
    n: number,
  ) => Promise<{ getTextContent: () => Promise<{ items: unknown[] }> }>;
};
export async function indexMaterial(
  pdf: TextPdf,
  file: Blob & { name: string },
  sha: string,
  scope: string,
  level: Material["level"],
  onProgress: (n: number, total: number) => void,
  signal: AbortSignal,
) {
  const previous = await findMaterial(scope, sha);
  if (previous) return previous;
  const pages: MaterialPage[] = [];
  let length = 0;
  for (let n = 1; n <= pdf.numPages; n++) {
    if (signal.aborted)
      throw new DOMException("Import cancelled", "AbortError");
    const p = await pdf.getPage(n),
      content = await p.getTextContent(),
      text = textLines(content.items).join("\n").slice(0, 30000);
    length += text.length;
    if (length > 8_000_000)
      throw Error(
        "Extracted text exceeds the 8 MB library limit for one document.",
      );
    pages.push(classifyPage(text, n));
    onProgress(n, pdf.numPages);
  }
  if (signal.aborted) throw new DOMException("Import cancelled", "AbortError");
  return addMaterial({
    id: `${encodeURIComponent(scope)}:${sha}`,
    scope,
    sha,
    name: file.name,
    level,
    createdAt: new Date().toISOString(),
    blob: file,
    pages,
    emptyPages: pages.filter((p) => !p.text.trim()).length,
  });
}

// Original transfer prompts are selected from detected patterns, never copied from the PDF.
export function transferPractice(p: MaterialPage) {
  const focus = p.grammar[0] ?? "Subordinate clauses";
  const examples: Record<string, [string, string, string[], number, string]> = {
    "Relative clauses": [
      "Das ist die Kollegin, mit der ich lerne.",
      "Das ist die Kollegin, mit ___ ich lerne.",
      ["die", "der", "den"],
      1,
      "Mit requires dative; the feminine dative relative pronoun is der.",
    ],
    "Konjunktiv II": [
      "Wenn ich Zeit hätte, würde ich den Kurs besuchen.",
      "Wenn ich Zeit ___, würde ich den Kurs besuchen.",
      ["hätte", "hatte", "haben"],
      0,
      "Hätte describes an imagined present condition.",
    ],
    "Comparative pairs": [
      "Je öfter ich übe, desto sicherer werde ich.",
      "Je öfter ich übe, desto sicherer ___ ich.",
      ["ich werde", "werde", "werden"],
      1,
      "After desto + comparative, the finite verb precedes the subject.",
    ],
    "Passive candidates": [
      "Die Unterlagen werden geprüft.",
      "Die Unterlagen ___ geprüft.",
      ["wird", "werden", "hat"],
      1,
      "Plural Unterlagen requires werden in the present process passive.",
    ],
    "Infinitive clauses": [
      "Ich plane Pausen, um mich zu erholen.",
      "Ich plane Pausen, um mich zu ___.",
      ["erholen", "erholt", "erhole"],
      0,
      "Um … zu introduces purpose with an infinitive.",
    ],
    "Subordinate clauses": [
      "Ich übe regelmäßig, weil mir das Lernen wichtig ist.",
      "Ich übe regelmäßig, weil mir das Lernen wichtig ___.",
      ["ist", "es ist", "sein"],
      0,
      "A subordinate weil-clause places its finite verb at the end.",
    ],
  };
  const ex = examples[focus] ?? examples["Subordinate clauses"];
  return {
    focus,
    example: ex[0],
    prompt: `Create a new ${p.topics[0] ?? "everyday-life"} situation using ${p.vocabulary.slice(0, 3).join(", ") || "three words you choose from this page"}. Write 40–60 German words and try the target pattern. Do not copy the page.`,
    question: ex[1],
    options: ex[2],
    answer: ex[3],
    explanation: ex[4],
  };
}
