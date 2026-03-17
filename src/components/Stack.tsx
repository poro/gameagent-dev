const stack = [
  { name: "Claude", category: "AI", desc: "Primary LLM — powers Dufus and all AI features" },
  { name: "OpenClaw", category: "Agent", desc: "Agent framework — always-on AI assistant" },
  { name: "Cursor", category: "Editor", desc: "AI-native code editor for pair programming" },
  { name: "Next.js", category: "Framework", desc: "React framework for all web apps" },
  { name: "Vercel", category: "Deploy", desc: "Edge deployment and hosting" },
  { name: "Supabase", category: "Backend", desc: "Postgres + Auth + Realtime + Storage" },
  { name: "CesiumJS", category: "3D", desc: "Globe visualization for WorldView" },
  { name: "Tailwind", category: "CSS", desc: "Utility-first styling across all projects" },
  { name: "TypeScript", category: "Language", desc: "Type safety everywhere" },
  { name: "Python", category: "Language", desc: "Trading systems and data pipelines" },
  { name: "Cloudflare", category: "Infra", desc: "DNS, tunnels, and edge network" },
  { name: "GitHub", category: "Code", desc: "Source control and CI/CD" },
];

export default function Stack() {
  return (
    <section id="stack" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="font-mono text-accent/50 text-xs mb-2">// stack</div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
          The <span className="text-accent-blue glow-blue">Stack</span>
        </h2>
        <p className="text-sm sm:text-base text-white/40 mb-8 sm:mb-12 max-w-xl">
          Tools and technologies powering the Game Agent ecosystem.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
          {stack.map((s) => (
            <div key={s.name} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-surface-border/50 hover:border-accent-blue/30 transition-colors bg-surface-light/30 active:bg-surface-light/50">
              <div className="font-mono text-[10px] text-accent-blue/60 bg-accent-blue/5 border border-accent-blue/20 px-2 py-0.5 rounded shrink-0 mt-0.5">
                {s.category}
              </div>
              <div className="min-w-0">
                <div className="font-mono font-bold text-sm text-white/90">{s.name}</div>
                <div className="text-xs text-white/30 mt-0.5">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
