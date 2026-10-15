"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {}
      }}
      className="inline-flex items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm text-subtle transition hover:text-foreground"
    >
      {done ? <Check className="size-4 text-lime" /> : <Copy className="size-4" />}
      {done ? "Copied" : "Copy email"}
    </button>
  );
}
