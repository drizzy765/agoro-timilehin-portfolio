import knowledge from "@/content/knowledge.generated";

type Chunk = { title: string; text: string; core: boolean; tokens: Set<string>; list?: string[]; lower?: string };

const CORE = ["Tech index", "Profile", "Experience", "Education", "Skills", "Achievements", "Coding practice", "Outside work"];
const STOP = new Set("the a an and or of to in on for with is are was what who how does did his he timi about tell me can you have has do it that this which".split(" "));

const tokenize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9@.+#\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));

/** Split knowledge.md into ## sections; projects/papers/articles further by ###. */
function chunk(md: string): Chunk[] {
  const chunks: Chunk[] = [];
  for (const sec of md.split(/\n(?=## )/)) {
    const title = sec.match(/^## (.*)/)?.[1] ?? "Intro";
    const subs = sec.split(/\n(?=### )/);
    if (subs.length > 1) {
      for (const sub of subs.slice(1)) {
        chunks.push({ title: sub.split("\n")[0].replace(/^### /, "").slice(0, 80), text: sub, core: false, tokens: new Set(tokenize(sub)) });
      }
      chunks.push({ title, text: subs[0] + subs.slice(1).map((s) => "\n- " + s.split("\n")[0].replace(/^### /, "").slice(0, 120)).join(""), core: true, tokens: new Set() });
    } else {
      chunks.push({ title, text: sec, core: CORE.some((c) => title.startsWith(c)) || title === "Intro", tokens: new Set(tokenize(sec)) });
    }
  }
  return chunks;
}

const CHUNKS = chunk(knowledge).map((c) => ({ ...c, list: [...c.tokens], lower: c.title.toLowerCase() }));

/** Tiny lexical retriever: always include core profile, plus top-k matching detail chunks. */
export function retrieve(query: string, k = 4): string {
  const q = [...new Set(tokenize(query))];
  const scored = CHUNKS.filter((c) => !c.core)
    .map((c) => {
      let s = 0;
      for (const w of q) {
        if (c.tokens.has(w)) s += 2;
        else if (c.list!.some((t) => t.startsWith(w) || w.startsWith(t))) s += 0.5;
        if (c.lower!.includes(w)) s += 3;
      }
      return { c, s };
    })
    .sort((a, b) => b.s - a.s);
  const picked = scored.filter((x) => x.s > 0).slice(0, k).map((x) => x.c);
  // Default to the featured work when nothing matches.
  const fallback = picked.length ? picked : CHUNKS.filter((c) => !c.core).slice(0, 3);
  return [...CHUNKS.filter((c) => c.core), ...fallback].map((c) => c.text.trim()).join("\n\n");
}

export const fullKnowledge = knowledge;
