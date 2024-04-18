// these are the url-friendly tags
const tags = [
  "design-patterns",
  "haskell",
  "programming-languages",
  "writing",
  "clojure",
  "ocaml",
  "web-frameworks",
  "career",
  "apl",
  "go",
];

// by default, a url-friendly tag will be converted to a user-friendly tag by doing replace(/-/g, " ").
// the tags that are an exception to this rule are saved in this variable
const _tagToPrettyName: Record<string, string> = {
  apl: "APL",
  clojure: "Clojure",
  ocaml: "OCaml",
  haskell: "Haskell",
  go: "Go",
};

export const getTags = () => structuredClone(tags);

export const tagToPrettyName = (tag: string): string =>
  _tagToPrettyName[tag] || tag.replace(/-/g, " ");
