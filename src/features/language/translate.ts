import { messages } from "../../content/vi/messages.ts";
import { courseMessages } from "../../content/vi/course.ts";
import { bookMessages } from "../../content/vi/books.ts";
import { studioMessages } from "../../content/vi/studios.ts";
export type StudyLanguage = "vi" | "en";
export function readLanguage(value: string | null): StudyLanguage {
  return value === "en" ? "en" : "vi";
}
const catalog: Record<string, string> = {
  ...messages,
  ...courseMessages,
  ...bookMessages,
  ...studioMessages,
};
export const hasVietnamese = (text: string) =>
  Object.hasOwn(catalog, text.replace(/\s+/g, " ").trim());
export function translate(text: string, language: StudyLanguage): string {
  if (language === "en" || !text.trim()) return text;
  const key = text.replace(/\s+/g, " ").trim(),
    value = Object.hasOwn(catalog, key) ? catalog[key] : undefined;
  const pad = (s: string) =>
    `${text.match(/^\s*/)?.[0] ?? ""}${s}${text.match(/\s*$/)?.[0] ?? ""}`;
  if (value !== undefined) return pad(value);
  const section: Record<string, string> = {
    vocabulary: "từ vựng",
    grammar: "ngữ pháp",
    reading: "đọc",
    listening: "nghe",
    speaking: "nói",
    writing: "viết",
    quiz: "kiểm tra",
  };
  let match = key.match(/^I reviewed the (\w+) section$/);
  if (match) return pad(`Tôi đã ôn phần ${section[match[1]] ?? match[1]}`);
  match = key.match(/^Look up (.+)$/);
  if (match) return pad(`Tra từ ${match[1]}`);
  match = key.match(/^Translate sentence (\d+)$/);
  if (match) return pad(`Dịch câu ${match[1]}`);
  match = key.match(/^Open day (\d+): (.+)$/);
  if (match)
    return pad(`Mở ngày ${match[1]}: ${translate(match[2], language)}`);
  match = key.match(/^(Start|Resume|Revisit|Review) day (\d+)$/);
  if (match)
    return pad(
      `${{ Start: "Bắt đầu", Resume: "Học tiếp", Revisit: "Học lại", Review: "Ôn lại" }[match[1]]} ngày ${match[2]}`,
    );
  match = key.match(/^Day (\d+)$/);
  if (match) return pad(`Ngày ${match[1]}`);
  match = key.match(/^(Check question|Check book question) (\d+)$/);
  if (match)
    return pad(
      `Kiểm tra câu ${match[2]}${match[1].includes("book") ? " theo sách" : ""}`,
    );
  match = key.match(/^Return to day (\d+) · book practice$/);
  if (match) return pad(`Quay lại ngày ${match[1]} · luyện theo sách`);
  match = key.match(/^Review book practice for day (\d+)$/);
  if (match) return pad(`Ôn bài theo sách ngày ${match[1]}`);
  match = key.match(/^(?:· )?(\d+) (MINUTES|MIN|minutes|min)$/);
  if (match) return pad(`${key.startsWith("·") ? "· " : ""}${match[1]} phút`);
  match = key.match(/^B2 · Chapter (\d+) · (.+)$/);
  if (match)
    return pad(`B2 · Chương ${match[1]} · ${translate(match[2], language)}`);
  match = key.match(/^Chapter (\d+) · (.+)$/);
  if (match)
    return pad(`Chương ${match[1]} · ${translate(match[2], language)}`);
  match = key.match(/^Open (.+)$/);
  if (match && translate(match[1], language) !== match[1])
    return pad(`Mở ${translate(match[1], language)}`);
  match = key.match(/^(.+?) — (.+)$/);
  if (match && translate(match[2], language) !== match[2])
    return pad(`${match[1]} — ${translate(match[2], language)}`);
  match = key.match(/^Grammar reference · (.+)$/);
  if (match)
    return pad(`Ngữ pháp tham khảo · ${translate(match[1], language)}`);
  match = key.match(
    /^Guide available: (.+)\. Open the matching PDF below to enable its page shortcuts\.$/,
  );
  if (match)
    return pad(
      `Đã có hướng dẫn: ${translate(match[1], language)}. Mở đúng PDF bên dưới để dùng nút đến trang.`,
    );
  match = key.match(
    /^Ready: (.+)\. Page-guide buttons open this exact edition\.$/,
  );
  if (match)
    return pad(
      `Sẵn sàng: ${translate(match[1], language)}. Các nút đến trang áp dụng cho đúng bản sách này.`,
    );
  match = key.match(/^· printed p\. (\d+)$/);
  if (match) return pad(`· trang in ${match[1]}`);
  // Grammatical labels retain their German forms and collocations.
  let grammar = key
    .replace(/Feminine noun/g, "Danh từ giống cái")
    .replace(/Masculine noun/g, "Danh từ giống đực")
    .replace(/Neuter noun/g, "Danh từ giống trung")
    .replace(/plural:/gi, "số nhiều:")
    .replace(/usually singular/gi, "thường dùng số ít")
    .replace(/Separable verb/g, "Động từ tách")
    .replace(/Reflexive verb/g, "Động từ phản thân")
    .replace(/Past participle/g, "Phân từ II")
    .replace(/Verb \+ accusative/g, "Động từ đi với Akkusativ")
    .replace(/Preposition \+ accusative/g, "Giới từ đi với Akkusativ")
    .replace(/Preposition \+ dative/g, "Giới từ đi với Dativ")
    .replace(/Personal pronoun/g, "Đại từ nhân xưng")
    .replace(/Proper name/g, "Tên riêng")
    .replace(/Subordinating conjunction/g, "Liên từ phụ thuộc")
    .replace(/Adjective/g, "Tính từ")
    .replace(/Adverb/g, "Trạng từ")
    .replace(/Noun;/g, "Danh từ;")
    .replace(/Collocation:/g, "Cụm từ thường đi cùng:")
    .replace(/collocation:/g, "cụm từ thường đi cùng:");
  grammar = grammar
    .replace(/\bFeminine\b/g, "Giống cái")
    .replace(/\bMasculine\b/g, "Giống đực")
    .replace(/\bNeuter\b/g, "Giống trung")
    .replace(/\bReflexive\b/g, "Phản thân")
    .replace(/\bVerb\b/g, "Động từ")
    .replace(/\bConnector\b/g, "Từ nối")
    .replace(/\bTemporal adverb\b/g, "Trạng từ thời gian")
    .replace(/\bAdverbial expression\b/g, "Cụm trạng từ")
    .replace(/\baccusative\b/gi, "Akkusativ")
    .replace(/\bdative\b/gi, "Dativ")
    .replace(
      /\bfollowed by main-clause order\b/g,
      "theo sau là trật tự câu chính",
    );
  if (grammar !== key) return pad(grammar);
  return text;
}
