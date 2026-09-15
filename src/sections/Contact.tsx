import { useState } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Youtube,
} from "lucide-react";
import { identity, socials, type Social } from "@/data/profile";
import { MagneticButton, Reveal } from "@/components/primitives";
import { cn } from "@/lib/utils";

const ICONS: Record<Social["id"], typeof Mail> = {
  email: Mail,
  discord: MessageCircle,
  github: Github,
  linkedin: Linkedin,
  youtube: Youtube,
};

type CopiedKey = Social["id"] | null;

export function Contact() {
  const [copied, setCopied] = useState<CopiedKey>(null);
  const copy = async (key: Exclude<CopiedKey, null>, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  };

  const rowClass =
    "group relative flex w-full items-center gap-4 px-5 py-4 text-left transition-all duration-300 ease-smooth hover:bg-white/[0.04] hover:shadow-[0_0_50px_-18px_rgba(143,143,248,0.35)] sm:gap-5 sm:px-7 sm:py-5";
  const plateClass =
    "grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-ink-dim transition-colors duration-300 group-hover:border-iris/40 group-hover:bg-iris/10 group-hover:text-iris-soft";
  const labelClass =
    "block font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint";
  const valueClass = "mt-0.5 block truncate text-sm text-ink";

  return (
    <section id="contact" className="relative overflow-hidden pb-28 pt-28 sm:pb-36 sm:pt-36">
      <div aria-hidden className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_110%,rgba(143,143,248,0.12),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_38%_at_50%_115%,rgba(99,217,196,0.07),transparent_70%)]" />
      </div>
      <div className="shell relative">
        <Reveal>
          <p className="eyebrow flex items-center gap-3">
            <span aria-hidden className="inline-block h-px w-8 bg-accent/50" />
            Contact
          </p>
          <h2 className="mt-6 max-w-3xl font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl lg:text-6xl lg:leading-[1.05]">
            Let's build something
            <span className="text-gradient"> worth shipping.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink-dim">
            The inbox is always open — an email, a Discord ping, or a GitHub issue,
            whatever feels natural.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-10">
          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton
              href={`mailto:${identity.email}`}
              className="bg-ink text-base-950 hover:bg-white"
              ariaLabel={`Send an email to ${identity.email}`}
            >
              <Mail size={15} aria-hidden />
              say hello
              <ArrowUpRight
                size={14}
                className="opacity-60 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden
              />
            </MagneticButton>
            <MagneticButton
              onClick={() => copy("email", identity.email)}
              className="glass text-ink hover:border-white/20"
              ariaLabel="Copy email address"
            >
              {copied === "email" ? (
                <Check size={15} className="text-mint" aria-hidden />
              ) : (
                <Copy size={15} aria-hidden />
              )}
              {copied === "email" ? "copied" : "copy email"}
            </MagneticButton>
          </div>
        </Reveal>

        {/* every handle, one list */}
        <Reveal delay={0.3} className="mt-14 max-w-xl">
          <div className="glass-deep overflow-hidden rounded-2xl">
            {socials.map((s, i) => {
              const Icon = ICONS[s.id];
              const isLast = i === socials.length - 1;
              const inner = (
                <>
                  <span className={plateClass} aria-hidden>
                    <Icon size={17} strokeWidth={1.7} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={labelClass}>{s.label}</span>
                    <span className={valueClass}>{s.display}</span>
                  </span>
                  <span aria-hidden className="text-ink-faint transition-colors duration-300 group-hover:text-ink">
                    {s.copyable ? (
                      copied === s.id ? (
                        <Check size={15} className="text-mint" />
                      ) : (
                        <Copy size={15} />
                      )
                    ) : (
                      <ArrowUpRight size={15} />
                    )}
                  </span>
                </>
              );
              const className = cn(rowClass, !isLast && "border-b border-white/[0.06]");
              if (s.copyable) {
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => copy(s.id, s.display)}
                    className={className}
                    aria-label={`Copy ${s.label} handle ${s.display}`}
                  >
                    {inner}
                  </button>
                );
              }
              return (
                <a
                  key={s.id}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer noopener"
                  className={className}
                  aria-label={`Open ${s.label} — ${s.display}`}
                >
                  {inner}
                </a>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
