// Mini-game definitions for the interactive demo
// Each game is a self-contained Canvas2D game loop

export interface GameState {
  running: boolean;
  score: number;
  gameOver: boolean;
  update: (dt: number, keys: Set<string>) => void;
  render: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  reset: () => void;
}

// ─── SPACE SHOOTER ───────────────────────────────────────────────

export function createSpaceShooter(): GameState {
  let ship = { x: 0, y: 0, w: 30, h: 20 };
  let bullets: { x: number; y: number; dy: number }[] = [];
  let enemies: { x: number; y: number; w: number; h: number; dx: number; hp: number }[] = [];
  let particles: { x: number; y: number; dx: number; dy: number; life: number; color: string }[] = [];
  let stars: { x: number; y: number; speed: number; brightness: number }[] = [];
  let score = 0;
  let gameOver = false;
  let shootCooldown = 0;
  let spawnTimer = 0;
  let initialized = false;

  function init(w: number, h: number) {
    ship = { x: w / 2, y: h - 60, w: 30, h: 20 };
    bullets = [];
    enemies = [];
    particles = [];
    stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      speed: 0.5 + Math.random() * 2,
      brightness: 0.2 + Math.random() * 0.6,
    }));
    score = 0;
    gameOver = false;
    shootCooldown = 0;
    spawnTimer = 0;
    initialized = true;
  }

  function spawnExplosion(x: number, y: number) {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.3;
      const speed = 60 + Math.random() * 120;
      particles.push({
        x, y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        life: 0.4 + Math.random() * 0.4,
        color: ['#00ff88', '#00d4ff', '#ffffff', '#ffcc00'][Math.floor(Math.random() * 4)],
      });
    }
  }

  return {
    running: true,
    get score() { return score; },
    get gameOver() { return gameOver; },
    reset() { initialized = false; },
    update(dt, keys) {
      if (gameOver) return;

      // Move ship
      const speed = 300;
      if (keys.has('ArrowLeft') || keys.has('a')) ship.x -= speed * dt;
      if (keys.has('ArrowRight') || keys.has('d')) ship.x += speed * dt;
      if (keys.has('ArrowUp') || keys.has('w')) ship.y -= speed * dt;
      if (keys.has('ArrowDown') || keys.has('s')) ship.y += speed * dt;

      // Shoot
      shootCooldown -= dt;
      if ((keys.has(' ') || keys.has('ArrowUp')) && shootCooldown <= 0) {
        bullets.push({ x: ship.x, y: ship.y - ship.h / 2, dy: -500 });
        shootCooldown = 0.15;
      }

      // Update bullets
      bullets.forEach(b => b.y += b.dy * dt);
      bullets = bullets.filter(b => b.y > -10);

      // Spawn enemies
      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        const w = 20 + Math.random() * 20;
        enemies.push({
          x: w + Math.random() * (600 - w * 2),
          y: -30,
          w,
          h: w * 0.8,
          dx: (Math.random() - 0.5) * 80,
          hp: 1 + Math.floor(score / 200),
        });
        spawnTimer = Math.max(0.3, 1.5 - score * 0.005);
      }

      // Update enemies
      enemies.forEach(e => {
        e.y += (60 + score * 0.3) * dt;
        e.x += e.dx * dt;
        if (e.x < e.w / 2 || e.x > 600 - e.w / 2) e.dx *= -1;
      });

      // Collision: bullets vs enemies
      for (let bi = bullets.length - 1; bi >= 0; bi--) {
        for (let ei = enemies.length - 1; ei >= 0; ei--) {
          const b = bullets[bi], e = enemies[ei];
          if (!b || !e) continue;
          if (Math.abs(b.x - e.x) < e.w / 2 + 4 && Math.abs(b.y - e.y) < e.h / 2 + 4) {
            e.hp--;
            bullets.splice(bi, 1);
            if (e.hp <= 0) {
              spawnExplosion(e.x, e.y);
              enemies.splice(ei, 1);
              score += 10;
            }
            break;
          }
        }
      }

      // Collision: enemies vs ship
      for (const e of enemies) {
        if (Math.abs(e.x - ship.x) < (e.w + ship.w) / 2 && Math.abs(e.y - ship.y) < (e.h + ship.h) / 2) {
          spawnExplosion(ship.x, ship.y);
          gameOver = true;
        }
      }

      // Enemies off screen
      enemies = enemies.filter(e => e.y < 500);
      if (enemies.some(e => e.y > 440)) gameOver = true;

      // Update particles
      particles.forEach(p => {
        p.x += p.dx * dt;
        p.y += p.dy * dt;
        p.life -= dt;
      });
      particles = particles.filter(p => p.life > 0);

      // Update stars
      stars.forEach(s => {
        s.y += s.speed * 60 * dt;
        if (s.y > 450) { s.y = 0; s.x = Math.random() * 600; }
      });
    },
    render(ctx, w, h) {
      if (!initialized) init(w, h);

      // Background
      ctx.fillStyle = '#05050a';
      ctx.fillRect(0, 0, w, h);

      // Stars
      stars.forEach(s => {
        ctx.fillStyle = `rgba(255,255,255,${s.brightness})`;
        ctx.fillRect(s.x, s.y, 1.5, 1.5);
      });

      // Ship
      if (!gameOver) {
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.fillStyle = '#00ff88';
        ctx.beginPath();
        ctx.moveTo(0, -ship.h / 2);
        ctx.lineTo(-ship.w / 2, ship.h / 2);
        ctx.lineTo(ship.w / 2, ship.h / 2);
        ctx.closePath();
        ctx.fill();
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.restore();

        // Engine glow
        ctx.fillStyle = '#00d4ff';
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 10;
        ctx.fillRect(ship.x - 4, ship.y + ship.h / 2, 8, 4 + Math.random() * 6);
        ctx.shadowBlur = 0;
      }

      // Bullets
      ctx.fillStyle = '#00ff88';
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 8;
      bullets.forEach(b => ctx.fillRect(b.x - 1.5, b.y - 6, 3, 12));
      ctx.shadowBlur = 0;

      // Enemies
      enemies.forEach(e => {
        ctx.fillStyle = e.hp > 1 ? '#ff4444' : '#ff8844';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.fillRect(e.x - e.w / 2, e.y - e.h / 2, e.w, e.h);
        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(e.x - e.w / 4 - 2, e.y - 2, 4, 4);
        ctx.fillRect(e.x + e.w / 4 - 2, e.y - 2, 4, 4);
      });
      ctx.shadowBlur = 0;

      // Particles
      particles.forEach(p => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
      });
      ctx.globalAlpha = 1;

      // Score HUD
      ctx.fillStyle = '#00ff88';
      ctx.font = '14px monospace';
      ctx.fillText(`SCORE: ${score}`, 10, 24);

      // Game over
      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#ff4444';
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', w / 2, h / 2 - 20);
        ctx.fillStyle = '#00ff88';
        ctx.font = '16px monospace';
        ctx.fillText(`Score: ${score}`, w / 2, h / 2 + 15);
        ctx.fillStyle = '#ffffff66';
        ctx.font = '12px monospace';
        ctx.fillText('Press R to restart', w / 2, h / 2 + 45);
        ctx.textAlign = 'left';
      }
    },
  };
}

