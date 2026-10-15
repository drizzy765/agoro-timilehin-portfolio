"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { SpotifyIcon } from "./brand-icons";

type Spotify = { song: string; artist: string; album: string; album_art_url: string; track_id: string; timestamps: { start: number; end: number } };

/** Live "Now playing" from Discord via Lanyard. Renders nothing if no ID, not monitored, offline or not listening. */
export function LanyardCard() {
  const [spotify, setSpotify] = useState<Spotify | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const id = site.discordId;
    if (!id) return;
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch(`https://api.lanyard.rest/v1/users/${id}`, { cache: "no-store" });
        const j = await r.json();
        if (alive) setSpotify(j?.success && j.data?.listening_to_spotify ? j.data.spotify : null);
      } catch {
        if (alive) setSpotify(null);
      }
    };
    load();
    const poll = setInterval(load, 20000);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      alive = false;
      clearInterval(poll);
      clearInterval(tick);
    };
  }, []);

  const pct = spotify ? Math.min(100, ((now - spotify.timestamps.start) / (spotify.timestamps.end - spotify.timestamps.start)) * 100) : 0;

  return (
    <AnimatePresence>
      {spotify && (
        <motion.a
          href={`https://open.spotify.com/track/${spotify.track_id}`}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition hover:border-lime/40"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={spotify.album_art_url} alt={spotify.album} width={64} height={64} className="size-16 rounded-lg" />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-lime uppercase">
              <SpotifyIcon className="size-3.5" />
              Now playing
              <span className="ml-1 flex items-end gap-[2px]" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-[3px] animate-pulse rounded-sm bg-lime" style={{ height: 6 + i * 3, animationDelay: `${i * 150}ms` }} />
                ))}
              </span>
            </p>
            <p className="mt-1 truncate font-medium">{spotify.song}</p>
            <p className="truncate text-sm text-subtle">{spotify.artist}</p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-lime" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
