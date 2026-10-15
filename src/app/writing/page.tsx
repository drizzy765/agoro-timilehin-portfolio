import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { WritingList } from "@/components/writing-list";

export const metadata: Metadata = { title: "Writing", description: "Research papers and articles by Timi Agoro." };

export default function WritingPage() {
  return (
    <div className="pt-32 pb-8 sm:pt-36">
      <Reveal>
        <p className="font-mono text-xs tracking-wider text-lime uppercase">Writing</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Research &amp; articles</h1>
        <p className="mt-4 max-w-2xl text-lg text-subtle">Benchmarks, technical reports and long-form posts. Papers open right here in the browser.</p>
      </Reveal>
      <div className="mt-10">
        <WritingList />
      </div>
    </div>
  );
}
