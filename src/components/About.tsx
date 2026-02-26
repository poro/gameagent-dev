export default function About() {
  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="font-mono text-accent/50 text-xs mb-2">// about</div>
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          The <span className="text-accent">Experiment</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-white/60 leading-relaxed">
            <p>
              <strong className="text-white">Mark Ollila</strong> is Director of Endless Games and Learning Lab at Arizona State University. By day, he works at the intersection of AI and education. By night (and sometimes on stream), he builds real products with AI.
            </p>
            <p>
              The premise is simple: can one person, paired with an AI agent, build and ship revenue-generating products at the speed that used to require entire teams?
            </p>
          </div>
          <div className="space-y-4 text-white/60 leading-relaxed">
            <p>
              <strong className="text-accent font-mono">Dufus</strong> is the AI agent — powered by Claude and running on OpenClaw. It writes code, manages deployments, monitors systems, and occasionally has opinions.
            </p>
            <p>
              Every stream is real. Real code, real bugs, real deploys. The portfolio keeps growing. The agent keeps learning. And you get to watch it all happen live.
            </p>
          </div>
        </div>
        {/* Terminal block */}
        <div className="mt-12 bg-surface-light border border-surface-border rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 bg-black/50 border-b border-surface-border">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs text-white/30 font-mono">~/gameagent</span>
          </div>
          <div className="p-4 font-mono text-sm space-y-1">
            <div><span className="text-accent">$</span> <span className="text-white/80">dufus status</span></div>
            <div className="text-white/40">Agent: <span className="text-accent">online</span> | Projects: <span className="text-accent-blue">8 active</span> | Uptime: <span className="text-white/60">∞</span></div>
            <div><span className="text-accent">$</span> <span className="text-white/80">dufus ship --all</span></div>
            <div className="text-white/40">Deploying 3 projects to production... <span className="text-accent">✓ done</span></div>
            <div className="text-white/40 cursor"><span className="text-accent">$</span> </div>
          </div>
        </div>
      </div>
    </section>
  );
}
