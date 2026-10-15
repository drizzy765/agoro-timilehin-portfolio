import Image from "next/image";
import { ArrowDown, MapPin, Sparkles } from "lucide-react";
import { site } from "@/content/site";
import { DecryptedText } from "./decrypted-text";
import { HeroSphere } from "./hero-sphere";
import { OpenChatButton } from "./open-chat-button";
import { Reveal } from "./reveal";
import { GitHubIcon, LinkedInIcon, MediumIcon, XIcon } from "./brand-icons";

export function Hero() {
  return (
    <section className="relative grid min-h-[calc(100svh-2rem)] items-center gap-6 pt-28 pb-16 sm:pt-32 lg:grid-cols-[1.1fr_1fr] lg:gap-4">
      {/* soft spotlight */}
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[min(820px,100vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--c-accent)_7%,transparent),transparent)]" />

      <div className="relative z-10">
        <Reveal>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div aria-hidden className="absolute -inset-1 rounded-[22px] bg-gradient-to-br from-lime/50 via-transparent to-cyan/40 opacity-70 blur-[6px]" />
              <Image
                src="/img/timi.webp"
                alt="Portrait of Agoro Oluwatimilehin (Timi)"
                width={810}
                height={1080}
                priority
                sizes="(min-width: 640px) 128px, 104px"
                className="relative h-[132px] w-[104px] rounded-[20px] border border-line object-cover object-[50%_42%] sm:h-[160px] sm:w-[128px]"
              />
            </div>
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1 font-mono text-[11px] text-subtle">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-lime opacity-60 motion-reduce:hidden" />
                  <span className="relative inline-flex size-2 rounded-full bg-lime" />
                </span>
                AI/ML Engineer
              </span>
              <p className="flex items-center gap-1.5 font-mono text-xs text-subtle">
                <MapPin className="size-3.5 text-cyan" /> Lagos, Nigeria
              </p>
            </div>
          </div>
        </Reveal>

        <p className="mt-8 font-mono text-sm text-cyan">
          <span className="text-subtle">&gt;</span> <DecryptedText text="hello, i'm timi" delay={150} />
          <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-lime/80" />
        </p>
        <h1 className="mt-3 text-[2.6rem] leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl lg:text-[4.2rem]">
          <DecryptedText text={site.name} delay={450} speed={32} />
        </h1>
        <Reveal delay={0.25}>
          <p className="mt-4 font-mono text-base text-foreground/90 sm:text-lg">
            {site.role} <span className="text-lime">·</span> {site.location}
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-subtle sm:text-lg">{site.intro}</p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 min-h-12 rounded-xl bg-lime px-5 text-sm font-semibold text-on-accent transition hover:shadow-[0_0_32px_color-mix(in_srgb,var(--c-accent)_45%,transparent)] active:scale-[0.98]"
            >
              View Projects
              <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
            </a>
            <OpenChatButton className="group inline-flex items-center gap-2 min-h-12 rounded-xl border border-line bg-surface px-5 text-sm font-medium transition hover:border-magenta/50 hover:shadow-[0_0_28px_color-mix(in_srgb,var(--c-glow)_18%,transparent)] active:scale-[0.98]">
              <Sparkles className="size-4 text-magenta" />
              Ask my Agent
            </OpenChatButton>
          </div>
          <div className="mt-8 flex items-center gap-1 text-subtle">
            {[
              { href: site.github, label: "GitHub", Icon: GitHubIcon },
              { href: site.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
              { href: site.x, label: "X", Icon: XIcon },
              { href: site.medium, label: "Medium", Icon: MediumIcon },
            ].map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="rounded-lg p-2 transition hover:bg-white/5 hover:text-foreground">
                <Icon className="size-[18px]" />
              </a>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[420px] lg:max-w-[540px]">
        <HeroSphere />
      </div>
    </section>
  );
}
