import {
  useEffect,
  useRef,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { motion, useMotionValue, useSpring, useReducedMotion, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/* --------------------------- Reveal (IO + .is-visible) --------------------------
 * A real IntersectionObserver toggles .is-visible; the fade/slide-up transition
 * (40px) and its stagger delay live in index.css via the global motion tokens.
 * ----------------------------------------------------------------------------- */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -72px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style = { "--reveal-delay": `${Math.round(delay * 1000)}ms` } as CSSProperties;
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} style={style} className={cn("reveal", className)}>
      {children}
    </Tag>
  );
}

/* ----------------------------------- Tilt ----------------------------------
 * Extremely subtle cursor-responsive 3D tilt (±max degrees) with spring
 * interpolation. Disabled on touch/coarse pointers and reduced motion.
 * -------------------------------------------------------------------------- */
export function Tilt({
  children,
  className,
  max = 3,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), {
    stiffness: 160,
    damping: 20,
    mass: 0.6,
  });
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), {
    stiffness: 160,
    damping: 20,
    mass: 0.6,
  });
  const handleMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    if (e.pointerType === "touch") return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
  };
  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------ SectionHeading ----------------------------- */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <p className="eyebrow flex items-center gap-3 text-ink-dim">
        <span aria-hidden className="inline-block h-[2px] w-10 bg-gradient-to-r from-iris to-teal" />
        {eyebrow}
      </p>
      <h2 className="mt-5 font-display text-[clamp(2.75rem,6vw,4.75rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-gradient">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-ink-dim">{description}</p>
      ) : null}
    </Reveal>
  );
}

/* ------------------------------ MagneticButton ----------------------------- */
/* Magnetic pull on pointer move + optional .btn-fill background expansion. */
export function MagneticButton({
  children,
  className,
  onClick,
  href,
  external,
  ariaLabel,
  fill,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  external?: boolean;
  ariaLabel?: string;
  fill?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });
  const reduce = useReducedMotion();
  const handleMove = (e: ReactMouseEvent<HTMLSpanElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.18);
    my.set((e.clientY - rect.top - rect.height / 2) * 0.28);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };
  const inner = (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className="inline-flex"
    >
      {children}
    </motion.span>
  );
  const base = cn(
    "group relative inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 font-display text-sm font-medium tracking-wide btn-fill",
    className
  );
  const fillStyle = fill ? ({ "--fill-color": fill } as CSSProperties) : undefined;
  if (href) {
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        className={base}
        style={fillStyle}
      >
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} aria-label={ariaLabel} className={base} style={fillStyle}>
      {inner}
    </button>
  );
}
