import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DemoClient from "./DemoClient";

export const metadata: Metadata = {
  title: "Interactive Demo — nAIVE Game Engine | Game Agent",
  description:
    "Try the nAIVE game engine: describe a game in plain English and watch it generate in real-time. Space shooters, platformers, breakout — all from natural language.",
  openGraph: {
    title: "nAIVE Interactive Demo — Generate Games from Text",
    description: "Describe a game. Watch it generate. Play it instantly.",
    url: "https://gameagent.dev/demo",
  },
};

export default function DemoPage() {
  return (
    <main className="relative scanline min-h-screen">
      <Nav />

      <section className="pt-28 sm:pt-36 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="font-mono text-accent/50 text-xs mb-2 tracking-widest">
            // interactive demo
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-accent">nAIVE</span> Engine Demo
          </h1>
          <p className="text-white/40 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Describe a game in natural language. The engine parses your prompt,
            detects the genre, and generates a playable game — right in your browser.
          </p>
        </div>

        <DemoClient />

        {/* How it works */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-xl font-bold mb-6 text-center">
            How <span className="text-accent">nAIVE</span> Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: "💬",
                title: "Describe",
                desc: "Write what you want in plain English. No code needed.",
              },
              {
                icon: "⚡",
                title: "Generate",
                desc: "The engine analyzes your prompt and builds the game in seconds.",
              },
              {
                icon: "🎮",
                title: "Play",
                desc: "Your game runs instantly in the browser. Iterate and refine.",
              },
            ].map((step) => (
              <div
                key={step.title}
                className="bg-surface-light border border-surface-border rounded-lg p-5 text-center"
              >
                <div className="text-3xl mb-3">{step.icon}</div>
                <div className="font-mono text-accent text-sm font-bold mb-2">
                  {step.title}
                </div>
                <p className="text-white/40 text-xs leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/20 text-xs font-mono">
              This is a concept demo showcasing the nAIVE engine vision.
              <br />
              The full engine (coming soon) uses AI to generate arbitrary game logic from text.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
