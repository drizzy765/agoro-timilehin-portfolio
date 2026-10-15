import { Reveal } from "./reveal";
import { HeadingRule } from "./heading-rule";

export function SectionHeading({ index, title, kicker, id }: { index: string; title: string; kicker?: string; id?: string }) {
  return (
    <Reveal className="mb-8 sm:mb-10">
      <div id={id} className="flex items-baseline gap-3 font-mono text-xs tracking-wider text-subtle uppercase">
        <span className="text-lime">{index}</span>
        <HeadingRule />
        <span>{kicker ?? title}</span>
      </div>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{title}</h2>
    </Reveal>
  );
}
