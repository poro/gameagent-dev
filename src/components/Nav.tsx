"use client";
import { useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "/demo", label: "Demo" },
  { href: "#stack", label: "Stack" },
  { href: "/guide", label: "Guide" },
  { href: "#newsletter", label: "Newsletter" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-surface-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#" className="font-mono text-accent font-bold text-lg tracking-wider">
          <span className="text-white/60">{'>'}</span> GAME_AGENT
        </a>
        <div className="hidden md:flex gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-white/60 hover:text-accent transition-colors font-mono">
              {l.label}
            </a>
          ))}
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-white/60 hover:text-accent">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-black/95 border-b border-surface-border px-4 pb-4">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-2 text-sm text-white/60 hover:text-accent font-mono">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
