import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X, Github } from "lucide-react";
import { scrollToSection, getLenis } from "@/hooks/useLenis";
import { cn } from "@/lib/utils";

const links = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "now", label: "Now" },
  { id: "education", label: "Journey" },
  { id: "arcade", label: "Arcade" },
  { id: "contact", label: "Contact" },
];

/** Section whose top has most recently crossed the 40% viewport line. */
function activeSection(): string {
  const marker = window.innerHeight * 0.4;
  let current = "top";
  for (const { id } of links) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= marker) current = id;
  }
  // pin Contact once the page bottom is reached (short final section)
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    current = "contact";
  }
  return current;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        setActive(activeSection());
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) getLenis()?.stop();
    else getLenis()?.start();
    return () => {
      document.documentElement.style.overflow = "";
      getLenis()?.start();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-5 transition-all duration-500 ease-smooth sm:px-8",
            scrolled && "mt-3 max-w-4xl rounded-full glass-deep shadow-[0_18px_50px_-20px_rgb(0_0_0/0.8)]"
          )}
        >
          <button
            type="button"
            onClick={() => go("top")}
            className="group flex items-center gap-3"
            aria-label="Back to top"
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-xl glass">
              <span className="font-display text-sm font-bold text-iris-soft">R</span>
              <span className="absolute inset-0 rounded-xl bg-iris/10 opacity-0 transition-opacity duration-300 ease-smooth group-hover:opacity-100" />
            </span>
            <span className="hidden font-display text-sm font-medium tracking-wide text-ink-dim transition-colors duration-300 group-hover:text-ink sm:block">
              revanth<span className="text-iris">.is-a.dev</span>
            </span>
          </button>
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {links.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => go(l.id)}
                aria-current={active === l.id ? "true" : undefined}
                className={cn(
                  "nav-underline relative rounded-full px-3.5 py-2 font-display text-[13px] font-medium transition-all duration-300 ease-smooth hover:bg-white/[0.05] hover:text-ink hover:shadow-[0_0_28px_-10px_rgba(143,143,248,0.4)]",
                  active === l.id ? "text-ink" : "text-ink-dim"
                )}
              >
                {l.label}
              </button>
            ))}
            <a
              href="https://github.com/arevanthsrisai"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub profile"
              className="ml-2 grid h-9 w-9 place-items-center rounded-full text-ink-dim transition-all duration-300 ease-smooth hover:bg-white/[0.05] hover:text-ink"
            >
              <Github size={17} strokeWidth={1.8} />
            </a>
          </nav>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full glass text-ink lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        <motion.div
          style={{ scaleX: progress }}
          className="h-px origin-left bg-gradient-to-r from-iris/60 via-iris-soft/50 to-teal/40"
        />
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-base-950/80 backdrop-blur-xl lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.nav
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
              className="flex h-full flex-col items-center justify-center gap-2"
              aria-label="Mobile"
            >
              {links.map((l, i) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                >
                  <button
                    type="button"
                    onClick={() => go(l.id)}
                    autoFocus={i === 0}
                    className={cn(
                      "block px-8 py-3 font-display text-4xl font-semibold tracking-tight transition-colors duration-300",
                      active === l.id ? "text-ink" : "text-ink-dim hover:text-ink"
                    )}
                  >
                    {l.label}
                  </button>
                </motion.div>
              ))}
              <motion.a
                href="https://github.com/arevanthsrisai"
                target="_blank"
                rel="noreferrer noopener"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mt-8 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-ink-faint"
              >
                <Github size={14} /> github
              </motion.a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
