import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { translate, readLanguage, type StudyLanguage } from "./translate";
import { localizeTree } from "./tree";
const Context = createContext({
  language: "vi" as StudyLanguage,
  setLanguage: (_language: StudyLanguage) => {},
});
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<StudyLanguage>(() => {
      try {
        return readLanguage(localStorage.getItem("deutsch-study-language"));
      } catch {
        return "vi";
      }
    }),
    [error, setError] = useState("");
  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem("deutsch-study-language", language);
      setError("");
    } catch {
      setError(
        language === "vi"
          ? "Không lưu được lựa chọn ngôn ngữ trên thiết bị này."
          : "The language preference could not be saved on this device.",
      );
    }
  }, [language]);
  return (
    <Context.Provider value={{ language, setLanguage }}>
      {children}
      {error && (
        <p role="status" className="language-storage-error">
          {error}
        </p>
      )}
    </Context.Provider>
  );
}
export const useStudyLanguage = () => useContext(Context);
export function Localized({ children }: { children: ReactNode }) {
  const { language } = useStudyLanguage();
  return localizeTree(children, language);
}
export function LanguageSwitcher() {
  const { language, setLanguage } = useStudyLanguage();
  return (
    <label className="study-language-control">
      <span>{language === "vi" ? "Ngôn ngữ hỗ trợ" : "Support language"}</span>
      <select
        aria-label="Ngôn ngữ hỗ trợ / Support language"
        value={language}
        onChange={(e) => setLanguage(e.target.value as StudyLanguage)}
      >
        <option value="vi">Tiếng Việt</option>
        <option value="en">English</option>
      </select>
    </label>
  );
}
export function NativeHint({ text }: { text: string }) {
  const { language } = useStudyLanguage();
  const native = translate(text, "vi");
  return language === "vi" && native !== text ? (
    <details className="native-hint">
      <summary>Giải nghĩa yêu cầu bằng tiếng Việt</summary>
      <p lang="vi">{native}</p>
    </details>
  ) : null;
}

export function LanguageNotice() {
  const { language } = useStudyLanguage();
  return language === "vi" ? (
    <details className="native-mode-note">
      <summary>Đang học với hỗ trợ tiếng Việt</summary>
      <p>
        Hướng dẫn, nghĩa từ và giải thích đã biên soạn được hiển thị bằng tiếng
        Việt. Đề, âm thanh và câu trả lời vẫn giữ tiếng Đức. PDF, phụ đề tự nhập
        và mục từ ngoài bộ biên soạn không được tự dịch toàn bộ; nguồn tiếng Anh
        vẫn được ghi rõ.
      </p>
    </details>
  ) : null;
}
