import { GraduationCap, MapPin } from "lucide-react";
import { identity, stats, toolbox } from "@/data/profile";
import { Reveal, SectionHeading } from "@/components/primitives";
import { ScrubText } from "@/components/scroll-fx";
import { cn } from "@/lib/utils";

export function About() {
  return (
    <section id="about" className="relative py-32 md:py-48">
      <div aria-hidden className="section-glow [--glow-color:rgba(143,143,248,0.06)]" />
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="About"
              title={
                <>
                  Code, craft, and an
                  <br />
                  unreasonable amount
                  <br />
                  of polish.
                </>
              }
            />
            <div className="mt-8 space-y-5 text-base leading-relaxed text-ink-dim">
              <ScrubText text={identity.bio[1]} />
              <ScrubText text={identity.bio[2]} />
            </div>
            <Reveal delay={0.25} className="mt-10">
              <div className="glass rounded-2xl p-6 hover:border-iris/30">
                <div className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-iris/10 text-iris-soft">
                    <GraduationCap size={18} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="font-display text-sm font-medium text-ink">{identity.degree}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-dim">
                      <MapPin size={13} className="text-ink-faint" />
                      {identity.school}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
          <div className="lg:pt-24">
            <Reveal delay={0.1}>
              <p className="eyebrow">Toolbox</p>
              <p className="mt-3 text-sm text-ink-faint">
                Things I reach for when building.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-6">
              <ul className="flex flex-wrap gap-2.5" aria-label="Technologies">
                {toolbox.map((t, i) => (
                  <Reveal
                    key={t}
                    as="li"
                    delay={i * 0.06}
                    className="group cursor-default rounded-full glass px-4 py-2 font-mono text-[13px] text-ink-dim hover:border-iris/40 hover:bg-iris/[0.06] hover:text-ink"
                  >
                    <span className="mr-2 text-iris/70 transition-colors duration-300 group-hover:text-iris">/</span>
                    {t}
                  </Reveal>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.3} className="mt-12">
              <div className="grid grid-flow-row-dense grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((s, i) => (
                  <Reveal
                    key={s.label}
                    delay={i * 0.08}
                    className="glass rounded-2xl p-4 text-center hover:border-teal/30"
                  >
                    <p className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-[1.7rem]">
                      {s.value}
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-faint">
                      {s.label}
                    </p>
                  </Reveal>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.4} className="mt-12">
              <div className={cn("hairline relative overflow-hidden rounded-2xl p-6")}>
                <div
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-teal/50 to-transparent"
                />
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint">
                  Currently
                </p>
                <p className="mt-3 font-display text-lg font-medium leading-snug text-ink">
                  Studying computer science, building with agentic workflows, and
                  shipping things that feel finished.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
