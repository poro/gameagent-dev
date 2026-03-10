const socials = [
  { label: "Twitter", href: "https://twitter.com/markollila", icon: "𝕏" },
  { label: "YouTube", href: "https://youtube.com/@markollila", icon: "▶" },
  { label: "Twitch", href: "https://twitch.tv/markollila", icon: "◉" },
  { label: "GitHub", href: "https://github.com/poro", icon: "⌘" },
];

export default function Footer() {
  return (
    <footer className="border-t border-surface-border py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-mono text-sm text-white/30">
          <span className="text-accent/50">{'>'}</span> GAME_AGENT © {new Date().getFullYear()}
        </div>
        <div className="flex gap-6">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-accent transition-colors font-mono text-sm"
              title={s.label}
            >
              {s.icon} {s.label}
            </a>
          ))}
        </div>
        <div className="font-mono text-xs text-white/15">
          Built by a human + an AI agent
        </div>
      </div>
    </footer>
  );
}
