"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { pickGame, createGame, type GameState, type GameType } from "./games";

const GENERATION_LINES: Record<GameType, string[]> = {
  shooter: [
    "Parsing prompt...",
    "Detected genre: SPACE_SHOOTER",
    "Initializing starfield renderer...",
    "Spawning player ship [▲]",
    "Loading enemy AI patterns...",
    "Binding input: WASD + SPACE",
    "Compiling game loop... done",
    "🚀 Game ready. Click canvas to play!",
  ],
  breakout: [
    "Parsing prompt...",
    "Detected genre: BREAKOUT",
    "Generating brick layout (6×10)...",
    "Physics engine: ball + paddle collision",
    "Spawning 60 destructible bricks...",
    "Binding input: ← → arrows",
    "Compiling game loop... done",
    "🧱 Game ready. Click canvas to play!",
  ],
  platformer: [
    "Parsing prompt...",
    "Detected genre: PLATFORMER",
    "Procedural level generation...",
    "Placing coins and platforms...",
    "Physics: gravity=800, jump=-380",
    "Binding input: WASD + SPACE",
    "Compiling game loop... done",
    "🏃 Game ready. Click canvas to play!",
  ],
};

const EXAMPLE_PROMPTS = [
  "A space shooter where you defend Earth from alien invaders",
  "A brick breaker game with colorful blocks and power-ups",
  "A platformer where you collect coins and jump across gaps",
];

