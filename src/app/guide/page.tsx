import fs from "fs";
import path from "path";
import GuideContent from "./GuideContent";

export const metadata = {
  title: "The Dufus Guide — How to Set Up Your Own AI Agent",
  description:
    "A complete, practical guide to setting up your own autonomous AI agent. Real examples, real code, no fluff.",
};

const chapters = [
  { id: "chapter-1", num: 1, title: "What Is a Dufus?" },
  { id: "chapter-2", num: 2, title: "Setting Up Your Dufus" },
  { id: "chapter-3", num: 3, title: "The Memory System" },
  { id: "chapter-4", num: 4, title: "Giving Dufus Context" },
  { id: "chapter-5", num: 5, title: "Skills — Teaching Dufus New Tricks" },
  { id: "chapter-6", num: 6, title: "The Soul File" },
  { id: "chapter-7", num: 7, title: "Heartbeats — Being Proactive" },
  { id: "chapter-8", num: 8, title: "Cron Jobs — Dufus on Autopilot" },
  { id: "chapter-9", num: 9, title: "The Money Machine" },
  { id: "chapter-10", num: 10, title: "The Agent Army" },
  { id: "chapter-11", num: 11, title: "Advanced Dufus Patterns" },
  { id: "chapter-12", num: 12, title: "Dufus Mistakes (And How to Fix Them)" },
  { id: "chapter-13", num: 13, title: "Growing Together" },
];

export default function GuidePage() {
  const mdPath = path.join(process.cwd(), "src/content/guide.md");
  const markdown = fs.readFileSync(mdPath, "utf-8");

  return (
    <main className="relative bg-black min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a
            href="/"
            className="font-mono text-accent font-bold text-lg tracking-wider"
          >
            <span className="text-white/60">{">"}</span> GAME_AGENT
          </a>
          <span className="font-mono text-xs text-white/40 hidden sm:block">
            The Dufus Guide
          </span>
        </div>
      </header>

      <div className="pt-16 flex">
        {/* Sidebar — desktop only */}
        <aside className="hidden lg:block fixed top-16 left-0 w-72 h-[calc(100vh-4rem)] overflow-y-auto border-r border-surface-border bg-black/60 backdrop-blur-sm p-6">
          <div className="font-mono text-accent/50 text-xs mb-4">
            // table-of-contents
          </div>
          <nav className="flex flex-col gap-1">
            {chapters.map((ch) => (
              <a
                key={ch.id}
                href={`#${ch.id}`}
                className="text-sm text-white/50 hover:text-accent transition-colors font-mono py-1.5 px-2 rounded hover:bg-surface-light"
              >
                <span className="text-accent/40 mr-2">
                  {String(ch.num).padStart(2, "0")}
                </span>
                {ch.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="w-full lg:ml-72">
          {/* Mobile TOC */}
          <div className="lg:hidden border-b border-surface-border bg-surface/80 backdrop-blur-sm">
            <details className="group">
              <summary className="px-4 py-3 font-mono text-sm text-white/60 cursor-pointer hover:text-accent transition-colors flex items-center gap-2">
                <svg
                  className="w-4 h-4 transition-transform group-open:rotate-90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
                Chapters
              </summary>
              <nav className="px-4 pb-4 flex flex-col gap-1">
                {chapters.map((ch) => (
                  <a
                    key={ch.id}
                    href={`#${ch.id}`}
                    className="text-sm text-white/50 hover:text-accent transition-colors font-mono py-1.5 px-2 rounded hover:bg-surface-light"
                  >
                    <span className="text-accent/40 mr-2">
                      {String(ch.num).padStart(2, "0")}
                    </span>
                    {ch.title}
                  </a>
                ))}
              </nav>
            </details>
          </div>

          {/* Article */}
          <article className="max-w-3xl mx-auto px-4 sm:px-8 py-12 pb-24">
            <div className="mb-12">
              <div className="font-mono text-accent/50 text-xs mb-3">
                // the-complete-guide
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                How to Set Up Your Own{" "}
                <span className="text-accent glow">Dufus</span>
              </h1>
              <p className="text-white/40 text-lg">
                A practical guide to building your own autonomous AI agent.
                Real examples, real code, no fluff.
              </p>
            </div>
            <GuideContent markdown={markdown} />
          </article>
        </div>
      </div>
    </main>
  );
}
