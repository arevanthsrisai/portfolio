import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * Cursor-reactive ambient light: a soft iris→teal radial that trails the
 * pointer and screen-blends over the atmosphere layer. Fine pointers only;
 * disabled under reduced motion.
 */
export function PointerGlow() {
  const reduce = useReducedMotion();
  const [fine, setFine] = useState(false);
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 110, damping: 26, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 110, damping: 26, mass: 0.7 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFine(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!fine || reduce) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [fine, reduce, x, y]);

  if (!fine || reduce) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[2] h-[34rem] w-[34rem] rounded-full mix-blend-screen"
      style={{
        x: sx,
        y: sy,
        marginLeft: "-17rem",
        marginTop: "-17rem",
        background:
          "radial-gradient(circle, rgba(143,143,248,0.08), rgba(99,217,196,0.045) 42%, transparent 68%)",
      }}
    />
  );
}
