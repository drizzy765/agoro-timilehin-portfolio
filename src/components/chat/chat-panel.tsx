"use client";

import { Chat, useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, Sparkles, Square } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { OPEN_CHAT_EVENT } from "../open-chat-button";
import { MarkdownLite } from "./markdown-lite";

const SUGGESTIONS = [
  "What has Timi built with LLMs?",
  "Tell me about SautiCivic",
  "What's his ML stack?",
  "Where has he worked?",
];

export function ChatPanel() {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState<Chat<UIMessage> | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  // Create the chat client lazily (first open) so nothing random runs at prerender.
  const openChat = useCallback((next = true) => {
    setOpen(next);
    if (next) setChat((c) => c ?? new Chat<UIMessage>({ id: "ask-timi", transport: new DefaultChatTransport({ api: process.env.NEXT_PUBLIC_CHAT_API || "/api/chat" }) }));
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      openChat();
      const prompt = (e as CustomEvent<{ prompt?: string }>).detail?.prompt;
      if (prompt) setPending(prompt);
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    const t = window.location.hash === "#ask" ? setTimeout(() => openChat(), 0) : undefined;
    return () => {
      window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
      clearTimeout(t);
    };
  }, [openChat]);

  return (
    <>
      <button
        type="button"
        onClick={() => openChat()}
        aria-label="Ask about Timi"
        className="group fixed right-4 bottom-24 z-40 inline-flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full border border-magenta/40 bg-surface/90 p-2.5 sm:py-2.5 sm:pr-4 sm:pl-3 text-sm font-medium shadow-[0_0_0_1px_color-mix(in_srgb,var(--c-glow)_8%,transparent),0_0_32px_color-mix(in_srgb,var(--c-glow)_28%,transparent)] backdrop-blur-xl transition hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--c-glow)_20%,transparent),0_0_44px_color-mix(in_srgb,var(--c-glow)_45%,transparent)] active:scale-[0.97] sm:right-6 sm:bottom-6"
      >
        <span aria-hidden className="fab-breathe pointer-events-none absolute inset-0 rounded-full border border-magenta/50" />
        <span className="relative grid size-7 place-items-center rounded-full bg-gradient-to-br from-magenta to-magenta/50 text-on-accent">
          <Sparkles className="size-4" />
          <span className="absolute inset-0 animate-ping rounded-full bg-magenta/30 motion-reduce:hidden [animation-duration:2.4s]" />
        </span>
        <span className="hidden sm:inline">Ask about Timi</span>
      </button>

      <Sheet open={open} onOpenChange={(o) => openChat(o)}>
        <SheetContent
          side="right"
          className="w-full gap-0 border-line bg-deep p-0 shadow-[-20px_0_80px_color-mix(in_srgb,var(--c-glow)_10%,transparent)] data-[side=right]:w-full data-[side=right]:sm:max-w-md"
        >
          <SheetHeader className="border-b border-line p-5">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-magenta/90 to-magenta/40 text-on-accent shadow-[0_0_24px_color-mix(in_srgb,var(--c-glow)_40%,transparent)]">
                <Sparkles className="size-4" />
              </span>
              <div>
                <SheetTitle className="text-base">Ask about Timi</SheetTitle>
                <SheetDescription className="font-mono text-[11px]">Answers grounded in his CV, projects &amp; papers</SheetDescription>
              </div>
            </div>
          </SheetHeader>
          {chat ? <ChatBody chat={chat} pending={pending} clearPending={() => setPending(null)} /> : <div className="flex-1" />}
        </SheetContent>
      </Sheet>
    </>
  );
}

function ChatBody({ chat, pending, clearPending }: { chat: Chat<UIMessage>; pending: string | null; clearPending: () => void }) {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status, stop, error } = useChat({ chat });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (pending) {
      sendMessage({ text: pending });
      clearPending();
    }
  }, [pending, sendMessage, clearPending]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    sendMessage({ text: t });
    setInput("");
  };

  return (
    <>
          <div className="flex-1 overflow-y-auto px-5 py-5">
            {messages.length === 0 ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-line bg-surface p-4 text-[15px] leading-relaxed text-foreground/90">
                  Hi 👋 I&apos;m Timi&apos;s portfolio agent. Ask me about his projects, research, experience or what he&apos;s into. I only answer from what&apos;s on record, so no made-up facts.
                </div>
                <div>
                  <p className="mb-2 font-mono text-[11px] tracking-wide text-subtle uppercase">Try asking</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-line px-3 py-1.5 text-left text-sm text-subtle transition hover:border-magenta/40 hover:text-foreground">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <ul className="space-y-4">
                {messages.map((m) => {
                  const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
                  return (
                    <li key={m.id} className={m.role === "user" ? "flex justify-end" : "flex"}>
                      <div
                        className={
                          m.role === "user"
                            ? "max-w-[85%] rounded-2xl rounded-br-md bg-lime px-4 py-2.5 text-[15px] text-on-accent"
                            : "max-w-[92%] rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-3 text-[15px] leading-relaxed text-foreground/90"
                        }
                      >
                        {m.role === "user" ? text : <MarkdownLite text={text || "…"} />}
                      </div>
                    </li>
                  );
                })}
                {status === "submitted" && (
                  <li className="flex">
                    <div className="flex gap-1 rounded-2xl rounded-bl-md border border-line bg-surface px-4 py-3.5" aria-label="Thinking">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="size-1.5 animate-bounce rounded-full bg-magenta" style={{ animationDelay: `${i * 120}ms` }} />
                      ))}
                    </div>
                  </li>
                )}
                {error && <li className="rounded-xl border border-line bg-surface p-3 text-sm text-subtle">Couldn&apos;t reach the agent. Try again in a moment, or email agorotimilehin05@gmail.com.</li>}
              </ul>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-line p-4"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-line bg-surface p-2 focus-within:border-magenta/40 focus-within:shadow-[0_0_24px_color-mix(in_srgb,var(--c-glow)_12%,transparent)]">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                maxLength={600}
                placeholder="Ask anything about Timi…"
                aria-label="Message"
                className="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-2 py-1.5 text-[15px] outline-none placeholder:text-subtle/70"
              />
              {busy ? (
                <button type="button" onClick={() => stop()} aria-label="Stop" className="grid size-9 place-items-center rounded-xl border border-line text-subtle hover:text-foreground">
                  <Square className="size-3.5" />
                </button>
              ) : (
                <button type="submit" disabled={!input.trim()} aria-label="Send" className="grid size-9 place-items-center rounded-xl bg-lime text-on-accent transition disabled:opacity-30">
                  <ArrowUp className="size-4" />
                </button>
              )}
            </div>
            <p className="mt-2 text-center font-mono text-[10.5px] text-subtle/70">AI can be wrong. For anything important, email Timi.</p>
          </form>
    </>
  );
}
