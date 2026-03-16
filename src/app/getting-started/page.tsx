import fs from "fs";
import path from "path";
import GuideContent from "../guide/GuideContent";

export const metadata = {
  title: "Getting Started with nAIVE — AI-Native Game Engine",
  description:
    "Install nAIVE, create your first project, and build a game with YAML scenes, Lua scripting, and AI-powered tools. A hands-on tutorial from zero to running game.",
  alternates: {
    canonical: "/getting-started",
  },
  openGraph: {
    title: "Getting Started with nAIVE — AI-Native Game Engine",
    description:
      "Install nAIVE, create your first project, and build a game with YAML, Lua, and AI.",
    url: "https://gameagent.dev/getting-started",
  },
};

const chapters = [
  { id: "chapter-1", label: "01", title: "What Is nAIVE?" },
  { id: "chapter-2", label: "02", title: "Installation" },
  { id: "chapter-3", label: "03", title: "Your First Project" },
  { id: "chapter-4", label: "04", title: "Understanding Scenes" },
  { id: "chapter-5", label: "05", title: "Lua Scripting" },
  { id: "chapter-6", label: "06", title: "Materials & Shaders" },
  { id: "chapter-7", label: "07", title: "Input Bindings" },
  { id: "chapter-8", label: "08", title: "AI Agent Integration" },
  { id: "chapter-9", label: "09", title: "Testing & Debugging" },
  { id: "chapter-10", label: "10", title: "Next Steps" },
];

export default function GettingStartedPage() {
  const mdPath = path.join(process.cwd(), "src/content/getting-started.md");
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
          <div className="flex items-center gap-6">
            <a
              href="/guide"
              className="text-sm text-white/40 hover:text-accent transition-colors font-mono hidden sm:block"
            >
              Dufus Guide
            </a>
            <span className="font-mono text-xs text-accent/60 hidden sm:block">
              nAIVE — Getting Started
            </span>
          </div>
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
                  {ch.label.padStart(2, "\u00A0")}
                </span>
                {ch.title}
              </a>
            ))}
          </nav>

          {/* Quick install */}
          <div className="mt-8 p-3 bg-surface-light border border-surface-border rounded-lg">
            <div className="font-mono text-xs text-accent/50 mb-2">
              // quick-install
            </div>
            <code className="text-xs text-white/60 font-mono">
              brew install poro/tap/naive
            </code>
          </div>
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
                      {ch.label.padStart(2, "\u00A0")}
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
                // getting-started
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                Getting Started with{" "}
                <span className="text-accent glow">nAIVE</span>
              </h1>
              <p className="text-white/40 text-lg mb-6">
                Install the engine, create a project, and build your first game
                — all with YAML, Lua, and AI.
              </p>
              {/* Quick start terminal */}
              <div className="bg-surface-light border border-surface-border rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-black/50 border-b border-surface-border">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  <span className="ml-2 text-xs text-white/30 font-mono">
                    ~/terminal
                  </span>
                </div>
                <div className="p-4 font-mono text-sm space-y-1">
                  <div>
                    <span className="text-accent">$</span>{" "}
                    <span className="text-white/80">
                      brew install poro/tap/naive
                    </span>
                  </div>
                  <div>
                    <span className="text-accent">$</span>{" "}
                    <span className="text-white/80">naive init my-game</span>
                  </div>
                  <div>
                    <span className="text-accent">$</span>{" "}
                    <span className="text-white/80">cd my-game && naive run</span>
                  </div>
                  <div className="text-white/40">
                    Engine started. Window open.{" "}
                    <span className="text-accent">Ready to play.</span>
                  </div>
                </div>
              </div>
            </div>
            <GuideContent markdown={markdown} />
          </article>
        </div>
      </div>
    </main>
  );
}
