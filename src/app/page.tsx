import { Suspense } from "react";
import { Hero } from "@/components/hero";
import { TechMarquee } from "@/components/tech-marquee";
import { Certificates } from "@/components/certificates";
import { Projects } from "@/components/projects";
import { Timeline } from "@/components/timeline";
import { Education } from "@/components/education";
import { Skills } from "@/components/skills";
import { Contributions } from "@/components/contributions";
import { SectionHeading } from "@/components/section-heading";
import { getContributions } from "@/lib/contributions";

// Static at build, refreshed hourly (ISR). Cache Components is off: it hangs on the Workers runtime.
export const revalidate = 3600;

async function ContributionsSection() {
  const sets = await getContributions();
  return <Contributions sets={sets} />;
}

export default function Home() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <section className="scroll-mt-24 pt-12 pb-20" id="projects">
        <SectionHeading index="01" kicker="Projects" title="Things I've built" />
        <Projects />
      </section>
      <section className="py-20" id="experience">
        <SectionHeading index="02" kicker="Experience" title="Where I've worked" />
        <Timeline />
      </section>
      <section className="py-20" id="education">
        <SectionHeading index="03" kicker="Education & awards" title="Foundations in mathematics" />
        <Education />
      </section>
      <section className="py-20" id="certificates">
        <SectionHeading index="04" kicker="Certificates" title="Verified credentials" />
        <Certificates />
      </section>
      <section className="py-20" id="skills">
        <SectionHeading index="05" kicker="Skills" title="Toolbox" />
        <Skills />
      </section>
      <section className="py-20" id="contributions">
        <SectionHeading index="06" kicker="Contributions" title="Shipping, solving, practising" />
        <Suspense fallback={<div className="h-[340px] animate-pulse rounded-2xl border border-line bg-surface" />}>
          <ContributionsSection />
        </Suspense>
      </section>
    </>
  );
}
