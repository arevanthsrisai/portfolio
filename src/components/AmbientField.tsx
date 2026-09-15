import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
type Particle = {
  x: number;
  y: number;
  z: number;
  r: number;
  vx: number;
  vy: number;
  hue: number;
  tw: number;
};
/**
 * Layered atmospheric canvas: slow-drifting depth particles + a faint horizon
 * scan. Deliberately lightweight (2D canvas, ~70 particles, capped DPR).
 */
export function AmbientField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = usePrefersReducedMotion();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = 0;
    let height = 0;
    let raf = 0;
    let particles: Particle[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const seed = () => {
      const count = Math.min(70, Math.floor((width * height) / 22000));
      particles = Array.from({ length: count }, () => {
        const z = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          z,
          r: 0.6 + z * 1.8,
          vx: (Math.random() - 0.5) * 0.12 * (0.4 + z),
          vy: -0.04 - z * 0.16,
          hue: Math.random() > 0.82 ? 166 : 238,
          tw: Math.random() * Math.PI * 2,
        };
      });
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduce) draw(0);
    };
    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      // drifting particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.008;
        if (p.y < -8) {
          p.y = height + 8;
          p.x = Math.random() * width;
        }
        if (p.x < -8) p.x = width + 8;
        if (p.x > width + 8) p.x = -8;
        const alpha = 0.10 + p.z * 0.28 + Math.sin(p.tw) * 0.06;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle =
          p.hue === 166
            ? `rgba(99, 217, 196, ${Math.max(0, alpha)})`
            : `rgba(182, 185, 255, ${Math.max(0, alpha)})`;
        ctx.fill();
      }
      // horizon scan line
      const scanY = height * 0.72 + Math.sin(t * 0.00022) * height * 0.04;
      const grad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      grad.addColorStop(0, "rgba(143, 143, 248, 0)");
      grad.addColorStop(0.5, "rgba(143, 143, 248, 0.05)");
      grad.addColorStop(1, "rgba(143, 143, 248, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 40, width, 80);
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener("resize", resize);
    if (!reduce) {
      raf = requestAnimationFrame(draw);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduce]);
  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
