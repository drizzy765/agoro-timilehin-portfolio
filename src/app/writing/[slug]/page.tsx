import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import { writing } from "@/content/site";

const papers = writing.filter((w) => w.kind === "research");

export const dynamicParams = false;

export function generateStaticParams() {
  return papers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = papers.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function PaperPage({ params }: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const p = papers.find((x) => x.slug === slug);
  if (!p || !p.pdf) notFound();

  return (
    <div className="pt-28 pb-8 sm:pt-32">
      <Link href="/writing" className="inline-flex items-center gap-1.5 font-mono text-xs text-subtle hover:text-foreground">
        <ArrowLeft className="size-3.5" /> all writing
      </Link>
      <p className="mt-6 font-mono text-[11px] tracking-wide text-cyan uppercase">
        Research · {p.date} · {p.pages}pp
      </p>
      <h1 className="mt-2 text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-3xl">{p.title}</h1>
      <p className="mt-2 text-subtle">
        {p.authors} · {p.venue}
      </p>
      <p className="mt-4 max-w-3xl leading-relaxed text-foreground/85">{p.summary}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <a href={p.pdf} download className="inline-flex items-center gap-2 rounded-xl bg-lime px-4 py-2.5 text-sm font-medium text-on-accent">
          <Download className="size-4" /> Download PDF
        </a>
        <a href={p.pdf} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2.5 text-sm text-subtle hover:text-foreground">
          <ExternalLink className="size-4" /> Open in new tab
        </a>
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
        <object data={`${p.pdf}#view=FitH&toolbar=1`} type="application/pdf" className="block h-[80svh] min-h-[560px] w-full" aria-label={p.title}>
          <div className="grid h-[320px] place-items-center p-6 text-center text-subtle">
            <p>
              Your browser can&apos;t show PDFs inline.{" "}
              <a href={p.pdf} className="text-cyan underline">
                Download the paper
              </a>{" "}
              instead.
            </p>
          </div>
        </object>
      </div>
    </div>
  );
}
