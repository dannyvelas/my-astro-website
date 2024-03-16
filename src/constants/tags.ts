const tags = [
  "design-patterns",
  "clojure",
  "polymorphism",
  "web-frameworks",
  "career",
  "apl",
];

export const getTags = () => structuredClone(tags);

export const tagToPrettyName = (tag: string) => tag.replace(/-/g, " ");
