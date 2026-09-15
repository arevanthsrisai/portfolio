import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { projects, type Project } from "@/data/profile";
import { Reveal, SectionHeading, Tilt } from "@/components/primitives";
import { cn } from "@/lib/utils";

type Accent = "iris" | "teal" | "amber";

/* Per-accent lighting. All class strings are complete literals so the Tailwind
   scanner sees them. The article IS the group, so its own effects use
   hover:/focus-within: (group-hover: would never match on a self-referencing
   group); everything inside the card uses group-hover:/group-focus-within:. */
const ACCENT: Record<
  Accent,
  {
    card: string;
    glow: string;
    ring: string;
    panel: string;
    wash: string;
    numeral: string;
    chip: string;
    text: string;
    tag: string;
    divider: string;
  }
> = {
  iris: {
    card: "hover:border-iris/40 focus-within:border-iris/40",
    glow:
      "hover:shadow-[0_0_110px_-18px_rgba(143,143,248,0.5),0_30px_70px_-30px_rgba(0,0,0,0.9)] focus-within:shadow-[0_0_110px_-18px_rgba(143,143,248,0.5),0_30px_70px_-30px_rgba(0,0,0,0.9)]",
    ring:
      "[background-image:linear-gradient(140deg,rgba(143,143,248,0.7),rgba(143,143,248,0)_36%,rgba(143,143,248,0)_64%,rgba(143,143,248,0.35))]",
    panel:
      "bg-[radial-gradient(120%_120%_at_20%_0%,rgba(143,143,248,0.18),rgba(20,22,38,0.55)_55%,rgba(8,9,15,0.92))]",
    wash:
      "bg-[radial-gradient(120%_90%_at_18%_100%,rgba(143,143,248,0.28),transparent_60%)]",
    numeral:
      "text-iris/[0.08] group-hover:text-iris/[0.15] group-focus-within:text-iris/[0.15]",
    chip:
      "group-hover:border-iris/30 group-hover:bg-iris/15 group-hover:text-iris-soft group-focus-within:border-iris/30 group-focus-within:bg-iris/15 group-focus-within:text-iris-soft",
    text: "group-hover:text-iris-soft",
    tag: "group-hover:border-iris/40 group-hover:text-iris-soft",
    divider: "group-hover:border-iris/25",
  },
  teal: {
    card: "hover:border-teal/40 focus-within:border-teal/40",
    glow:
      "hover:shadow-[0_0_110px_-18px_rgba(99,217,196,0.45),0_30px_70px_-30px_rgba(0,0,0,0.9)] focus-within:shadow-[0_0_110px_-18px_rgba(99,217,196,0.45),0_30px_70px_-30px_rgba(0,0,0,0.9)]",
    ring:
      "[background-image:linear-gradient(140deg,rgba(99,217,196,0.65),rgba(99,217,196,0)_36%,rgba(99,217,196,0)_64%,rgba(99,217,196,0.32))]",
    panel:
      "bg-[radial-gradient(120%_120%_at_80%_0%,rgba(99,217,196,0.16),rgba(16,26,30,0.55)_55%,rgba(8,9,15,0.92))]",
    wash:
      "bg-[radial-gradient(120%_90%_at_82%_100%,rgba(99,217,196,0.24),transparent_60%)]",
    numeral:
      "text-teal/[0.08] group-hover:text-teal/[0.15] group-focus-within:text-teal/[0.15]",
    chip:
      "group-hover:border-teal/30 group-hover:bg-teal/15 group-hover:text-teal-soft group-focus-within:border-teal/30 group-focus-within:bg-teal/15 group-focus-within:text-teal-soft",
    text: "group-hover:text-teal-soft",
    tag: "group-hover:border-teal/40 group-hover:text-teal-soft",
    divider: "group-hover:border-teal/25",
  },
  amber: {
    card: "hover:border-amber/40 focus-within:border-amber/40",
    glow:
      "hover:shadow-[0_0_110px_-18px_rgba(236,194,124,0.42),0_30px_70px_-30px_rgba(0,0,0,0.9)] focus-within:shadow-[0_0_110px_-18px_rgba(236,194,124,0.42),0_30px_70px_-30px_rgba(0,0,0,0.9)]",
    ring:
      "[background-image:linear-gradient(140deg,rgba(236,194,124,0.6),rgba(236,194,124,0)_36%,rgba(236,194,124,0)_64%,rgba(236,194,124,0.3))]",
    panel:
      "bg-[radial-gradient(120%_120%_at_50%_0%,rgba(236,194,124,0.14),rgba(28,24,16,0.55)_55%,rgba(8,9,15,0.92))]",
    wash:
      "bg-[radial-gradient(120%_90%_at_50%_100%,rgba(236,194,124,0.22),transparent_60%)]",
    numeral:
      "text-amber/[0.08] group-hover:text-amber/[0.15] group-focus-within:text-amber/[0.15]",
    chip:
      "group-hover:border-amber/30 group-hover:bg-amber/15 group-hover:text-amber-soft group-focus-within:border-amber/30 group-focus-within:bg-amber/15 group-focus-within:text-amber-soft",
    text: "group-hover:text-amber-soft",
    tag: "group-hover:border-amber/40 group-hover:text-amber-soft",
    divider: "group-hover:border-amber/25",
  },
};

