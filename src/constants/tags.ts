// these are the url-friendly tags
const tags = [
  "design-patterns",
  "clojure",
  "polymorphism",
  "web-frameworks",
  "career",
  "apl",
];

// by default, a url-friendly tag will be converted to a user-friendly tag by doing replace(/-/g, " ").
// the tags that are an exception to this rule are saved in this variable
const _tagToPrettyName: Record<string, string> = { apl: "APL" };

export const getTags = () => structuredClone(tags);

export const tagToPrettyName = (tag: string): string =>
  _tagToPrettyName[tag] || tag.replace(/-/g, " ");
