import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { academics, education, type TimelineEntry } from "@/data/profile";
import { Reveal, SectionHeading } from "@/components/primitives";
import { cn } from "@/lib/utils";
type Accent = "iris" | "teal" | "amber";
const ACCENT: Record<Accent, { node: string; dot: string; score: string; period: string; glow: string; border: string }> = {
  iris: {
    node: "border-iris/50",
    dot: "bg-iris-soft",
    score: "text-iris-soft",
    period: "text-iris/80",
    glow: "bg-[radial-gradient(circle,rgba(143,143,248,0.09),transparent_65%)]",
    border: "hover:border-iris/25",
  },
  teal: {
    node: "border-teal/50",
    dot: "bg-teal-soft",
    score: "text-teal-soft",
    period: "text-teal/80",
    glow: "bg-[radial-gradient(circle,rgba(99,217,196,0.07),transparent_65%)]",
    border: "hover:border-teal/25",
  },
  amber: {
    node: "border-amber/50",
    dot: "bg-amber-soft",
    score: "text-amber-soft",
    period: "text-amber/80",
    glow: "bg-[radial-gradient(circle,rgba(236,194,124,0.09),transparent_65%)]",
    border: "hover:border-amber/25",
  },
};
function TimelineCard({ entry }: { entry: TimelineEntry }) {
  const a = ACCENT[entry.accent];
  const [open, setOpen] = useState(false);
  return (
    <article
      className={cn(
        "glass group relative mt-4 overflow-hidden rounded-2xl p-6 transition-all duration-500 sm:p-8",
        a.border,
        "hover:-translate-y-0.5"
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          a.glow
        )}
      />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {entry.title}
          </h3>
          <p className="mt-1.5 text-sm font-medium text-ink-dim">{entry.credential}</p>
          <p className="mt-1 text-[13px] text-ink-faint">{entry.place}</p>
        </div>
        <p
          className={cn("font-mono text-sm font-medium tracking-[0.12em]", a.score)}
          aria-label={`Score: ${entry.score}`}
        >
          {entry.score}
        </p>
      </div>
      {entry.current ? (
        <div className="relative mt-5">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="semester-breakdown"
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5",
              "font-mono text-[10px] uppercase tracking-[0.22em] text-ink-dim",
              "transition-colors duration-300 ease-smooth hover:border-iris/40 hover:bg-iris/[0.08] hover:text-iris-soft",
              "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-iris/60"
            )}
          >
            Semester breakdown
            <ChevronDown
              size={13}
              strokeWidth={1.8}
              aria-hidden
              className={cn(
                "transition-transform duration-450 ease-smooth",
                open && "rotate-180"
              )}
            />
          </button>
          <div
            id="semester-breakdown"
            className={cn(
              "grid transition-[grid-template-rows] duration-450 ease-smooth",
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[13px] font-medium text-ink-dim">
                    SGPA
                  </span>
                  <span className="font-mono text-base font-semibold tracking-[0.08em] text-iris-soft">
                    {academics.cgpa}
                  </span>
                </div>
                <div className="mt-3 space-y-2.5 border-t border-white/[0.06] pt-3">
                  {academics.semesters.map((s) => (
                    <div key={s.term} className="flex items-center justify-between gap-2">
                      <span className="text-[13px] text-ink-faint">{s.term}</span>
                      <span className="font-mono text-sm tracking-[0.08em] text-ink-dim">
                        SGPA {s.sgpa}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
export function Education() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.8", "end 0.55"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  return (
    <section id="education" className="relative py-32 md:py-48">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(48rem,80%)] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
      />
      <div className="shell">
        <SectionHeading
          eyebrow="Education"
          title="The path so far."
          description="Formal study backing the building."
        />
        <div className="relative mt-16">
          {/* spine — track + scroll-linked fill */}
          <div
            aria-hidden
            className="absolute bottom-2 left-[7px] top-2 w-px bg-white/[0.07] sm:left-[9px]"
          />
          {reduce ? (
            <div
              aria-hidden
              className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-iris/50 via-amber/40 to-transparent sm:left-[9px]"
            />
          ) : (
            <motion.div
              aria-hidden
              style={{ scaleY: progress }}
              className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-iris via-amber to-amber/30 sm:left-[9px]"
            />
          )}
          <ol ref={listRef} className="space-y-12">
            {education.map((entry, i) => {
              const a = ACCENT[entry.accent];
              return (
                <li key={entry.title} className="relative pl-10 sm:pl-14">
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    aria-hidden
                    className={cn(
                      "absolute left-0 top-1.5 grid h-[15px] w-[15px] place-items-center rounded-full border bg-base-900 sm:h-[19px] sm:w-[19px]",
                      a.node
                    )}
                  >
                    <span className={cn("h-[5px] w-[5px] rounded-full", a.dot)} />
                  </motion.span>
                  <Reveal delay={0.1 + i * 0.08}>
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                      <p className={cn("font-mono text-[11px] uppercase tracking-[0.3em]", a.period)}>
                        {entry.period}
                      </p>
                      {entry.current ? (
                        <span
                          className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/[0.08] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-teal-soft"
                          aria-label="Currently studying here"
                        >
                          <span aria-hidden className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal" />
                          </span>
                          Current
                        </span>
                      ) : null}
                    </div>
                    <TimelineCard entry={entry} />
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