// ─── BREAKOUT ────────────────────────────────────────────────────

export function createBreakout(): GameState {
  let paddle = { x: 0, w: 80, h: 10 };
  let ball = { x: 0, y: 0, dx: 200, dy: -250, r: 6 };
  let bricks: { x: number; y: number; w: number; h: number; color: string; alive: boolean }[] = [];
  let particles: { x: number; y: number; dx: number; dy: number; life: number; color: string }[] = [];
  let score = 0;
  let gameOver = false;
  let lives = 3;
  let initialized = false;

  function init(w: number, h: number) {
    paddle = { x: w / 2, w: 80, h: 10 };
    ball = { x: w / 2, y: h - 50, dx: 180 * (Math.random() > 0.5 ? 1 : -1), dy: -250, r: 6 };
    bricks = [];
    particles = [];
    const colors = ['#ff4444', '#ff8844', '#ffcc00', '#00ff88', '#00d4ff', '#8844ff'];
    const cols = Math.floor((w - 40) / 52);
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < cols; col++) {
        bricks.push({
          x: 20 + col * 52 + 25,
          y: 40 + row * 22,
          w: 48, h: 18,
          color: colors[row],
          alive: true,
        });
      }
    }
    score = 0;
    gameOver = false;
    lives = 3;
    initialized = true;
  }

  return {
    running: true,
    get score() { return score; },
    get gameOver() { return gameOver; },
    reset() { initialized = false; },
    update(dt, keys) {
      if (gameOver) return;

      // Paddle
      const speed = 400;
      if (keys.has('ArrowLeft') || keys.has('a')) paddle.x -= speed * dt;
      if (keys.has('ArrowRight') || keys.has('d')) paddle.x += speed * dt;
      paddle.x = Math.max(paddle.w / 2, Math.min(600 - paddle.w / 2, paddle.x));

      // Ball
      ball.x += ball.dx * dt;
      ball.y += ball.dy * dt;

      // Wall bounce
      if (ball.x - ball.r < 0 || ball.x + ball.r > 600) {
        ball.dx *= -1;
        ball.x = Math.max(ball.r, Math.min(600 - ball.r, ball.x));
      }
      if (ball.y - ball.r < 0) {
        ball.dy = Math.abs(ball.dy);
      }

      // Paddle bounce
      if (ball.dy > 0 && ball.y + ball.r > 430 && ball.y + ball.r < 445 &&
          Math.abs(ball.x - paddle.x) < paddle.w / 2 + ball.r) {
        ball.dy = -Math.abs(ball.dy);
        const offset = (ball.x - paddle.x) / (paddle.w / 2);
        ball.dx = offset * 250;
        ball.dy *= 1.02; // Slight speedup
      }

      // Ball lost
      if (ball.y > 460) {
        lives--;
        if (lives <= 0) {
          gameOver = true;
        } else {
          ball.x = paddle.x;
          ball.y = 410;
          ball.dx = 180 * (Math.random() > 0.5 ? 1 : -1);
          ball.dy = -250;
        }
      }

      // Brick collision
      for (const brick of bricks) {
        if (!brick.alive) continue;
        if (Math.abs(ball.x - brick.x) < brick.w / 2 + ball.r &&
            Math.abs(ball.y - brick.y) < brick.h / 2 + ball.r) {
          brick.alive = false;
          score += 10;
          // Determine bounce direction
          const overlapX = brick.w / 2 + ball.r - Math.abs(ball.x - brick.x);
          const overlapY = brick.h / 2 + ball.r - Math.abs(ball.y - brick.y);
          if (overlapX < overlapY) ball.dx *= -1;
          else ball.dy *= -1;
          // Particles
          for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            particles.push({
              x: brick.x, y: brick.y,
              dx: Math.cos(angle) * (40 + Math.random() * 80),
              dy: Math.sin(angle) * (40 + Math.random() * 80),
              life: 0.5 + Math.random() * 0.3,
              color: brick.color,
            });
          }
          break;
        }
      }

      // Win check
      if (bricks.every(b => !b.alive)) {
        gameOver = true; // Win state — score is high
      }

      // Particles
      particles.forEach(p => {
        p.x += p.dx * dt;
        p.y += p.dy * dt;
        p.life -= dt;
      });
      particles = particles.filter(p => p.life > 0);
    },
    render(ctx, w, h) {
      if (!initialized) init(w, h);

      ctx.fillStyle = '#05050a';
      ctx.fillRect(0, 0, w, h);

      // Bricks
      bricks.forEach(b => {
        if (!b.alive) return;
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 6;
        const rr = 3;
        ctx.beginPath();
        ctx.roundRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h, rr);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Paddle
      ctx.fillStyle = '#00ff88';
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(paddle.x - paddle.w / 2, 435, paddle.w, paddle.h, 4);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Ball
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Particles
      particles.forEach(p => {
        ctx.globalAlpha = p.life * 2;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
      });
      ctx.globalAlpha = 1;

      // HUD
      ctx.fillStyle = '#00ff88';
      ctx.font = '14px monospace';
      ctx.fillText(`SCORE: ${score}`, 10, 24);
      ctx.fillStyle = '#ff4444';
      ctx.fillText('♥'.repeat(lives), w - 60, 24);

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, w, h);
        const won = bricks.every(b => !b.alive);
        ctx.fillStyle = won ? '#00ff88' : '#ff4444';
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(won ? 'YOU WIN!' : 'GAME OVER', w / 2, h / 2 - 20);
        ctx.fillStyle = '#00ff88';
        ctx.font = '16px monospace';
        ctx.fillText(`Score: ${score}`, w / 2, h / 2 + 15);
        ctx.fillStyle = '#ffffff66';
        ctx.font = '12px monospace';
        ctx.fillText('Press R to restart', w / 2, h / 2 + 45);
        ctx.textAlign = 'left';
      }
    },
  };
}

