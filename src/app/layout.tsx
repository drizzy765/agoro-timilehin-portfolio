import type { Metadata, Viewport } from "next";
import { fontVariables, themeBootScript } from "@/lib/fonts";
import "react-activity-calendar/tooltips.css";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ChatPanel } from "@/components/chat/chat-panel";
import { MotionProvider } from "@/components/motion-provider";


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Agoro Oluwatimilehin (Timi) · ML Engineer, Lagos", template: "%s · Timi Agoro" },
  description:
    "Timi Agoro is an ML Engineer in Lagos building speech, LLM, retrieval and forecasting systems for emerging markets. Projects, research papers, writing and an AI agent you can ask about his work.",
  openGraph: {
    title: "Agoro Oluwatimilehin (Timi) · ML Engineer",
    description: "Speech, LLM and forecasting systems for emerging markets.",
    images: ["/img/timi-square.jpg"],
    type: "website",
  },
  twitter: { card: "summary", creator: "@timilovesml1234" },
};

export const viewport: Viewport = { themeColor: "#000000", colorScheme: "dark" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="relative min-h-svh overflow-x-hidden">
        <div aria-hidden className="dot-grid pointer-events-none fixed inset-0 -z-10" />
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-lg focus:bg-lime focus:px-3 focus:py-2 focus:text-on-accent">
          Skip to content
        </a>
        <MotionProvider>
        <Nav />
        <main id="main" className="mx-auto max-w-5xl px-4 sm:px-6">
          {children}
        </main>
        <Footer />
        <ChatPanel />
        </MotionProvider>
      </body>
    </html>
  );
}
