import { DM_Sans, Geist, Geist_Mono, IBM_Plex_Mono, Instrument_Serif, Inter, JetBrains_Mono, Manrope, Playfair_Display, Space_Grotesk, Space_Mono, Syne } from "next/font/google";

// Geist (old default) is now opt-in via ?font=geist
export const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], preload: false, display: "swap" });
export const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], preload: false, display: "swap" });

// Preview pairings: not preloaded, files only download when a data-font preview uses them
const instrumentSerif = Instrument_Serif({ subsets: ["latin"], preload: false, display: "swap", weight: "400", style: ["normal", "italic"], variable: "--font-instrument-serif" });
const inter = Inter({ subsets: ["latin"], preload: true, display: "swap", variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], preload: false, display: "swap", variable: "--font-jetbrains-mono" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], preload: true, display: "swap", variable: "--font-space-grotesk" });
const spaceMono = Space_Mono({ subsets: ["latin"], preload: true, display: "swap", weight: ["400", "700"], variable: "--font-space-mono" });
const playfair = Playfair_Display({ subsets: ["latin"], preload: false, display: "swap", variable: "--font-playfair" });
const manrope = Manrope({ subsets: ["latin"], preload: false, display: "swap", variable: "--font-manrope" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], preload: false, display: "swap", weight: ["400", "500", "600"], variable: "--font-plex-mono" });
const syne = Syne({ subsets: ["latin"], preload: false, display: "swap", variable: "--font-syne" });
const dmSans = DM_Sans({ subsets: ["latin"], preload: false, display: "swap", variable: "--font-dm-sans" });

export const fontVariables = [geistSans, geistMono, instrumentSerif, inter, jetbrainsMono, spaceGrotesk, spaceMono, playfair, manrope, plexMono, syne, dmSans]
  .map((f) => f.variable)
  .join(" ");

export const THEMES = ["mono-red", "lime", "midnight-gold", "ember", "aurora"] as const; // first = default
export const FONTS = ["grotesk", "geist", "editorial", "luxe", "futurist"] as const; // first = default

/** Runs before paint: ?theme=X&font=Y (or the session's last preview) sets data-theme / data-font. Default (no attribute) is mono-red + grotesk. */
export const themeBootScript = `(function(){try{var T=${JSON.stringify(THEMES)},F=${JSON.stringify(FONTS)},q=new URLSearchParams(location.search),s=sessionStorage,d=document.documentElement;
var t=q.get("theme")||s.getItem("pv-theme"),f=q.get("font")||s.getItem("pv-font");
if(t&&T.indexOf(t)>0){d.setAttribute("data-theme",t);s.setItem("pv-theme",t)}else if(t){d.removeAttribute("data-theme");s.removeItem("pv-theme")}
if(f&&F.indexOf(f)>0){d.setAttribute("data-font",f);s.setItem("pv-font",f)}else if(f){d.removeAttribute("data-font");s.removeItem("pv-font")}}catch(e){}})();`;
