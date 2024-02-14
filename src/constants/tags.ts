const tags: Record<string, string> = {
  "design-patterns": "design patterns",
  clojure: "clojure",
  polymorphism: "polymorphism",
};

export const getTags = () => Object.keys(tags);

export const tagToPrettyName = (tag: string) => {
  return tags[tag];
};
