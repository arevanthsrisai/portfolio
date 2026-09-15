import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/* Scrub-linked word reveal — words fade from ghost to full as the block scrolls through. */
export function ScrubText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current!.querySelectorAll("[data-word]"),
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            end: "bottom 45%",
            scrub: true,
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [reduce, text]);

  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} data-word className="inline-block">
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </p>
  );
}

/* Scroll-scrubbed image treatment — scales 0.8 → 1.0 entering, fades to a ghost on exit. */
export function ImageScaleFade({
  src,
  alt = "",
  className,
  imgClassName,
  eager = false,
}: {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        })
        .fromTo(
          imgRef.current,
          { scale: 0.8, opacity: 0.4 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "none" }
        )
        .to(imgRef.current, { opacity: 0.2, duration: 0.5, ease: "none" });
    }, ref);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}
