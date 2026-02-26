export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid bg */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(0,255,136,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.3) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px]" />
      
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <div className="font-mono text-accent/60 text-sm mb-6 tracking-widest">
          <span className="text-white/40">$</span> ./build --with-ai --live
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
          <span className="glow text-accent">GAME</span>{" "}
          <span className="text-white">AGENT</span>
        </h1>
        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-4 leading-relaxed">
          Building real, revenue-generating AI products — live on stream.
          <br />
          <span className="text-white/30">No tutorials. No toy demos. Just shipping.</span>
        </p>
        <div className="font-mono text-xs text-white/20 mb-10">
          Mark Ollila + Dufus (AI Agent) • Live from Phoenix, AZ
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://youtube.com/@markollila"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-black font-mono font-bold text-sm rounded hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.87.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
            WATCH LIVE
          </a>
          <a
            href="https://twitch.tv/markollila"
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-2 px-8 py-3 border border-accent/30 text-accent font-mono font-bold text-sm rounded hover:bg-accent/10 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.64 5.93h1.43v4.28h-1.43m3.93-4.28H17v4.28h-1.43M7 2 3.43 5.57v12.86h4.28V22l3.58-3.57h2.85L20.57 12V2m-1.43 9.29-2.85 2.85h-2.86l-2.5 2.5v-2.5H7.71V3.43h11.43z"/></svg>
            TWITCH
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-1">
          <div className="w-1 h-2 bg-accent/60 rounded-full" />
        </div>
      </div>
    </section>
  );
}
