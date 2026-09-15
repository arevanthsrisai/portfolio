import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Transition,
} from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { testimonials, type Testimonial } from "@/data/profile";
import { Reveal, SectionHeading } from "@/components/primitives";
import { cn } from "@/lib/utils";

const ACCENT_TEXT: Record<Testimonial["accent"], string> = {
  iris: "text-iris-soft",
  teal: "text-teal-soft",
  amber: "text-amber-soft",
};

const ACCENT_GLOW: Record<Testimonial["accent"], string> = {
  iris: "shadow-[0_30px_90px_-24px_rgba(143,143,248,0.5),0_10px_40px_-12px_rgba(0,0,0,0.7)]",
  teal: "shadow-[0_30px_90px_-24px_rgba(99,217,196,0.45),0_10px_40px_-12px_rgba(0,0,0,0.7)]",
  amber:
    "shadow-[0_30px_90px_-24px_rgba(236,194,124,0.45),0_10px_40px_-12px_rgba(0,0,0,0.7)]",
};

const ACCENT_BORDER: Record<Testimonial["accent"], string> = {
  iris: "border-iris/50",
  teal: "border-teal/50",
  amber: "border-amber/50",
};

const ACCENT_RGB: Record<Testimonial["accent"], string> = {
  iris: "143,143,248",
  teal: "99,217,196",
  amber: "236,194,124",
};

const STAGE_ASPECT = 3 / 4;

// Pointer must rest this long in a zone before hover promotes.
const HOVER_DWELL_MS = 120;
// Minimum gap between real swaps; rapid click/focus/dwell spam extends it.
const SWAP_COOLDOWN_MS = 400;

const SWAP_SPRING: Transition = { type: "spring", stiffness: 420, damping: 32 };
const DEPTH_SPRING: Transition = { type: "spring", stiffness: 440, damping: 26 };
const ROT_SPRING: Transition = { type: "spring", stiffness: 320, damping: 20 };
const SCALE_SPRING: Transition = { type: "spring", stiffness: 480, damping: 26 };
const TRAIL_SPRING: Transition = { type: "spring", stiffness: 240, damping: 26 };

const SWAP_TRANSITION: Transition = {
  left: SWAP_SPRING,
  top: SWAP_SPRING,
  width: SWAP_SPRING,
  height: SWAP_SPRING,
  z: DEPTH_SPRING,
  rotate: ROT_SPRING,
  scale: SCALE_SPRING,
  opacity: { duration: 0.22, ease: "easeOut" },
};

const TRAIL_TRANSITION: Transition = {
  left: TRAIL_SPRING,
  top: TRAIL_SPRING,
  width: TRAIL_SPRING,
  height: TRAIL_SPRING,
  opacity: { duration: 0.5, ease: "easeOut" },
};

/** Mid-flight rotation arc (deg) injected on every dominance change. */
const SWING_YAW = 9;
const SWING_PITCH = 2.5;

/** Contain-fit rect (in % of the stage) for a frame showing an image uncropped. */
function dominantRect(a: number) {
  const maxSide = 88;
  return a >= STAGE_ASPECT
    ? { width: `${maxSide}%`, height: `${((maxSide * STAGE_ASPECT) / a).toFixed(2)}%` }
    : { height: `${maxSide}%`, width: `${((maxSide * a) / STAGE_ASPECT).toFixed(2)}%` };
}