// ─── PLATFORMER ──────────────────────────────────────────────────

export function createPlatformer(): GameState {
  let player = { x: 60, y: 300, vx: 0, vy: 0, w: 16, h: 24, grounded: false, facing: 1 };
  let platforms: { x: number; y: number; w: number; h: number; color: string }[] = [];
  let coins: { x: number; y: number; collected: boolean }[] = [];
  let particles: { x: number; y: number; dx: number; dy: number; life: number; color: string }[] = [];
  let score = 0;
  let gameOver = false;
  let cameraX = 0;
  let levelEnd = 0;
  let initialized = false;

  function init(w: number, h: number) {
    player = { x: 60, y: 300, vx: 0, vy: 0, w: 16, h: 24, grounded: false, facing: 1 };
    platforms = [];
    coins = [];
    particles = [];
    score = 0;
    gameOver = false;
    cameraX = 0;

    // Generate platforms procedurally
    // Ground
    platforms.push({ x: 0, y: 420, w: 300, h: 30, color: '#1a1a2e' });
    let px = 250;
    for (let i = 0; i < 20; i++) {
      const gap = 60 + Math.random() * 80;
      const pw = 80 + Math.random() * 120;
      const py = 300 + Math.random() * 120;
      px += gap;
      platforms.push({ x: px, y: py, w: pw, h: 14, color: '#1a1a2e' });
      // Coins on platform
      for (let c = 0; c < Math.floor(pw / 40); c++) {
        coins.push({ x: px + 20 + c * 40, y: py - 30, collected: false });
      }
      px += pw;
    }
    // Final platform
    platforms.push({ x: px + 60, y: 350, w: 200, h: 14, color: '#00ff88' });
    levelEnd = px + 160;
    initialized = true;
  }

  return {
    running: true,
    get score() { return score; },
    get gameOver() { return gameOver; },
    reset() { initialized = false; },
    update(dt, keys) {
      if (gameOver) return;
      const gravity = 800;
      const moveSpeed = 200;
      const jumpForce = -380;

      // Horizontal
      if (keys.has('ArrowLeft') || keys.has('a')) {
        player.vx = -moveSpeed;
        player.facing = -1;
      } else if (keys.has('ArrowRight') || keys.has('d')) {
        player.vx = moveSpeed;
        player.facing = 1;
      } else {
        player.vx *= 0.8;
      }

      // Jump
      if ((keys.has('ArrowUp') || keys.has('w') || keys.has(' ')) && player.grounded) {
        player.vy = jumpForce;
        player.grounded = false;
      }

      // Physics
      player.vy += gravity * dt;
      player.x += player.vx * dt;
      player.y += player.vy * dt;

      // Platform collision
      player.grounded = false;
      for (const plat of platforms) {
        if (player.x + player.w / 2 > plat.x && player.x - player.w / 2 < plat.x + plat.w) {
          if (player.vy > 0 && player.y + player.h / 2 > plat.y && player.y + player.h / 2 < plat.y + plat.h + player.vy * dt) {
            player.y = plat.y - player.h / 2;
            player.vy = 0;
            player.grounded = true;
          }
        }
      }

      // Fall death
      if (player.y > 500) {
        gameOver = true;
      }

      // Win
      if (player.x > levelEnd) {
        gameOver = true;
        score += 100;
      }

      // Coins
      coins.forEach(c => {
        if (c.collected) return;
        if (Math.abs(player.x - c.x) < 18 && Math.abs(player.y - c.y) < 18) {
          c.collected = true;
          score += 10;
          for (let i = 0; i < 6; i++) {
            particles.push({
              x: c.x, y: c.y,
              dx: (Math.random() - 0.5) * 100,
              dy: (Math.random() - 0.5) * 100,
              life: 0.4, color: '#ffcc00',
            });
          }
        }
      });

      // Camera follow
      cameraX += (player.x - 200 - cameraX) * 4 * dt;
      cameraX = Math.max(0, cameraX);

      // Particles
      particles.forEach(p => { p.x += p.dx * dt; p.y += p.dy * dt; p.life -= dt; });
      particles = particles.filter(p => p.life > 0);
    },
    render(ctx, w, h) {
      if (!initialized) init(w, h);

      ctx.fillStyle = '#05050a';
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(-cameraX, 0);

      // Platforms
      platforms.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color === '#00ff88' ? '#00ff88' : '#333';
        ctx.shadowBlur = p.color === '#00ff88' ? 15 : 0;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, p.w, p.h, 4);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Coins
      coins.forEach(c => {
        if (c.collected) return;
        ctx.fillStyle = '#ffcc00';
        ctx.shadowColor = '#ffcc00';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 7, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Player
      if (!gameOver || player.y < 500) {
        ctx.fillStyle = '#00ff88';
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 10;
        // Body
        ctx.fillRect(player.x - player.w / 2, player.y - player.h / 2, player.w, player.h);
        // Eyes
        ctx.fillStyle = '#05050a';
        const eyeX = player.facing > 0 ? 3 : -7;
        ctx.fillRect(player.x + eyeX, player.y - player.h / 4, 4, 4);
      }
      ctx.shadowBlur = 0;

      // Particles
      particles.forEach(p => {
        ctx.globalAlpha = p.life * 2;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
      });
      ctx.globalAlpha = 1;

      ctx.restore();

      // HUD
      ctx.fillStyle = '#00ff88';
      ctx.font = '14px monospace';
      ctx.fillText(`COINS: ${score}`, 10, 24);

      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, w, h);
        const won = player.x > levelEnd;
        ctx.fillStyle = won ? '#00ff88' : '#ff4444';
        ctx.font = 'bold 28px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(won ? 'LEVEL COMPLETE!' : 'FELL!', w / 2, h / 2 - 20);
        ctx.fillStyle = '#00ff88';
        ctx.font = '16px monospace';
        ctx.fillText(`Coins: ${score}`, w / 2, h / 2 + 15);
        ctx.fillStyle = '#ffffff66';
        ctx.font = '12px monospace';
        ctx.fillText('Press R to restart', w / 2, h / 2 + 45);
        ctx.textAlign = 'left';
      }
    },
  };
}

