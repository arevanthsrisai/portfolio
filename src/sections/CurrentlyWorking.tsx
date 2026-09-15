import { useEffect, useState } from "react";
import { ImageIcon, Lock, MessageSquare, Mic, Video, Fingerprint } from "lucide-react";
import { currentlyBuilding, type Medium } from "@/data/profile";
import { Reveal, SectionHeading } from "@/components/primitives";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

const MEDIA_ICON: Record<Medium, typeof MessageSquare> = {
  text: MessageSquare,
  image: ImageIcon,
  video: Video,
  voice: Mic,
};

/** Live SHA-256-style hex stream — a small nod to the tamper-evident pipeline. */
function HashStream() {
  const reduce = usePrefersReducedMotion();
  const [hash, setHash] = useState(
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  );

  useEffect(() => {
    if (reduce) return;
    const chars = "0123456789abcdef";
    const id = window.setInterval(() => {
      setHash((prev) => {
        const arr = prev.split("");
        const flips = 3;
        for (let i = 0; i < flips; i++) {
          const idx = Math.floor(Math.random() * arr.length);
          arr[idx] = chars[Math.floor(Math.random() * 16)];
        }
        return arr.join("");
      });
    }, 90);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <p
      aria-hidden
      className="mt-4 break-all font-mono text-[11px] leading-relaxed tracking-[0.14em] text-iris/70 sm:text-xs"
    >
      {hash}
    </p>
  );
}

export function CurrentlyWorking() {
  return (
    <section id="now" className="relative py-32 md:py-48">
      <div aria-hidden className="section-glow [--glow-color:rgba(99,217,196,0.05)]" />
      {/* spotlight ambience */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(48rem,80%)] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[26rem] w-[min(64rem,92%)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(143,143,248,0.07),rgba(99,217,196,0.04)_50%,transparent_70%)] blur-3xl"
      />
      <div className="shell relative">
        <SectionHeading
          eyebrow="Currently Building"
          title={
            <>
              {currentlyBuilding.headline}
              <span className="text-gradient"> Every medium. Zero trust.</span>
            </>
          }
        />

        <Reveal delay={0.15} className="mt-8 max-w-2xl">
          <p className="text-base leading-relaxed text-ink-dim sm:text-lg">
            {currentlyBuilding.description}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-teal/[0.08] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-teal-soft"
              aria-label="Project status: in development"
            >
              <span aria-hidden className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal" />
              </span>
              {currentlyBuilding.status}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-iris/30 bg-iris/[0.08] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-iris-soft">
              <Fingerprint size={12} aria-hidden />
              {currentlyBuilding.name}
            </span>
          </div>
        </Reveal>

        {/* the four media surfaces — staggered grid reveal */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {currentlyBuilding.media.map((m, i) => {
            const Icon = MEDIA_ICON[m.id];
            return (
              <Reveal key={m.id} delay={0.1 + i * 0.09}>
                <div className="glass group h-full rounded-2xl p-6 transition-[background-color,border-color,transform,box-shadow] duration-300 ease-smooth hover:-translate-y-1 hover:border-iris/30 hover:shadow-[0_0_60px_-20px_rgba(143,143,248,0.35)]">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-iris-soft transition-colors duration-300 group-hover:border-iris/40 group-hover:bg-iris/10">
                    <Icon size={19} strokeWidth={1.7} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold tracking-tight text-ink">
                    {m.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-dim">{m.detail}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* security panel */}
        <Reveal delay={0.2} className="mt-6">
          <div className="glass-deep relative overflow-hidden rounded-3xl p-6 sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(143,143,248,0.12),transparent_65%)] blur-2xl"
            />
            <div className="relative grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-center">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-teal/25 bg-teal/[0.08] text-teal-soft">
                  <Lock size={20} strokeWidth={1.7} aria-hidden />
                </span>
                <div>
                  <p className="font-display text-lg font-semibold text-ink">
                    100% secure by design
                  </p>
                  <p className="mt-1 text-sm text-ink-dim">
                    Sealed on-device, fingerprinted, and verified on arrival.
                  </p>
                  <HashStream />
                </div>
              </div>
              <ul className="grid gap-2.5 sm:grid-cols-2" aria-label="Security guarantees">
                {currentlyBuilding.security.map((s, i) => (
                  <Reveal
                    key={s}
                    as="li"
                    delay={i * 0.07}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-[13px] text-ink-dim",
                      "hover:border-teal/30 hover:text-ink"
                    )}
                  >
                    <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal/80" />
                    {s}
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
