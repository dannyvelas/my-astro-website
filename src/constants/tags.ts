const tags = await initTags();

async function initTags(): Promise<string[]> {
  const tagSet = new Set<string>();

  const posts = import.meta.glob("../pages/posts/*.md");
  for (const path in posts) {
    const post = (await posts[path]()) as any;
    for (const tag of post.frontmatter.tags) {
      tagSet.add(tag);
    }
  }

  return Array.from(tagSet);
}

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
