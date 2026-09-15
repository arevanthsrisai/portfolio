import { ArrowUp, Github } from "lucide-react";
import { identity, socials } from "@/data/profile";
import { scrollToSection } from "@/hooks/useLenis";

const sectionLinks = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "now", label: "Now" },
  { id: "education", label: "Journey" },
  { id: "arcade", label: "Arcade" },
  { id: "contact", label: "Contact" },
];

/** Shared site footer — section navigation, socials, and contact. */
export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06]">
      <div className="shell py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <button
              type="button"
              onClick={() => scrollToSection("top")}
              className="group inline-flex items-center gap-3"
              aria-label="Back to top"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl glass">
                <span className="font-display text-sm font-bold text-accent-soft">R</span>
              </span>
              <span className="font-display text-sm font-medium tracking-wide text-ink-dim transition-colors group-hover:text-ink">
                revanth<span className="text-accent">.dev</span>
              </span>
            </button>
            <p className="mt-4 text-sm leading-relaxed text-ink-faint">
              Student. Builder. Agentic Coder. — crafting games, apps, and digital
              experiences from {identity.location}.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <nav aria-label="Footer sections">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">Sections</p>
              <ul className="mt-4 space-y-2.5">
                {sectionLinks.map((l) => (
                  <li key={l.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(l.id)}
                      className="text-sm text-ink-dim transition-colors hover:text-ink"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Footer socials">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">Elsewhere</p>
              <ul className="mt-4 space-y-2.5">
                {socials.map((s) => (
                  <li key={s.id}>
                    {s.href ? (
                      <a
                        href={s.href}
                        target={s.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer noopener"
                        className="text-sm text-ink-dim transition-colors hover:text-ink"
                      >
                        {s.label}
                      </a>
                    ) : (
                      <span className="text-sm text-ink-dim">{s.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">Say hello</p>
              <a
                href={`mailto:${identity.email}`}
                className="mt-4 block break-all text-sm text-ink-dim transition-colors hover:text-ink"
              >
                {identity.email}
              </a>
              <a
                href={identity.github}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-2.5 inline-flex items-center gap-2 text-sm text-ink-dim transition-colors hover:text-ink"
              >
                <Github size={14} aria-hidden /> github / {identity.handle}
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
            © {new Date().getFullYear()} {identity.fullName}
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint">
            {identity.location} · {identity.timezone}
          </p>
          <button
            type="button"
            onClick={() => scrollToSection("top")}
            aria-label="Back to top"
            className="group inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-ink-faint transition-colors hover:text-ink"
          >
            top
            <span
              aria-hidden
              className="grid h-8 w-8 place-items-center rounded-full hairline transition-all duration-300 group-hover:border-white/20 group-hover:text-ink group-hover:shadow-[0_0_24px_-8px_rgba(143,143,248,0.4)]"
            >
              <ArrowUp
                size={13}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
