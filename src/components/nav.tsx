"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { BookOpen, Home, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/writing", label: "Writing", icon: BookOpen },
  { href: "/about", label: "About", icon: User },
];

function useActive() {
  const path = usePathname() ?? "/";
  return (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
}

export function Nav() {
  const isActive = useActive();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-3 pt-3 sm:pt-4">
        <nav
          aria-label="Primary"
          className={cn(
            "flex w-full max-w-5xl items-center justify-between rounded-2xl border px-3 py-2 transition-all duration-300 sm:px-4",
            scrolled
              ? "border-line bg-background/75 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl"
              : "border-transparent bg-transparent"
          )}
        >
          <Link href="/" className="group flex min-h-11 items-center gap-2 rounded-lg font-mono text-sm focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-none">
            <span className="grid size-7 place-items-center rounded-lg border border-line bg-surface text-[11px] font-semibold text-lime transition-colors group-hover:border-lime/50">
              AT
            </span>
            <span className="text-subtle">
              ~/<span className="text-foreground">timi</span>
            </span>
          </Link>

          <ul className="relative hidden items-center gap-1 sm:flex">
            {tabs.map((t) => {
              const active = isActive(t.href);
              return (
                <li key={t.href}>
                  <Link
                    href={t.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex min-h-11 items-center px-4 text-sm transition-colors rounded-lg focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-none",
                      active ? "text-foreground" : "text-subtle hover:text-foreground"
                    )}
                  >
                    {t.label}
                    {active && (
                      <motion.span
                        layoutId="tab-underline"
                        className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-lime shadow-[0_0_12px_color-mix(in_srgb,var(--c-accent)_60%,transparent)]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <a
            href="#contact"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-lime px-4 text-sm font-medium text-on-accent transition hover:shadow-[0_0_24px_color-mix(in_srgb,var(--c-accent)_45%,transparent)] active:scale-[0.98]"
          >
            <Mail className="size-4" />
            Contact
          </a>
        </nav>
      </header>

      {/* Mobile bottom dock */}
      <nav
        aria-label="Primary mobile"
        className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(env(safe-area-inset-bottom),12px)] sm:hidden"
      >
        <ul className="flex items-center gap-1 rounded-2xl border border-line bg-surface/85 p-1.5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {tabs.map((t) => {
            const active = isActive(t.href);
            const Icon = t.icon;
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  aria-current={active ? "page" : undefined}
                  className={cn("relative flex min-h-12 min-w-16 flex-col items-center justify-center gap-0.5 rounded-xl px-5 text-[11px] focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-none", active ? "text-foreground" : "text-subtle")}
                >
                  {active && (
                    <motion.span layoutId="dock-active" className="absolute inset-0 rounded-xl bg-white/[0.06]" transition={{ type: "spring", stiffness: 420, damping: 34 }} />
                  )}
                  <Icon className={cn("relative size-[18px]", active && "text-lime")} />
                  <span className="relative">{t.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
