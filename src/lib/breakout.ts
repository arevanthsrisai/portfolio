/**
 * Neon Breakout engine — framework-free game logic + canvas rendering.
 * The React shell (sections/Arcade.tsx) owns input wiring and HUD chrome.
 */

export type Phase =
  | "idle"
  | "serving"
  | "running"
  | "paused"
  | "levelclear"
  | "gameover"
  | "won";

export type Brick = {
  x: number;
  y: number;
  w: number;
  h: number;
  hp: number;
  hue: number;
  alive: boolean;
};

export type Popup = { x: number; y: number; text: string; life: number };

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  hue: number;
};

export type GameState = {
  px: number; // paddle center x
  bx: number; // ball x
  by: number; // ball y
  vx: number;
  vy: number;
  bricks: Brick[];
  score: number;
  lives: number;
  level: number; // 1-based
  combo: number; // consecutive brick hits without paddle touch
  popups: Popup[];
  particles: Particle[];
  trail: { x: number; y: number }[];
};

export type LevelDef = {
  rows: number;
  cols: number;
  speed: number; // ball speed multiplier
  hpRows: number; // how many top rows have 2 hp
};

export const LEVELS: LevelDef[] = [
  { rows: 5, cols: 9, speed: 1, hpRows: 0 },
  { rows: 6, cols: 10, speed: 1.12, hpRows: 1 },
  { rows: 7, cols: 11, speed: 1.24, hpRows: 2 },
];

export const PADDLE_W = 124;
export const PADDLE_H = 12;
export const BALL_R = 7;
export const BRICK_H = 22;
export const BRICK_GAP = 6;
export const TOP_OFFSET = 52;
export const TOTAL_LIVES = 3;
export const MAX_COMBO = 5;
const HUES = [238, 240, 166, 168, 35, 37, 262]; // iris -> teal -> amber ladder

export function arenaHeight(width: number): number {
  return Math.max(360, Math.min(480, width * 0.6));
}

export function makeBricks(w: number, level: number): Brick[] {
  const def = LEVELS[Math.min(level, LEVELS.length) - 1];
  const pad = 14;
  const bw = (w - pad * 2 - BRICK_GAP * (def.cols - 1)) / def.cols;
  const bricks: Brick[] = [];
  for (let r = 0; r < def.rows; r++) {
    for (let c = 0; c < def.cols; c++) {
      bricks.push({
        x: pad + c * (bw + BRICK_GAP),
        y: TOP_OFFSET + r * (BRICK_H + BRICK_GAP),
        w: bw,
        h: BRICK_H,
        hp: r < def.hpRows ? 2 : 1,
        hue: HUES[r % HUES.length],
        alive: true,
      });
    }
  }
  return bricks;
}

export function freshState(
  w: number,
  h: number,
  level = 1,
  score = 0,
  lives = TOTAL_LIVES
): GameState {
  return {
    px: w / 2,
    bx: w / 2,
    by: h - 80,
    vx: 0,
    vy: 0,
    bricks: makeBricks(w, level),
    score,
    lives,
    level,
    combo: 0,
    popups: [],
    particles: [],
    trail: [],
  };
}

/** Ball speed magnitude for the current level. */
export function baseSpeed(level: number): number {
  const def = LEVELS[Math.min(level, LEVELS.length) - 1];
  return 4.6 * def.speed;
}

/** Launch the ball from the paddle with a slight random angle. */
export function launch(s: GameState, level: number): void {
  const speed = baseSpeed(level);
  const angle = Math.random() * 0.4 - 0.2;
  s.vx = speed * Math.sin(angle);
  s.vy = -Math.abs(speed * Math.cos(angle));
}

export type StepEvent =
  | { kind: "brick"; hue: number; combo: number; points: number }
  | { kind: "paddle" }
  | { kind: "wall" }
  | { kind: "life-lost" }
  | { kind: "level-clear" }
  | { kind: "game-over" }
  | { kind: "won" };

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/**
 * Advance the simulation one frame. Mutates state, returns events for the
 * shell to react to (sound, phase transitions).
 */
