import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, Github } from "lucide-react";
import { identity } from "@/data/profile";
import { AmbientField } from "@/components/AmbientField";
import { MagneticButton } from "@/components/primitives";
import { ImageScaleFade } from "@/components/scroll-fx";
import { scrollToSection } from "@/hooks/useLenis";
import { useEffect, useRef } from "react";

/* Signature premium curve — mirrors --ease-out-quart / --transition-smooth in index.css */
const smooth = [0.25, 1, 0.5, 1] as const;
const LINE_BASE_DELAY = 0.25;
const LINE_STAGGER = 0.1; // 100ms per header line

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const afterLines = LINE_BASE_DELAY + identity.tagline.length * LINE_STAGGER;
  /* pointer parallax on the atmosphere orbs — depth without noise */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const nx = useSpring(px, { stiffness: 60, damping: 20, mass: 0.8 });
  const ny = useSpring(py, { stiffness: 60, damping: 20, mass: 0.8 });
  const orbAX = useTransform(nx, [-1, 1], [14, -14]);
  const orbAY = useTransform(ny, [-1, 1], [10, -10]);
  const orbBX = useTransform(nx, [-1, 1], [-10, 10]);
  const orbBY = useTransform(ny, [-1, 1], [-8, 8]);
  /* floating image counter-drifts against the orbs — the asymmetry breathes */
  const imgX = useTransform(nx, [-1, 1], [-16, 16]);
  const imgY = useTransform(ny, [-1, 1], [-12, 12]);
  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, px, py]);
  return (
    <section ref={ref} id="top" className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* atmosphere */}
      <div aria-hidden className="absolute inset-0">
        <motion.div
          style={{ x: orbAX, y: orbAY }}
          className="absolute -inset-4 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(143,143,248,0.14),transparent_60%)]"
        />
        <motion.div
          style={{ x: orbBX, y: orbBY }}
          className="absolute -inset-4 bg-[radial-gradient(ellipse_50%_40%_at_85%_80%,rgba(99,217,196,0.05),transparent_65%)]"
        />
        <AmbientField className="absolute inset-0 h-full w-full" />
        {/* faint grid */}
        <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_60%_55%_at_50%_40%,black,transparent_75%)]" />
        {/* bottom fade into page */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-base-950 to-transparent" />
      </div>
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="shell relative z-10 pt-28 pb-24"
      >
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: smooth }}
          className="eyebrow flex items-center gap-3"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal/60 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-teal/80" />
          </span>
          {identity.degree} — Amrita Amaravati
        </motion.p>
        <h1 className="mt-8 max-w-3xl font-display font-semibold tracking-[-0.03em]">
          {identity.tagline.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                initial={reduce ? false : { y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.9,
                  delay: LINE_BASE_DELAY + i * LINE_STAGGER,
                  ease: smooth,
                }}
                className={
                  i === identity.tagline.length - 1
                    ? "block text-[clamp(3rem,6vw,5.75rem)] leading-[1.02] text-gradient"
                    : "block text-[clamp(3rem,6vw,5.75rem)] leading-[1.02] text-ink/90"
                }
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        {/* subtext + CTAs: fade in with a subtle 30px vertical translation */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: afterLines, ease: smooth }}
          className="mt-8 max-w-xl text-base leading-relaxed text-ink-dim sm:text-lg"
        >
          {identity.bio[0]}
        </motion.p>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: afterLines + 0.12, ease: smooth }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticButton
            onClick={() => scrollToSection("work")}
            className="bg-ink text-base-950"
            fill="#b6b9ff"
            ariaLabel="View selected work"
          >
            View selected work
            <ArrowDown size={15} className="transition-transform duration-300 ease-smooth group-hover:translate-y-0.5" />
          </MagneticButton>
          <MagneticButton
            href={identity.github}
            external
            className="glass text-ink hover:border-white/20"
            ariaLabel="Open GitHub profile"
          >
            <Github size={15} />
            github / {identity.handle}
          </MagneticButton>
        </motion.div>
      </motion.div>
      {/* floating image — artistic asymmetry, overlapping from the bottom right */}
      <motion.div
        style={{ x: imgX, y: imgY }}
        className="absolute bottom-10 right-[4%] z-[5] hidden w-[21rem] xl:block xl:w-[25rem]"
      >
        <div className="-rotate-2 rounded-3xl hairline p-1.5">
          <ImageScaleFade
            src="/assets/me.jpg"
            alt="Revanth"
            eager
            className="aspect-[9/11] rounded-2xl"
            imgClassName="object-[50%_30%] grayscale-[0.15] contrast-125"
          />
        </div>
      </motion.div>
      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        aria-hidden
      >
        <div className="flex h-12 w-7 items-start justify-center rounded-full hairline p-2">
          <motion.span
            animate={reduce ? {} : { y: [0, 14, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-iris-soft"
          />
        </div>
      </motion.div>
    </section>
  );
}
