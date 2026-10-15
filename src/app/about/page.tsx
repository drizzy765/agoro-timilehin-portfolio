import type { Metadata } from "next";
import Image from "next/image";
import { anime, hobbies, site } from "@/content/site";
import { AnimeCard } from "@/components/anime-card";
import { Reveal } from "@/components/reveal";
import { LanyardCard } from "@/components/lanyard-card";
import { SpotifyIcon } from "@/components/brand-icons";
import { HobbyCard } from "@/components/hobby-card";

export const metadata: Metadata = { title: "About", description: "The person behind the models: Timi's story, music, football, chess and anime." };

export default function AboutPage() {
  return (
    <div className="pt-32 pb-8 sm:pt-36">
      <div className="grid gap-10 md:grid-cols-[1fr_280px] md:items-start">
        <Reveal>
          <p className="font-mono text-xs tracking-wider text-lime uppercase">About</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">From proofs to production.</h1>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-foreground/85">
            <p>
              I&apos;m Timi, an ML engineer in Lagos. Mathematics at Lagos State University taught me to love linear algebra, stochastic processes and the
              discipline of proving things, so I build ML the same way: careful evaluation, honest baselines and systems that hold up outside the notebook.
            </p>
            <p>
              Most of my work sits where AI meets everyday Nigerian life: speech models that understand code-switched Pidgin, recommenders that speak Yoruba and
              Hausa, credit scoring for SMEs and forecasts for the price of rice and diesel. I care about the people on the other side of the model, which is why
              so much of it comes with abstention gates, audits and safety checks.
            </p>
            <p className="text-subtle">
              I recently completed an AI/ML engineering internship at Flyrank AI, and I run operations for the AWS Student Builder Group at LASU, a 300+ member cloud
              community.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="mx-auto w-full max-w-[280px]">
          <div className="relative">
            <div aria-hidden className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-lime/25 via-transparent to-cyan/25 blur-xl" />
            <Image src="/img/timi.webp" alt="Timi" width={810} height={1080} sizes="280px" className="relative rounded-3xl border border-line object-cover" />
          </div>
        </Reveal>
      </div>

      <section className="mt-20">
        <Reveal>
          <p className="font-mono text-xs tracking-wider text-subtle uppercase">
            <span className="text-lime">01</span> Off the clock
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">What I&apos;m into</h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hobbies.map((h, i) => (
            <Reveal key={h.title} delay={i * 0.05}>
              <HobbyCard {...h} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-20" id="anime">
        <Reveal>
          <p className="font-mono text-xs tracking-wider text-subtle uppercase">
            <span className="text-lime">02</span> Watchlist
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Favourite anime</h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {anime.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.06} className="h-full">
              <AnimeCard a={a} />
            </Reveal>
          ))}
        </div>
        <p className="mt-4 font-mono text-[11px] text-subtle/80">
          Cover art via{" "}
          <a href="https://anilist.co" target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-2 hover:text-foreground">
            AniList
          </a>{" "}
          · links to{" "}
          <a href="https://myanimelist.net" target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-2 hover:text-foreground">
            MyAnimeList
          </a>
          . Artwork © respective studios and publishers.
        </p>
      </section>

      <section className="mt-20">
        <Reveal>
          <p className="font-mono text-xs tracking-wider text-subtle uppercase">
            <span className="text-lime">03</span> Soundtrack
          </p>
          <h2 className="mt-3 flex items-center gap-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            <SpotifyIcon className="size-6 text-lime" /> On repeat
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px]">
          <Reveal>
            <iframe
              title="Timi's Spotify playlist"
              src={site.spotifyEmbed}
              width="100%"
              height="352"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="rounded-2xl border border-line bg-surface"
            />
          </Reveal>
          <div className="space-y-4">
            <LanyardCard />
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-line bg-surface p-5">
                <p className="font-mono text-[11px] tracking-wide text-subtle uppercase">Current rotation</p>
                <p className="mt-2 text-lg font-medium">Drake, always Drake.</p>
                <p className="mt-1 text-sm text-subtle">When Spotify is playing on my Discord, a live &quot;now playing&quot; card shows up here.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
