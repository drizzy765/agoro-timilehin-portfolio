import { Mail } from "lucide-react";
import { site } from "@/content/site";
import { GitHubIcon, LinkedInIcon, MediumIcon, XIcon } from "./brand-icons";
import { CopyEmail } from "./copy-email";

const links = [
  { href: site.github, label: "GitHub", sub: "drizzy765", Icon: GitHubIcon },
  { href: site.linkedin, label: "LinkedIn", sub: "agoro-oluwatimilehin", Icon: LinkedInIcon },
  { href: site.x, label: "X", sub: site.xHandle, Icon: XIcon },
  { href: site.medium, label: "Medium", sub: "@agorotimilehin05", Icon: MediumIcon },
];

export function Footer() {
  return (
    <footer id="contact" className="relative mt-24 border-t border-line pb-28 sm:pb-12">
      <div className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p className="font-mono text-xs tracking-wider text-lime uppercase">Contact</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Let&apos;s build something that works in the real world.</h2>
            <p className="mt-3 max-w-md text-subtle">Roles, collaborations, research or a chat about ML in emerging markets. My inbox is open.</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 rounded-xl bg-lime px-5 py-3 text-sm font-semibold text-on-accent transition hover:shadow-[0_0_32px_color-mix(in_srgb,var(--c-accent)_45%,transparent)]">
                <Mail className="size-4" /> {site.email}
              </a>
              <CopyEmail email={site.email} />
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-2">
            {links.map(({ href, label, sub, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noreferrer" className="group flex items-center gap-3 rounded-xl border border-line bg-surface p-3 transition hover:border-cyan/40">
                  <Icon className="size-5 text-subtle transition group-hover:text-cyan" />
                  <span className="min-w-0">
                    <span className="block text-sm">{label}</span>
                    <span className="block truncate font-mono text-[11px] text-subtle">{sub}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 font-mono text-xs text-subtle sm:flex-row sm:justify-between">
          <p>© 2026 Agoro Oluwatimilehin · Lagos, Nigeria</p>
          <p>
            Built with Next.js, R3F &amp; <span className="text-lime">care</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
