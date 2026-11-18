import { FileDown } from "lucide-react";
import { resumeHref } from "@/content/site";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  label?: string;
};

export function ResumeLink({ className, label = "Resume" }: Props) {
  return (
    <a
      href={resumeHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Open resume PDF in a new tab"
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-line bg-surface text-sm font-medium transition hover:border-cyan/50 hover:shadow-[0_0_28px_color-mix(in_srgb,var(--c-cyan)_18%,transparent)] active:scale-[0.98]",
        className,
      )}
    >
      <FileDown className="size-4" />
      {label}
    </a>
  );
}