export default function DemoClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameState | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const animRef = useRef<number>(0);

  const [prompt, setPrompt] = useState("");
  const [phase, setPhase] = useState<"input" | "generating" | "playing">("input");
  const [logLines, setLogLines] = useState<string[]>([]);
  const [gameType, setGameType] = useState<GameType | null>(null);
  const [canvasActive, setCanvasActive] = useState(false);

  // Start game generation
  const handleGenerate = useCallback((text: string) => {
    if (!text.trim()) return;
    setPrompt(text);
    setPhase("generating");
    const type = pickGame(text);
    setGameType(type);
    const lines = GENERATION_LINES[type];
    setLogLines([]);

    // Animate log lines
    lines.forEach((line, i) => {
      setTimeout(() => {
        setLogLines(prev => [...prev, line]);
        if (i === lines.length - 1) {
          // Start game after last line
          setTimeout(() => {
            const game = createGame(type);
            gameRef.current = game;
            setPhase("playing");
          }, 400);
        }
      }, 300 + i * 350);
    });
  }, []);

  // Game loop
  useEffect(() => {
    if (phase !== "playing" || !gameRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastTime = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const game = gameRef.current;
      if (game) {
        game.update(dt, keysRef.current);
        game.render(ctx, canvas.width, canvas.height);
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase]);

  // Keyboard
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (phase === "playing" && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      keysRef.current.add(e.key);
      // Restart on R
      if (e.key === "r" || e.key === "R") {
        if (gameRef.current?.gameOver) {
          gameRef.current.reset();
        }
      }
    };
    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, [phase]);

  const handleReset = () => {
    cancelAnimationFrame(animRef.current);
    gameRef.current = null;
    setPhase("input");
    setLogLines([]);
    setGameType(null);
    setPrompt("");
    setCanvasActive(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Terminal prompt area */}
      <div className="bg-surface-light border border-surface-border rounded-lg overflow-hidden mb-6">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-black/50 border-b border-surface-border">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
          <span className="ml-2 text-xs text-white/30 font-mono">naive — game generator</span>
        </div>

        <div className="p-4 font-mono text-sm space-y-2">
          {/* Welcome message */}
          <div className="text-white/40">
            <span className="text-accent">nAIVE</span> game engine v0.1.0
          </div>
          <div className="text-white/30 text-xs">
            Describe a game in natural language. The engine will generate it.
          </div>

          {/* Log output */}
          {logLines.map((line, i) => (
            <div key={i} className="text-white/60 animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <span className="text-accent/50">[gen]</span> {line}
            </div>
          ))}

          {/* Input or status */}
          {phase === "input" && (
            <form
              onSubmit={(e) => { e.preventDefault(); handleGenerate(prompt); }}
              className="flex items-center gap-2 mt-2"
            >
              <span className="text-accent">$</span>
              <span className="text-white/60">naive generate</span>
              <span className="text-accent">&quot;</span>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="describe your game..."
                className="flex-1 bg-transparent outline-none text-white placeholder:text-white/20 min-w-0"
                autoFocus
              />
              <span className="text-accent">&quot;</span>
              <button
                type="submit"
                className="px-3 py-1 bg-accent/10 border border-accent/30 text-accent text-xs rounded hover:bg-accent/20 transition-colors whitespace-nowrap"
              >
                RUN
              </button>
            </form>
          )}

          {phase === "playing" && (
            <div className="flex items-center justify-between mt-2">
              <div className="text-accent">
                <span className="text-white/40">$</span> Game running — {gameType}
              </div>
              <button
                onClick={handleReset}
                className="px-3 py-1 bg-white/5 border border-white/10 text-white/50 text-xs rounded hover:bg-white/10 transition-colors"
              >
                NEW GAME
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Game canvas */}
      <div className={`relative rounded-lg overflow-hidden border transition-all duration-500 ${
        phase === "playing" ? "border-accent/30 shadow-[0_0_40px_rgba(0,255,136,0.1)]" : "border-surface-border"
      }`}>
        <canvas
          ref={canvasRef}
          width={600}
          height={450}
          tabIndex={0}
          onClick={() => { canvasRef.current?.focus(); setCanvasActive(true); }}
          className={`w-full aspect-[4/3] bg-[#05050a] outline-none cursor-pointer ${
            !canvasActive && phase === "playing" ? "ring-2 ring-accent/50 ring-offset-2 ring-offset-black" : ""
          }`}
        />

        {/* Overlay when not playing */}
        {phase !== "playing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#05050a]/90">
            <div className="text-center">
              <div className="text-4xl mb-4">🎮</div>
              <div className="text-accent font-mono text-lg mb-2">nAIVE Engine</div>
              <div className="text-white/30 text-sm mb-6">
                {phase === "generating" ? "Generating your game..." : "Type a game description above to begin"}
              </div>
              {phase === "input" && (
                <div className="space-y-2">
                  <div className="text-white/20 text-xs font-mono mb-3">// try one of these:</div>
                  {EXAMPLE_PROMPTS.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => handleGenerate(ex)}
                      className="block w-full max-w-md mx-auto text-left px-4 py-2 bg-white/5 border border-white/10 rounded text-white/40 text-xs font-mono hover:bg-accent/10 hover:border-accent/20 hover:text-accent/80 transition-all"
                    >
                      &quot;{ex}&quot;
                    </button>
                  ))}
                </div>
              )}
              {phase === "generating" && (
                <div className="flex items-center gap-2 text-accent text-sm font-mono">
                  <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  Processing...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Click to focus hint */}
        {!canvasActive && phase === "playing" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer"
               onClick={() => { canvasRef.current?.focus(); setCanvasActive(true); }}>
            <div className="text-accent font-mono text-sm animate-pulse">
              ▶ Click to play
            </div>
          </div>
        )}
      </div>

      {/* Controls info */}
      {phase === "playing" && (
        <div className="mt-4 flex flex-wrap gap-4 justify-center text-xs font-mono text-white/30">
          <div><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50">← →</kbd> Move</div>
          {gameType !== "breakout" && <div><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50">↑</kbd> {gameType === "shooter" ? "Shoot" : "Jump"}</div>}
          <div><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50">SPACE</kbd> {gameType === "shooter" ? "Shoot" : gameType === "platformer" ? "Jump" : "—"}</div>
          <div><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-white/50">R</kbd> Restart</div>
        </div>
      )}
    </div>
  );
}
