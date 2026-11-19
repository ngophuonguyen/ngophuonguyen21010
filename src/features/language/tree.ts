import {
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from "react";
import { translate, type StudyLanguage } from "./translate.ts";
// Localise presentation only. Form values, identifiers, German content and service payloads stay unchanged.
export function localizeTree(
  node: ReactNode,
  language: StudyLanguage,
  inheritedLanguage?: string,
): ReactNode {
  if (language === "en") return node;
  if (Array.isArray(node))
    return node.map((child) =>
      localizeTree(child, language, inheritedLanguage),
    );
  if (typeof node === "string")
    return inheritedLanguage === "de" ? node : translate(node, language);
  if (!isValidElement(node)) return node;
  const element = node as ReactElement<Record<string, unknown>>,
    props = element.props,
    tag = typeof element.type === "string" ? element.type : null;
  const lang = typeof props.lang === "string" ? props.lang : inheritedLanguage;
  const patch: Record<string, unknown> = {};
  for (const key of ["aria-label", "title", "placeholder", "alt", "label"])
    if (typeof props[key] === "string")
      patch[key] = translate(props[key] as string, language);
  if (
    props.lang === "en" &&
    Children.toArray(props.children as ReactNode).some(
      (c) => typeof c === "string" && translate(c, language) !== c,
    )
  )
    patch.lang = "vi";
  // An option without a value derives it from its label; retain its original semantic value.
  if (
    tag === "option" &&
    props.value === undefined &&
    typeof props.children === "string"
  )
    patch.value = props.children;
  if (props.children !== undefined)
    patch.children = Array.isArray(props.children)
      ? props.children.map((child) => localizeTree(child, language, lang))
      : localizeTree(props.children as ReactNode, language, lang);
  return cloneElement(element, patch);
}
