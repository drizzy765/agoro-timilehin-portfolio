import { Fragment, type ReactNode } from "react";

/** Minimal, safe markdown: paragraphs, "- " bullets, **bold**, `code`, [links](url). */
export function MarkdownLite({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <div className="space-y-2.5">
      {blocks.map((b, i) => {
        const lines = b.split("\n");
        if (lines.every((l) => /^\s*[-*•]\s+/.test(l) || !l.trim())) {
          return (
            <ul key={i} className="space-y-1">
              {lines.filter((l) => l.trim()).map((l, j) => (
                <li key={j} className="flex gap-2">
                  <span className="mt-[9px] size-1 shrink-0 rounded-full bg-lime" />
                  <span>{inline(l.replace(/^\s*[-*•]\s+/, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function inline(s: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\((https?:\/\/[^)\s]+|mailto:[^)\s]+)\)|https?:\/\/[^\s)]+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push(s.slice(last, m.index));
    const t = m[0];
    if (t.startsWith("**")) out.push(<strong key={k++} className="font-semibold text-foreground">{t.slice(2, -2)}</strong>);
    else if (t.startsWith("`")) out.push(<code key={k++} className="rounded bg-white/10 px-1 font-mono text-[0.85em]">{t.slice(1, -1)}</code>);
    else {
      const label = t.startsWith("[") ? t.slice(1, t.indexOf("]")) : t;
      const href = t.startsWith("[") ? m[2] : t;
      out.push(
        <a key={k++} href={href} target="_blank" rel="noreferrer" className="text-cyan underline decoration-cyan/30 underline-offset-2 hover:decoration-cyan">
          {label}
        </a>
      );
    }
    last = m.index + t.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}
