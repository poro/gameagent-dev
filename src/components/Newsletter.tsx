"use client";

export default function Newsletter() {
  return (
    <section id="newsletter" className="py-24 px-4 bg-surface/50">
      <div className="max-w-xl mx-auto text-center">
        <div className="font-mono text-accent/50 text-xs mb-2">// subscribe</div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Stay in the <span className="text-accent">Loop</span>
        </h2>
        <p className="text-white/40 mb-8">
          Get notified about new streams, project launches, and behind-the-scenes updates.
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="agent@email.com"
            className="flex-1 px-4 py-3 bg-surface-light border border-surface-border rounded font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 transition-colors"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-accent text-black font-mono font-bold text-sm rounded hover:bg-accent/90 transition-all hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] shrink-0"
          >
            SUBSCRIBE
          </button>
        </form>
        <p className="text-[11px] text-white/20 mt-3 font-mono">No spam. Unsubscribe anytime. Dufus promises.</p>
      </div>
    </section>
  );
}
