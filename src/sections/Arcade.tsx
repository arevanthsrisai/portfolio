import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Gamepad2, Heart, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import {
  arenaHeight,
  freshState,
  launch,
  LEVELS,
  PADDLE_W,
  render,
  step,
  TOTAL_LIVES,
  type GameState,
  type Phase,
} from "@/lib/breakout";
import {
  isMuted,
  setMuted,
  sfxBrick,
  sfxGameOver,
  sfxLevelClear,
  sfxLifeLost,
  sfxPaddle,
  sfxWall,
  sfxWon,
} from "@/lib/arcadeSound";
import { Reveal } from "@/components/primitives";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

const PADDLE_SPEED = 9;

export function Arcade() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<GameState | null>(null);
  const keysRef = useRef({ left: false, right: false });
  const rafRef = useRef(0);
  const inputVelRef = useRef(0);
  const levelClearTimer = useRef<number | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [hud, setHud] = useState({ score: 0, lives: TOTAL_LIVES, level: 1, combo: 0 });
  const [best, setBest] = useState(() => {
    try {
      return Number(window.localStorage.getItem("arcade-best") ?? 0);
    } catch {
      return 0;
    }
  });
  const [muted, setMutedState] = useState(isMuted);
  const isTouch = useMediaQuery("(pointer: coarse)");
  const reduce = useReducedMotion();

  const phaseRef = useRef<Phase>("idle");
  phaseRef.current = phase;

  const syncHud = useCallback((s: GameState) => {
    setHud({ score: s.score, lives: s.lives, level: s.level, combo: s.combo });
  }, []);

  const saveBest = useCallback((score: number) => {
    setBest((b) => {
      if (score <= b) return b;
      try {
        window.localStorage.setItem("arcade-best", String(score));
      } catch {
        /* private mode */
      }
      return score;
    });
  }, []);

  /* ------------------------------ phase helpers ----------------------------- */
  const startRun = useCallback(
    (level: number, score: number, lives: number) => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const w = rect.width;
      const h = arenaHeight(w);
      stateRef.current = freshState(w, h, level, score, lives);
      syncHud(stateRef.current);
      setPhase("serving");
    },
    [syncHud]
  );

  const handleEvents = useCallback(
    (events: ReturnType<typeof step>, s: GameState) => {
      for (const ev of events) {
        switch (ev.kind) {
          case "brick":
            sfxBrick(ev.combo);
            break;
          case "paddle":
            sfxPaddle();
            break;
          case "wall":
            sfxWall();
            break;
          case "life-lost":
            sfxLifeLost();
            // the engine parked the ball on the paddle - go back to serving
            // so every launch path (space, tap, button) works again
            setPhase("serving");
            break;
          case "level-clear":
            sfxLevelClear();
            setPhase("levelclear");
            levelClearTimer.current = window.setTimeout(() => {
              startRun(s.level + 1, s.score, s.lives);
            }, 1400);
            break;
          case "game-over":
            sfxGameOver();
            saveBest(s.score);
            setPhase("gameover");
            break;
          case "won":
            sfxWon();
            saveBest(s.score);
            setPhase("won");
            break;
        }
      }
    },
    [saveBest, startRun]
  );

  /* -------------------------------- game loop ------------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = rect.width;
      h = arenaHeight(w);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!stateRef.current) {
        stateRef.current = freshState(w, h);
        syncHud(stateRef.current);
      } else {
        // rebuild the brick layout for the new width, preserving hp/alive pattern
        const s = stateRef.current;
        const prev = s.bricks.map((b) => ({ hp: b.hp, alive: b.alive }));
        const rebuilt = freshState(w, h, s.level, s.score, s.lives).bricks;
        rebuilt.forEach((b, i) => {
          if (prev[i]) {
            b.hp = prev[i].hp;
            b.alive = prev[i].alive;
          }
        });
        s.bricks = rebuilt;
        s.bx = Math.min(Math.max(s.bx, 7), w - 7);
        s.px = Math.min(Math.max(s.px, PADDLE_W / 2 + 2), w - PADDLE_W / 2 - 2);
      }
    };

    const frame = (t: number) => {
      const s = stateRef.current;
      if (s) {
        const p = phaseRef.current;
        if (p === "running") {
          let vx = 0;
          if (keysRef.current.left) vx -= PADDLE_SPEED;
          if (keysRef.current.right) vx += PADDLE_SPEED;
          vx += inputVelRef.current;
          inputVelRef.current = 0;
          s.px = Math.min(Math.max(s.px + vx, PADDLE_W / 2 + 2), w - PADDLE_W / 2 - 2);
          const events = step(s, w, h, s.level);
          syncHud(s);
          handleEvents(events, s);
        } else if (p === "serving") {
          s.bx = s.px;
          s.by = h - 34 - 11;
        }
        render(ctx, s, w, h, t);
      }
      rafRef.current = requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      if (levelClearTimer.current) {
        window.clearTimeout(levelClearTimer.current);
        levelClearTimer.current = null;
      }
    };
  }, [handleEvents, syncHud]);

  /* ------------------------------ game actions ------------------------------ */
  const launchBall = useCallback(() => {
    const s = stateRef.current;
    if (!s || phaseRef.current !== "serving") return;
    launch(s, s.level);
    setPhase("running");
  }, []);

  const togglePause = useCallback(() => {
    setPhase((p) => {
      if (p === "running") return "paused";
      if (p === "paused") return "running";
      return p;
    });
  }, []);

  /* ------------------------- keyboard: dedicated keys ------------------------
   * Space/Enter launch ONLY. Pause lives on P and the UI button so the two
   * actions can never conflict. While a game is active, Space/Enter/arrows
   * are prevented from scrolling the page; outside a game they pass through.
   * -------------------------------------------------------------------------- */
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "BUTTON") return;
      const p = phaseRef.current;
      const inGame = p === "running" || p === "serving" || p === "paused";

      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        keysRef.current.left = true;
        if (inGame) e.preventDefault();
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        keysRef.current.right = true;
        if (inGame) e.preventDefault();
      } else if (e.key === " " || e.key === "Spacebar" || e.key === "Enter") {
        if (p === "serving") {
          e.preventDefault();
          launchBall();
        } else if (inGame) {
          // hold the page still during play, but never pause on Space
          e.preventDefault();
        }
      } else if ((e.key === "p" || e.key === "P") && inGame) {
        e.preventDefault();
        togglePause();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") keysRef.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") keysRef.current.right = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [launchBall, togglePause]);

  // auto-pause when the tab or window loses focus
  useEffect(() => {
    const pauseIfRunning = () => {
      if (phaseRef.current === "running") setPhase("paused");
    };
    window.addEventListener("blur", pauseIfRunning);
    const onVisibility = () => {
      if (document.hidden) pauseIfRunning();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("blur", pauseIfRunning);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  /* --------------------------- pointer / touch input ------------------------- */
  const pointerToPaddle = (clientX: number) => {
    const s = stateRef.current;
    const wrap = wrapRef.current;
    if (!s || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    s.px = Math.min(Math.max(clientX - rect.left, PADDLE_W / 2 + 2), rect.width - PADDLE_W / 2 - 2);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = phaseRef.current;
    if (p === "serving") {
      pointerToPaddle(e.clientX);
      launchBall();
    } else if (p === "running") {
      pointerToPaddle(e.clientX);
      e.currentTarget.setPointerCapture(e.pointerId);
    } else if (p === "paused") {
      togglePause();
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = phaseRef.current;
    if (p !== "running" && p !== "serving") return;
    // desktop: steer by hover; touch: steer by drag (capture held)
    pointerToPaddle(e.clientX);
  };

  const primaryAction = () => {
    const p = phaseRef.current;
    if (p === "idle" || p === "gameover" || p === "won") {
      startRun(1, 0, TOTAL_LIVES);
    } else if (p === "serving") {
      launchBall();
    } else if (p === "running" || p === "paused") {
      togglePause();
    }
  };

  const restart = () => {
    if (levelClearTimer.current) {
      window.clearTimeout(levelClearTimer.current);
      levelClearTimer.current = null;
    }
    startRun(1, 0, TOTAL_LIVES);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  const overlay = PHASE_OVERLAY[phase];
  const overlaySubtitle = overlay ? (isTouch ? overlay.touch : overlay.keys) : null;
  const arenaGlow =
    phase === "running"
      ? "ring-iris/25 shadow-[0_0_60px_-18px_rgba(143,143,248,0.45)]"
      : phase === "gameover" || phase === "won"
        ? "ring-amber/25 shadow-[0_0_60px_-18px_rgba(236,194,124,0.4)]"
        : "ring-white/[0.06]";

  return (
    <div id="arcade" data-phase={phase} className="relative py-20 sm:py-28">
      <div className="mb-6 flex justify-center">
        <div className="relative rounded-lg border border-iris/40 bg-base-900/80 px-6 py-2.5 shadow-[0_0_40px_-12px_rgba(143,143,248,0.45)]">
          <span className="font-arcade text-[11px] tracking-[0.2em] text-iris sm:text-xs">
            {"REVANTH'S ARCADE"}
          </span>
          <motion.span
            aria-hidden
            animate={reduce ? { opacity: 1 } : { opacity: [1, 0.3, 1] }}
            transition={reduce ? undefined : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full bg-amber shadow-[0_0_14px_3px_rgba(236,194,124,0.45)]"
          />
        </div>
      </div>

      {/* HUD */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          <span>
            score <span className="text-iris-soft">{String(hud.score).padStart(4, "0")}</span>
          </span>
          <span>
            level <span className="text-teal-soft">{hud.level}/{LEVELS.length}</span>
          </span>
          <span className="flex items-center gap-1.5" aria-label={`${hud.lives} lives remaining`}>
            lives
            <span className="flex items-center gap-1" aria-hidden>
              {Array.from({ length: TOTAL_LIVES }, (_, i) => (
                <Heart
                  key={i}
                  size={12}
                  className={cn(
                    "transition-all duration-300",
                    i < hud.lives
                      ? "fill-iris text-iris drop-shadow-[0_0_5px_rgba(143,143,248,0.6)]"
                      : "text-ink-faint/40"
                  )}
                />
              ))}
            </span>
          </span>
          {hud.combo > 1 && (
            <motion.span
              key={hud.combo}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-amber-soft"
            >
              combo x{hud.combo}
            </motion.span>
          )}
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
          <Gamepad2 size={14} className="text-accent" aria-hidden />
          best <span className="text-amber-soft">{String(Math.max(best, hud.score)).padStart(4, "0")}</span>
        </div>
      </div>

      {/* arena */}
      <Reveal delay={0.15}>
        <div className="glass relative overflow-hidden rounded-3xl p-3 sm:p-4">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-iris/[0.09] via-teal/[0.03] to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-56 w-56 rounded-full bg-iris/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 -right-20 h-56 w-56 rounded-full bg-teal/10 blur-3xl"
          />
          <div
            ref={wrapRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            className={cn(
              "relative cursor-crosshair overflow-hidden rounded-2xl select-none ring-1 ring-inset transition-shadow duration-450 ease-smooth",
              arenaGlow
            )}
            style={{ touchAction: "none" }}
          >
            <canvas ref={canvasRef} className="block w-full" aria-label="Neon Breakout game arena" role="img" />

            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-[5] opacity-[0.045] [background-image:repeating-linear-gradient(0deg,transparent_0px,transparent_2px,rgba(233,235,244,0.7)_3px)]"
            />

            {/* phase overlay - DOM text, never canvas text */}
            <AnimatePresence>
              {overlay && (
                <motion.div
                  key={phase}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-base-950/55 px-6 backdrop-blur-[2px]"
                >
                  <p className="bg-gradient-to-r from-iris-soft via-teal-soft to-amber-soft bg-clip-text font-arcade text-sm tracking-[0.15em] text-transparent sm:text-base">
                    {overlay.title}
                  </p>
                  <p className="max-w-xs text-center font-mono text-[10px] uppercase tracking-[0.25em] text-ink-dim sm:text-[11px]">
                    {overlaySubtitle}
                  </p>
                  {(phase === "idle" || phase === "gameover" || phase === "won") && (
                    <button
                      type="button"
                      onClick={primaryAction}
                      className="mt-2 min-h-[44px] rounded-full bg-gradient-to-r from-iris to-iris-deep px-7 py-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-base-950 shadow-[0_0_30px_-8px_rgba(143,143,248,0.55)] transition-all duration-300 ease-smooth hover:shadow-[0_0_44px_-6px_rgba(143,143,248,0.75)] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris"
                    >
                      {phase === "idle" ? "insert coin" : "play again"}
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>

      {/* control bar - large touch targets, always reachable */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
        {phase === "serving" && (
          <button
            type="button"
            onClick={launchBall}
            className="min-h-[44px] rounded-full bg-gradient-to-r from-iris to-iris-deep px-8 font-mono text-[11px] uppercase tracking-[0.25em] text-base-950 shadow-[0_0_30px_-8px_rgba(143,143,248,0.55)] transition-all duration-300 ease-smooth hover:shadow-[0_0_44px_-6px_rgba(143,143,248,0.75)] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris"
          >
            launch ball
          </button>
        )}
        {(phase === "running" || phase === "paused") && (
          <CtrlButton label={phase === "paused" ? "Resume game" : "Pause game"} onClick={togglePause}>
            {phase === "paused" ? <Play size={16} /> : <Pause size={16} />}
          </CtrlButton>
        )}
        {phase !== "idle" && (
          <CtrlButton label="Restart game" onClick={restart}>
            <RotateCcw size={16} />
          </CtrlButton>
        )}
        <CtrlButton label={muted ? "Unmute sound" : "Mute sound"} onClick={toggleMute}>
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </CtrlButton>
      </div>

      {/* device-aware legend */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
        {isTouch ? (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>drag to steer</span>
            <span>tap arena or launch button to serve</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>
              <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-ink-dim">A</kbd>
              <kbd className="ml-1 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-ink-dim">D</kbd>
              or <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-ink-dim">&#8592;</kbd>
              <kbd className="ml-1 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-ink-dim">&#8594;</kbd> move
            </span>
            <span>
              <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-ink-dim">space</kbd> launch
            </span>
            <span>
              <kbd className="rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-ink-dim">P</kbd> pause
            </span>
          </div>
        )}
        <span>clear all {LEVELS.length} levels to win</span>
      </div>
    </div>
  );
}

const PHASE_OVERLAY: Partial<Record<Phase, { title: string; keys: string; touch: string }>> = {
  idle: {
    title: "NEON BREAKOUT",
    keys: "press insert coin - space works too",
    touch: "tap insert coin to start",
  },
  serving: {
    title: "LEVEL READY",
    keys: "space or click to launch",
    touch: "tap the arena or hit launch",
  },
  paused: {
    title: "PAUSED",
    keys: "press P to resume",
    touch: "tap resume to continue",
  },
  levelclear: {
    title: "LEVEL CLEAR",
    keys: "next level loading...",
    touch: "next level loading...",
  },
  gameover: {
    title: "GAME OVER",
    keys: "the maze claims another paddle",
    touch: "the maze claims another paddle",
  },
  won: {
    title: "YOU WIN",
    keys: "all three levels cleared - legend status",
    touch: "all three levels cleared - legend status",
  },
};

function CtrlButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      whileHover={reduce ? undefined : { scale: 1.08 }}
      onClick={onClick}
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full glass-deep text-ink-dim transition-all duration-300 ease-smooth hover:text-iris-soft hover:shadow-[0_0_24px_-6px_rgba(143,143,248,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris"
    >
      {children}
    </motion.button>
  );
}
