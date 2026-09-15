import { useState, type KeyboardEvent } from "react";
import { Award, GraduationCap, Star } from "lucide-react";
import { achievements, type Achievement } from "@/data/profile";
import { Reveal, SectionHeading } from "@/components/primitives";
import { cn } from "@/lib/utils";

type Accent = "iris" | "teal" | "amber";
type IconName = "award" | "star" | "cap";

const ICONS: Record<IconName, typeof Award> = {
  award: Award,
  star: Star,
  cap: GraduationCap,
};

const ACCENT_TEXT: Record<Accent, string> = {
  iris: "text-iris-soft",
  teal: "text-teal-soft",
  amber: "text-amber-soft",
};

const ACCENT_BORDER: Record<Accent, string> = {
  iris: "border-iris/40",
  teal: "border-teal/40",
  amber: "border-amber/40",
};

function AchievementSlice({
  item,
  index,
  active,
  onActivate,
}: {
  item: Achievement;
  index: number;
  active: boolean;
  onActivate: () => void;
}) {
  const Icon = ICONS[item.icon];
  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onActivate();
    }
  };
  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={active}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      onKeyDown={handleKey}
      style={{ flexGrow: active ? 3.2 : 1 }}
      className={cn(
        "group relative min-w-0 cursor-pointer overflow-hidden rounded-2xl border bg-base-800 transition-[flex-grow,border-color] duration-[600ms] ease-expo md:basis-0",
        active ? ACCENT_BORDER[item.accent] : "border-white/10"
      )}
    >
      <img
        src={item.image}
        alt=""
        loading="lazy"
        className={cn(
          "absolute inset-0 h-full w-full object-cover saturate-[0.85] transition-[opacity,filter] duration-700 group-hover:saturate-[1.25]",
          item.imgPos,
          active ? "opacity-60" : "opacity-40"
        )}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10"
      />
      <div
        aria-hidden
        className={cn(
          "absolute bottom-0 left-0 hidden items-end gap-3 p-6 transition-opacity duration-500 md:flex",
          active ? "opacity-0" : "opacity-100"
        )}
      >
        <span className={cn("font-mono text-xs tracking-[0.25em]", ACCENT_TEXT[item.accent])}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          style={{ writingMode: "vertical-rl" }}
          className="rotate-180 font-display text-xl font-semibold tracking-tight text-white/90"
        >
          {item.title}
        </span>
      </div>
      <div
        className={cn(
          "relative flex h-full flex-col justify-end p-6 transition-opacity duration-500 md:p-8",
          active ? "opacity-100 md:delay-150" : "opacity-100 md:opacity-0"
        )}
      >
        <span className={cn("font-mono text-xs tracking-[0.25em]", ACCENT_TEXT[item.accent])}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-ink md:text-2xl">
          {item.title}
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">{item.detail}</p>
        <span className="mt-5 grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-white/80">
          <Icon size={18} strokeWidth={1.6} aria-hidden />
        </span>
      </div>
    </div>
  );
}

export function Achievements() {
  const [active, setActive] = useState(0);
  return (
    <section id="achievements" className="relative py-32 md:py-48">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(48rem,80%)] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
      />
      <div className="shell">
        <SectionHeading
          eyebrow="Achievements"
          title="Moments worth marking."
          description="Recognition and milestones along the way."
        />
        <Reveal className="mt-14" delay={0.1}>
          <div className="flex h-auto flex-col gap-3 md:h-[480px] md:flex-row">
            {achievements.map((item, i) => (
              <AchievementSlice
                key={item.title}
                item={item}
                index={i}
                active={active === i}
                onActivate={() => setActive(i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Achievements;
