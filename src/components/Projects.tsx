const projects = [
  {
    name: "WorldView",
    desc: "Interactive 3D globe with real-time geospatial data visualization. CesiumJS + Next.js.",
    tags: ["CesiumJS", "Next.js", "3D"],
    status: "live",
    url: "#",
  },
  {
    name: "CMNN",
    desc: "AI-generated news network with autonomous AI writers, each with unique perspectives and beats.",
    tags: ["AI Writers", "Supabase", "Next.js"],
    status: "live",
    url: "https://cmnn.com",
  },
  {
    name: "White Light",
    desc: "Algorithmic trading system using momentum signals. Automated daily execution via Alpaca.",
    tags: ["Python", "Alpaca", "Polygon.io"],
    status: "live",
    url: "#",
  },
  {
    name: "Lineup Guru",
    desc: "DFS lineup optimizer with projections engine. Built for serious daily fantasy players.",
    tags: ["DFS", "Optimization", "React"],
    status: "building",
    url: "https://lineup.guru",
  },
  {
    name: "odds.cn",
    desc: "Real-time odds comparison and sports betting analytics platform.",
    tags: ["Sports", "Data", "Next.js"],
    status: "building",
    url: "https://odds.cn",
  },
  {
    name: "stereos.com",
    desc: "Music discovery and social listening platform.",
    tags: ["Music", "Social", "Supabase"],
    status: "building",
    url: "https://stereos.com",
  },
  {
    name: "meatlover.com",
    desc: "Community and content platform for carnivore diet enthusiasts.",
    tags: ["Community", "Content", "Next.js"],
    status: "live",
    url: "https://meatlover.com",
  },
  {
    name: "OpenClaw / Dufus",
    desc: "The AI agent framework powering all of this. Claude-based, tool-using, always online.",
    tags: ["AI Agent", "Claude", "TypeScript"],
    status: "core",
    url: "#",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-4 bg-surface/50">
      <div className="max-w-6xl mx-auto">
        <div className="font-mono text-accent/50 text-xs mb-2">// projects</div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          The <span className="text-accent">Portfolio</span>
        </h2>
        <p className="text-white/40 mb-12 max-w-xl">
          Real products. Real users. All built live on stream with AI.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener"
              className="card-hover block bg-surface-light border border-surface-border rounded-lg p-5 group"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono font-bold text-white group-hover:text-accent transition-colors">
                  {p.name}
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  p.status === "live" ? "text-accent border-accent/30 bg-accent/5" :
                  p.status === "core" ? "text-accent-blue border-accent-blue/30 bg-accent-blue/5" :
                  "text-yellow-400 border-yellow-400/30 bg-yellow-400/5"
                }`}>
                  {p.status}
                </span>
              </div>
              <p className="text-sm text-white/40 mb-4 leading-relaxed">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span key={t} className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-0.5 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
