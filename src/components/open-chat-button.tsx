"use client";

import type { ReactNode } from "react";

export const OPEN_CHAT_EVENT = "timi:open-chat";

export function OpenChatButton({ children, className, prompt }: { children: ReactNode; className?: string; prompt?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT, { detail: { prompt } }))}>
      {children}
    </button>
  );
}
