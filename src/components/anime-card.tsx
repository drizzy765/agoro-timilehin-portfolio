import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { anime } from "@/content/site";

type Anime = (typeof anime)[number];

/** Poster card in the hobbies style: cover, title, meta; lifts on hover, links to MyAnimeList. */
export function AnimeCard({ a, priority = false }: { a: Anime; priority?: boolean }) {
  return (
    <a
      href={a.mal}
      target="_blank"
      rel="noreferrer"
      aria-label={`${a.title} on MyAnimeList`}
      className="group glow-card shine flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition duration-300 ease-out hover:-translate-y-1 hover:border-lime/40 hover:shadow-[0_18px_40px_-18px_color-mix(in_srgb,var(--c-accent)_45%,transparent)] focus-visible:ring-2 focus-visible:ring-lime/60 focus-visible:outline-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative aspect-[2/3] overflow-hidden border-b border-line bg-deep">
        <Image
          src={a.img}
          alt={`${a.title} cover art`}
          fill
          priority={priority}
          sizes="(min-width:1024px) 240px, (min-width:640px) 45vw, 45vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <span className="absolute top-2.5 right-2.5 grid size-8 place-items-center rounded-full border border-white/15 bg-black/55 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 group-focus-visible:opacity-100">
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="leading-snug font-semibold tracking-tight">{a.title}</h3>
        <p className="font-mono text-[11px] text-subtle">{a.sub}</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {a.genres.map((g) => (
            <span key={g} className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-subtle">
              {g}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