export function step(s: GameState, w: number, h: number, level: number): StepEvent[] {
  const events: StepEvent[] = [];
  const speedScale = baseSpeed(level) / 4.6;

  // decay popups + particles
  for (const p of s.popups) p.life -= 0.02;
  s.popups = s.popups.filter((p) => p.life > 0);
  for (const p of s.particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12;
    p.life -= 0.03;
  }
  s.particles = s.particles.filter((p) => p.life > 0);

  // ball follows paddle while serving
  if (s.vx === 0 && s.vy === 0) {
    s.bx = s.px;
    s.by = h - 34 - BALL_R - 4;
    return events;
  }

  // trail
  s.trail.push({ x: s.bx, y: s.by });
  if (s.trail.length > 10) s.trail.shift();

  // paddle + ball motion (input velocity applied by the shell before step)
  s.bx += s.vx;
  s.by += s.vy;

  // walls
  if (s.bx < BALL_R) {
    s.bx = BALL_R;
    s.vx = Math.abs(s.vx);
    events.push({ kind: "wall" });
  }
  if (s.bx > w - BALL_R) {
    s.bx = w - BALL_R;
    s.vx = -Math.abs(s.vx);
    events.push({ kind: "wall" });
  }
  if (s.by < BALL_R) {
    s.by = BALL_R;
    s.vy = Math.abs(s.vy);
    events.push({ kind: "wall" });
  }

  // paddle collision
  const py = h - 34;
  if (
    s.vy > 0 &&
    s.by + BALL_R >= py &&
    s.by + BALL_R <= py + PADDLE_H + 8 &&
    s.bx >= s.px - PADDLE_W / 2 - BALL_R &&
    s.bx <= s.px + PADDLE_W / 2 + BALL_R
  ) {
    s.by = py - BALL_R;
    const hit = clamp((s.bx - s.px) / (PADDLE_W / 2), -1, 1);
    const angle = hit * 1.05;
    const speed = Math.min(8.2 * speedScale, Math.hypot(s.vx, s.vy) * 1.02);
    s.vx = speed * Math.sin(angle);
    s.vy = -Math.abs(speed * Math.cos(angle));
    s.combo = 0; // paddle touch resets combo
    events.push({ kind: "paddle" });
  }

  // enforce a minimum vertical component so the ball never crawls sideways
  const minVy = 1.6 * speedScale;
  if (Math.abs(s.vy) < minVy) {
    s.vy = minVy * Math.sign(s.vy || -1);
  }

  // brick collisions
  for (const b of s.bricks) {
    if (!b.alive) continue;
    if (
      s.bx + BALL_R >= b.x &&
      s.bx - BALL_R <= b.x + b.w &&
      s.by + BALL_R >= b.y &&
      s.by - BALL_R <= b.y + b.h
    ) {
      const overlapX = Math.min(s.bx + BALL_R - b.x, b.x + b.w - (s.bx - BALL_R));
      const overlapY = Math.min(s.by + BALL_R - b.y, b.y + b.h - (s.by - BALL_R));
      if (overlapX < overlapY) s.vx = -s.vx;
      else s.vy = -s.vy;

      b.hp -= 1;
      if (b.hp <= 0) {
        b.alive = false;
        s.combo = Math.min(MAX_COMBO, s.combo + 1);
        const points = 10 * s.combo;
        s.score += points;
        s.popups.push({ x: b.x + b.w / 2, y: b.y, text: `+${points}`, life: 1 });
        burst(s, b.x + b.w / 2, b.y + b.h / 2, b.hue);
        events.push({ kind: "brick", hue: b.hue, combo: s.combo, points });
      } else {
        // cracked, not broken
        events.push({ kind: "brick", hue: b.hue, combo: 1, points: 0 });
      }
      break;
    }
  }

  // floor
  if (s.by > h + BALL_R) {
    s.lives -= 1;
    s.combo = 0;
    events.push({ kind: "life-lost" });
    if (s.lives <= 0) {
      events.push({ kind: "game-over" });
    } else {
      s.bx = s.px;
      s.by = h - 34 - BALL_R - 4;
      s.vx = 0;
      s.vy = 0;
      s.trail = [];
    }
    return events;
  }

  // level clear / win
  if (s.bricks.every((b) => !b.alive)) {
    if (level >= LEVELS.length) {
      events.push({ kind: "won" });
    } else {
      events.push({ kind: "level-clear" });
    }
  }

  return events;
}