// ─── GAME PICKER ─────────────────────────────────────────────────

export type GameType = 'shooter' | 'breakout' | 'platformer';

const KEYWORDS: Record<GameType, string[]> = {
  shooter: ['shoot', 'space', 'ship', 'laser', 'alien', 'invader', 'galaxy', 'star', 'blast', 'defend', 'attack', 'missile', 'fighter', 'spacecraft'],
  breakout: ['break', 'brick', 'bounce', 'paddle', 'ball', 'pong', 'arkanoid', 'block', 'destroy', 'wall', 'smash'],
  platformer: ['jump', 'platform', 'run', 'mario', 'collect', 'coin', 'adventure', 'side', 'scroll', 'hop', 'climb', 'explore'],
};

export function pickGame(prompt: string): GameType {
  const lower = prompt.toLowerCase();
  const scores: Record<GameType, number> = { shooter: 0, breakout: 0, platformer: 0 };
  for (const [type, words] of Object.entries(KEYWORDS) as [GameType, string[]][]) {
    for (const w of words) {
      if (lower.includes(w)) scores[type]++;
    }
  }
  const max = Math.max(...Object.values(scores));
  if (max === 0) {
    // Random if no match
    const types: GameType[] = ['shooter', 'breakout', 'platformer'];
    return types[Math.floor(Math.random() * types.length)];
  }
  return (Object.entries(scores) as [GameType, number][]).find(([, v]) => v === max)![0];
}

export function createGame(type: GameType): GameState {
  switch (type) {
    case 'shooter': return createSpaceShooter();
    case 'breakout': return createBreakout();
    case 'platformer': return createPlatformer();
  }
}