export default function Voices() {
  const [index, setIndex] = useState(0);
  const [dominant, setDominantState] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const [aspects, setAspects] = useState<Record<string, number>>({});
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const count = testimonials.length;
  const active = testimonials[index];
  const next = testimonials[(index + 1) % count];
  const reduce = useReducedMotion();

  const tiltBasisX = useMotionValue(0);
  const tiltBasisY = useMotionValue(0);
  const tiltX = useSpring(tiltBasisX, { stiffness: 140, damping: 18 });
  const tiltY = useSpring(tiltBasisY, { stiffness: 140, damping: 18 });

  // Signed scalar that kicks to ±1 on a real dominance change, then springs
  // back to 0 — giving both photos a transient counter-rotation arc.
  const swing = useMotionValue(0);
  const prevDominant = useRef(0);
  const swapLock = useRef(0);
  const swingAnim = useRef<{ stop: () => void } | null>(null);
  const dwellTimer = useRef<number | null>(null);

  const yawA = useTransform(swing, (s) => s * SWING_YAW);
  const yawB = useTransform(swing, (s) => -s * SWING_YAW);
  const pitchA = useTransform(swing, (s) => -s * SWING_PITCH);
  const pitchB = useTransform(swing, (s) => s * SWING_PITCH);
  const rotateXA = useTransform<number, number>([tiltX, pitchA], ([tx, p]) => tx + p);
  const rotateXB = useTransform<number, number>([tiltX, pitchB], ([tx, p]) => tx + p);
  const rotateYA = useTransform<number, number>([tiltY, yawA], ([ty, yw]) => ty + yw);
  const rotateYB = useTransform<number, number>([tiltY, yawB], ([ty, yw]) => ty + yw);

  useEffect(
    () => () => {
      swingAnim.current?.stop();
      if (dwellTimer.current !== null) window.clearTimeout(dwellTimer.current);
    },
    []
  );

  const rememberAspect = (src: string, img: HTMLImageElement) => {
    const a = img.naturalWidth / img.naturalHeight;
    if (!a || Number.isNaN(a)) return;
    setAspects((prev) => (prev[src] === a ? prev : { ...prev, [src]: a }));
  };

  const markFailed = (src: string) => {
    setFailed((prev) => (prev[src] ? prev : { ...prev, [src]: true }));
  };

  const clearDwell = () => {
    if (dwellTimer.current !== null) {
      window.clearTimeout(dwellTimer.current);
      dwellTimer.current = null;
    }
  };

  const handleTilt = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    if (!reduce) {
      tiltBasisY.set(px * 7);
      tiltBasisX.set(-py * 7);
    }
    // Dwell-based promotion against fixed stage geometry. Every pointer move
    // resets the timer, so continuous motion — circling, wiggling, crossing —
    // can never fire a swap; only resting in a zone promotes.
    clearDwell();
    const zone =
      px > 0.06 && py > 0.06 ? "br" : px < 0.02 || py < 0.02 ? "tl" : "mid";
    if (zone === "br" && dominant !== 1) {
      dwellTimer.current = window.setTimeout(() => promote(1), HOVER_DWELL_MS);
    } else if (zone === "tl" && dominant !== 0) {
      dwellTimer.current = window.setTimeout(() => promote(0), HOVER_DWELL_MS);
    }
  };

  const resetTilt = () => {
    tiltBasisX.set(0);
    tiltBasisY.set(0);
  };

  const promote = (i: number) => {
    const now = performance.now();
    if (i !== dominant && now - swapLock.current < SWAP_COOLDOWN_MS) {
      swapLock.current = now;
      return;
    }
    setDominantState(i);
    if (reduce || i === prevDominant.current) return;
    swapLock.current = now;
    prevDominant.current = i;
    swing.set(i === 0 ? 1 : -1);
    swingAnim.current?.stop();
    swingAnim.current = animate(swing, 0, {
      type: "spring",
      stiffness: 260,
      damping: 18,
    });
  };

  const goTo = (i: number) => {
    setIndex(i);
    promote(0);
  };

  const secondaryUrl = active.secondaryImage ?? next.image;
  const slides = failed[active.image]
    ? [secondaryUrl]
    : failed[secondaryUrl]
      ? [active.image]
      : [active.image, secondaryUrl];
  const safeDominant = Math.min(dominant, slides.length - 1);
  const lit = engaged || safeDominant !== 0;
  const dominantUrl = slides[safeDominant] ?? active.image;
  const domFit = dominantRect(aspects[dominantUrl] ?? 4 / 3);

  return (
    <section id="voices" className="relative py-32 md:py-48">
      <div aria-hidden className="section-glow [--glow-color:rgba(236,194,124,0.05)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(48rem,80%)] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
      />
      <div className="shell">
        <SectionHeading
          eyebrow="Voices"
          title="What people say when the work ships."
          description="Peers, jurors, and collaborators on building together."
        />
        <Reveal className="mt-14" delay={0.1}>
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <div
              className="relative mx-auto aspect-[3/4] w-full max-w-[20rem] md:mx-0 md:max-w-[26rem]"
              style={{ perspective: "1200px" }}
              onPointerMove={handleTilt}
              onPointerEnter={(e) => {
                if (e.pointerType !== "touch") setEngaged(true);
              }}
              onPointerLeave={(e) => {
                clearDwell();
                resetTilt();
                setEngaged(false);
                if (e.pointerType !== "touch") promote(0);
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                  setEngaged(false);
                  promote(0);
                }
              }}
            >
              <motion.div
                aria-hidden
                initial={false}
                animate={{
                  left: "45%",
                  top: "44%",
                  x: "-50%",
                  y: "-50%",
                  width: domFit.width,
                  height: domFit.height,
                  scale: 1.16,
                  z: -30,
                  opacity: lit ? 0.55 : 0,
                }}
                style={{
                  zIndex: 5,
                  background: `radial-gradient(closest-side, rgba(${ACCENT_RGB[active.accent]},0.65), rgba(${ACCENT_RGB[active.accent]},0) 72%)`,
                }}
                transition={reduce ? { duration: 0 } : TRAIL_TRANSITION}
                className="pointer-events-none absolute rounded-full blur-3xl"
              />
              <AnimatePresence initial={false}>
                {slides.map((url, i) => {
                  const isDominant = safeDominant === i;
                  const fit = dominantRect(aspects[url] ?? 4 / 3);
                  return (
                    <motion.div
                      key={`${url}-${i}`}
                      role="button"
                      tabIndex={0}
                      aria-label={`View photo ${i + 1}`}
                      aria-pressed={isDominant}
                      initial={{ opacity: 0 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      onFocus={() => {
                        promote(i);
                        setEngaged(true);
                      }}
                      onClick={() => promote(i)}
                      animate={{
                        left: isDominant ? "45%" : "71%",
                        top: isDominant ? "44%" : "69%",
                        x: "-50%",
                        y: "-50%",
                        width: isDominant ? fit.width : "54%",
                        height: isDominant ? fit.height : "38%",
                        rotate: isDominant ? 0 : 3,
                        scale: isDominant ? 1 : 0.97,
                        z: isDominant ? 55 : 0,
                        opacity: isDominant ? 1 : 0.7,
                      }}
                      style={{
                        zIndex: isDominant ? 20 : 10,
                        rotateX: i === 0 ? rotateXA : rotateXB,
                        rotateY: i === 0 ? rotateYA : rotateYB,
                      }}
                      transition={reduce ? { duration: 0 } : SWAP_TRANSITION}
                      whileHover={isDominant ? { scale: 1.015 } : { scale: 1.05 }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          promote(i);
                        }
                      }}
                      className={cn(
                        "absolute cursor-pointer overflow-hidden rounded-2xl border",
                        "transition-[border-color,box-shadow,filter] duration-500 ease-smooth",
                        isDominant
                          ? cn(
                              "border-white/25 focus-visible:border-iris/60",
                              ACCENT_GLOW[active.accent],
                              lit && ACCENT_BORDER[active.accent]
                            )
                          : "border-white/10 grayscale-[0.35] shadow-[0_18px_50px_-24px_rgba(0,0,0,0.8)] focus-visible:border-white/30"
                      )}
                    >
                      <img
                        src={url}
                        alt=""
                        loading="lazy"
                        draggable={false}
                        onError={() => markFailed(url)}
                        ref={(el) => {
                          if (el?.complete && el.naturalWidth) rememberAspect(url, el);
                        }}
                        onLoad={(e) => rememberAspect(url, e.currentTarget)}
                        className="absolute inset-0 h-full w-full select-none object-cover contrast-125"
                      />
                      <div
                        aria-hidden
                        className={cn(
                          "pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.14] via-transparent to-transparent transition-opacity duration-500 ease-smooth",
                          lit && isDominant ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <div aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.figure
                  key={active.image}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }}
                >
                  <blockquote className="font-display text-2xl font-medium leading-snug tracking-tight text-ink md:text-4xl">
                    &ldquo;{active.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span
                      className={cn(
                        "font-mono text-xs tracking-[0.25em]",
                        ACCENT_TEXT[active.accent]
                      )}
                    >
                      {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                    </span>
                    <span aria-hidden className="h-px w-8 bg-white/15" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-dim">
                      {active.role} / {active.context}
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
              <div className="mt-10 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => goTo((index - 1 + count) % count)}
                  aria-label="Previous testimonial"
                  className="glass grid h-11 w-11 place-items-center rounded-full text-ink-dim transition-all duration-300 ease-smooth hover:border-iris/40 hover:text-ink hover:shadow-[0_0_30px_-8px_rgba(143,143,248,0.4)]"
                >
                  <ArrowLeft size={18} strokeWidth={1.7} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => goTo((index + 1) % count)}
                  aria-label="Next testimonial"
                  className="glass grid h-11 w-11 place-items-center rounded-full text-ink-dim transition-all duration-300 ease-smooth hover:border-iris/40 hover:text-ink hover:shadow-[0_0_30px_-8px_rgba(143,143,248,0.4)]"
                >
                  <ArrowRight size={18} strokeWidth={1.7} aria-hidden />
                </button>
                <div className="ml-2 flex items-center gap-3">
                  {testimonials.map((t, i) => (
                    <button
                      key={t.image}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Show testimonial ${i + 1}`}
                      aria-current={i === index}
                      className={cn(
                        "font-mono text-xs tracking-[0.2em] transition-colors duration-300",
                        i === index ? "text-ink" : "text-ink-faint hover:text-ink-dim"
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