/* Per-image crop + filter treatment, local to this section (overrides the
   profile.ts imgPos/imgFilter defaults — see handoff notes). Dark imagery sits
   larger and moodier; the bright UI screenshot stays top-anchored and dimmed. */
const MEDIA: Record<Accent, { pos: string; filter: string }> = {
  teal: {
    pos: "object-center",
    filter:
      "opacity-70 brightness-110 contrast-[1.06] group-hover:opacity-90 group-hover:brightness-125 group-focus-within:opacity-90 group-focus-within:brightness-125",
  },
  iris: {
    pos: "object-top",
    filter:
      "opacity-40 grayscale-[0.45] group-hover:opacity-55 group-hover:grayscale-0 group-focus-within:opacity-55 group-focus-within:grayscale-0",
  },
  amber: {
    pos: "object-[50%_12%]",
    filter:
      "opacity-65 brightness-110 contrast-[1.05] group-hover:opacity-90 group-hover:brightness-125 group-focus-within:opacity-90 group-focus-within:brightness-125",
  },
};

const RING_MASK = [
  "[mask-image:linear-gradient(#fff,#fff),linear-gradient(#fff,#fff)]",
  "[mask-clip:content-box,border-box]",
  "[mask-composite:exclude]",
  "[-webkit-mask-image:linear-gradient(#fff,#fff),linear-gradient(#fff,#fff)]",
  "[-webkit-mask-clip:content-box,border-box]",
  "[-webkit-mask-composite:xor]",
].join(" ");

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const a = ACCENT[project.accent];
  const m = MEDIA[project.accent];
  const featured = index === 2;

  return (
    <Reveal
      delay={(index % 2) * 0.12}
      className={cn(featured && "lg:col-span-2", index === 1 && "lg:mt-16")}
    >
      <Tilt max={featured ? 2.5 : 3.5} className="[transform-style:preserve-3d]">
        <article
          className={cn(
            "group relative block overflow-hidden rounded-3xl glass",
            "shadow-[0_18px_50px_-28px_rgba(0,0,0,0.9)]",
            "transition-[background-color,border-color,transform,box-shadow] duration-500 ease-smooth",
            "hover:bg-white/[0.05]",
            "hover:[transform:translateY(-6px)_translateZ(16px)] focus-within:[transform:translateY(-6px)_translateZ(16px)]",
            a.card,
            a.glow
          )}
        >
          {/* stretched link — the whole card opens the code repo */}
          <a
            href={project.code}
            target="_blank"
            rel="noreferrer noopener"
            className="after:absolute after:inset-0 after:content-['']"
            aria-label={`${project.name} — open the code on GitHub`}
          />

          {/* visual panel — aspect-driven, imagery dominates the card */}
          <div
            className={cn(
              "relative overflow-hidden",
              featured
                ? "aspect-[16/11] sm:aspect-[16/9] lg:aspect-[21/9]"
                : "aspect-[4/3] sm:aspect-[16/11]"
            )}
          >
            {/* ambient accent floor behind the media */}
            <div aria-hidden className={cn("absolute inset-0", a.panel)} />

            {/* media layer — slow scale drift on hover */}
            <div
              className={cn(
                "absolute inset-0 transition-transform duration-700 ease-smooth will-change-transform",
                "group-hover:scale-[1.05] group-focus-within:scale-[1.05]"
              )}
            >
              <img
                src={project.image}
                alt=""
                loading="lazy"
                decoding="async"
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-[opacity,filter] duration-500 ease-smooth",
                  m.pos,
                  m.filter
                )}
              />
            </div>

            {/* scrims — top for the chip, bottom for depth/mood */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(to_bottom,rgba(5,6,10,0.4),transparent)]"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(to_top,rgba(5,6,10,0.55),transparent)]"
            />
            {/* faint grid inside the visual */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.25] [background-image:linear-gradient(rgba(255,255,255,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.28)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_30%,black,transparent_80%)]"
            />
            {/* accent wash — emerges on hover/keyboard focus */}
            <div
              aria-hidden
              className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-500 ease-smooth group-hover:opacity-100 group-focus-within:opacity-100",
                a.wash
              )}
            />
            {/* ghost numeral */}
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute -right-2 bottom-0 select-none font-display font-bold leading-none tracking-tighter transition-all duration-700 ease-smooth group-hover:-translate-y-2 group-focus-within:-translate-y-2",
                featured ? "text-[8rem] sm:text-[11rem]" : "text-[6.5rem] sm:text-[8rem]",
                a.numeral
              )}
            >
              {project.index}
            </span>
            <span
              className={cn(
                "absolute left-5 top-5 rounded-full border border-white/[0.08] bg-base-950/60 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-dim backdrop-blur transition-colors duration-500 ease-smooth sm:left-6 sm:top-6",
                a.chip
              )}
            >
              {project.kind}
            </span>
          </div>

          {/* content — text lifts slightly on hover */}
          <div className={cn("relative", featured ? "p-7 sm:p-10" : "p-6 sm:p-8")}>
            <div
              className={cn(
                "transition-transform duration-500 ease-smooth group-hover:-translate-y-1.5 group-focus-within:-translate-y-1.5",
                featured && "lg:flex lg:items-end lg:justify-between lg:gap-14"
              )}
            >
              <div className={featured ? "lg:max-w-2xl" : undefined}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3
                    className={cn(
                      "font-display font-semibold tracking-tight text-ink",
                      featured ? "text-3xl lg:text-4xl" : "text-2xl"
                    )}
                  >
                    {project.name}
                  </h3>
                  <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-faint">
                    {project.year}
                  </span>
                </div>
                <p
                  className={cn(
                    "leading-relaxed text-ink-dim",
                    featured ? "mt-5 text-[15px] sm:text-base" : "mt-4 text-[15px]"
                  )}
                >
                  {project.description}
                </p>
              </div>

              <div
                className={cn(
                  "mt-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-white/[0.06] pt-5 transition-colors duration-500 ease-smooth",
                  a.divider,
                  featured &&
                    "lg:mt-0 lg:w-auto lg:flex-none lg:flex-col lg:items-end lg:gap-6 lg:border-0 lg:pt-0"
                )}
              >
                <ul className="flex flex-wrap gap-2" aria-label={`${project.name} tags`}>
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className={cn(
                        "rounded-full border border-white/[0.07] px-3 py-1 font-mono text-[11px] text-ink-faint transition-[border-color,color] duration-500 ease-smooth",
                        a.tag
                      )}
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <span className="relative z-10 inline-flex items-center gap-4">
                  <a
                    href={project.code}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={cn(
                      "inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint transition-colors duration-300",
                      a.text
                    )}
                    aria-hidden
                    tabIndex={-1}
                  >
                    <Github size={13} strokeWidth={1.8} aria-hidden />
                    code
                  </a>
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={cn(
                      "inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint transition-colors duration-300",
                      a.text
                    )}
                    aria-label={`${project.name} — open the live project`}
                  >
                    <ExternalLink size={13} strokeWidth={1.8} aria-hidden />
                    live
                  </a>
                  <span
                    className={cn(
                      "hidden h-9 w-9 place-items-center rounded-full hairline text-ink-dim transition-all duration-500 ease-smooth group-hover:rotate-45 group-focus-within:rotate-45 sm:grid",
                      a.tag
                    )}
                    aria-hidden
                  >
                    <ArrowUpRight size={15} strokeWidth={1.6} />
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* illuminated accent border — gradient ring, emerges on hover/focus */}
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 rounded-3xl p-px opacity-0 transition-opacity duration-500 ease-smooth group-hover:opacity-100 group-focus-within:opacity-100",
              RING_MASK,
              a.ring
            )}
          />
        </article>
      </Tilt>
    </Reveal>
  );
}

export function Projects() {
  return (
    <section id="work" className="relative py-32 md:py-48">
      {/* section ambient */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(48rem,80%)] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 h-72 w-[min(60rem,90%)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(143,143,248,0.05),transparent_65%)] blur-3xl"
      />
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Selected Work"
            title={
              <>
                Things I've built
                <br />
                and shipped.
              </>
            }
          />
          <Reveal delay={0.2}>
            <p className="max-w-xs text-sm leading-relaxed text-ink-faint">
              Three builds that define the current arc — seeing in the dark,
              speaking freely, and making dense dashboards feel effortless.
            </p>
          </Reveal>
        </div>
        <div className="mt-16 grid gap-6 sm:gap-8 lg:mt-24 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-14">
          {projects.map((p, i) => (
            <ProjectCard key={p.name} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
