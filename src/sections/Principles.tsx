import { Gauge, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal, SectionHeading } from "@/components/primitives";

const principles = [
  {
    icon: Gauge,
    title: "Performance first",
    detail:
      "Transforms over paints, capped device pixel ratios, and motion that never fights the main thread. Smooth is a feature.",
  },
  {
    icon: ShieldCheck,
    title: "Security by default",
    detail:
      "Hardened APIs, tamper-evident data, and least-privilege access baked in from the first commit — not bolted on after.",
  },
  {
    icon: Sparkles,
    title: "Detail obsessed",
    detail:
      "The last 5% is the product. Easing curves, focus states, empty states — everything gets the same attention.",
  },
];

export function Principles() {
  return (
    <section id="principles" className="relative py-32 md:py-48">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(48rem,80%)] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
      />
      <div className="shell">
        <SectionHeading
          eyebrow="How I Work"
          title="Three rules I build by."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.1}>
              <div className="glass group h-full rounded-2xl p-7 transition-[background-color,border-color,transform,box-shadow] duration-300 ease-smooth hover:-translate-y-1 hover:border-iris/30 hover:shadow-[0_0_60px_-20px_rgba(143,143,248,0.35)]">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-iris-soft transition-colors duration-300 group-hover:border-iris/40 group-hover:bg-iris/10">
                  <p.icon size={19} strokeWidth={1.7} aria-hidden />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-dim">{p.detail}</p>
                <span
                  aria-hidden
                  className="mt-6 block h-px w-12 bg-gradient-to-r from-iris/60 to-transparent transition-all duration-450 ease-smooth group-hover:w-20"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
