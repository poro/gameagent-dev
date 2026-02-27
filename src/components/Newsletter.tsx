"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage("You're in! Check your inbox for a welcome email.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

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
        {status === "success" ? (
          <div className="px-4 py-3 bg-accent/10 border border-accent/30 rounded font-mono text-sm text-accent">
            {message}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@email.com"
              disabled={status === "loading"}
              className="flex-1 px-4 py-3 bg-surface-light border border-surface-border rounded font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent/50 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-accent text-black font-mono font-bold text-sm rounded hover:bg-accent/90 transition-all hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "SUBSCRIBING..." : "SUBSCRIBE"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="text-sm text-red-400 mt-3 font-mono">{message}</p>
        )}
        <p className="text-[11px] text-white/20 mt-3 font-mono">No spam. Unsubscribe anytime. Dufus promises.</p>
      </div>
    </section>
  );
}