function burst(s: GameState, x: number, y: number, hue: number) {
  for (let i = 0; i < 10; i++) {
    const a = (Math.PI * 2 * i) / 10 + Math.random() * 0.5;
    const sp = 1.5 + Math.random() * 2.5;
    s.particles.push({
      x,
      y,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp - 1,
      life: 1,
      hue,
    });
  }
}

/* --------------------------------- rendering -------------------------------- */

export function render(
  ctx: CanvasRenderingContext2D,
  s: GameState,
  w: number,
  h: number,
  t: number
): void {
  ctx.clearRect(0, 0, w, h);

  // arena backdrop
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "rgba(14,16,24,0.92)");
  bg.addColorStop(1, "rgba(7,8,13,0.96)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // subtle grid
  ctx.strokeStyle = "rgba(255,255,255,0.03)";
  ctx.lineWidth = 1;
  for (let gx = 0; gx < w; gx += 36) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, h);
    ctx.stroke();
  }
  for (let gy = 0; gy < h; gy += 36) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(w, gy);
    ctx.stroke();
  }

  // bricks
  for (const b of s.bricks) {
    if (!b.alive) continue;
    const light = b.hp > 1 ? 62 : 52;
    const alpha = b.hp > 1 ? 0.92 : 0.78;
    ctx.beginPath();
    ctx.roundRect(b.x, b.y, b.w, b.h, 5);
    ctx.fillStyle = `hsla(${b.hue}, 88%, ${light}%, ${alpha})`;
    ctx.fill();
    // top sheen
    ctx.beginPath();
    ctx.roundRect(b.x, b.y, b.w, b.h / 2, 5);
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    ctx.fill();
    if (b.hp > 1) {
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  // particles
  for (const p of s.particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.2 * p.life, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${p.life * 0.9})`;
    ctx.fill();
  }

  // paddle
  const py = h - 34;
  ctx.save();
  ctx.shadowColor = "rgba(182,185,255,0.55)";
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.roundRect(s.px - PADDLE_W / 2, py, PADDLE_W, PADDLE_H, 6);
  ctx.fillStyle = "rgba(232,234,242,0.95)";
  ctx.fill();
  ctx.restore();

  // ball trail
  for (let i = 0; i < s.trail.length; i++) {
    const tp = s.trail[i];
    const k = (i + 1) / s.trail.length;
    ctx.beginPath();
    ctx.arc(tp.x, tp.y, BALL_R * k * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(182,185,255,${0.05 + k * 0.12})`;
    ctx.fill();
  }

  // ball
  ctx.save();
  ctx.shadowColor = "rgba(143,143,248,0.8)";
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(s.bx, s.by, BALL_R, 0, Math.PI * 2);
  ctx.fillStyle = "#b6b9ff";
  ctx.fill();
  ctx.restore();

  // score popups
  ctx.textAlign = "center";
  for (const p of s.popups) {
    ctx.font = "600 12px 'JetBrains Mono', monospace";
    ctx.fillStyle = `rgba(255,255,255,${p.life * 0.9})`;
    ctx.fillText(p.text, p.x, p.y - (1 - p.life) * 26);
  }

  // ambient scan line
  const scanY = h * 0.3 + Math.sin(t * 0.0004) * h * 0.05;
  const grad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
  grad.addColorStop(0, "rgba(143,143,248,0)");
  grad.addColorStop(0.5, "rgba(143,143,248,0.04)");
  grad.addColorStop(1, "rgba(143,143,248,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, scanY - 30, w, 60);
}
