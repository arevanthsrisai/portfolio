import { Fragment } from "react";
import { Asterisk } from "lucide-react";
import { toolbox } from "@/data/profile";
import { Reveal } from "@/components/primitives";
import { cn } from "@/lib/utils";

function MarqueeCopy({ hidden }: { hidden?: boolean }) {
  return (
    <div
      aria-hidden={hidden}
      className="flex w-max items-center gap-8 pr-8 md:gap-14 md:pr-14"
    >
      {toolbox.map((item, i) => (
        <Fragment key={item}>
          <span
            className={cn(
              "whitespace-nowrap font-display text-4xl font-semibold tracking-tight md:text-6xl",
              i % 2 === 0 ? "text-white/90" : "text-white/25"
            )}
          >
            {item}
          </span>
          <Asterisk aria-hidden size={28} strokeWidth={1.5} className="shrink-0 text-iris/70" />
        </Fragment>
      ))}
    </div>
  );
}

export default function ToolkitMarquee() {
  return (
    <section aria-label="Toolkit" className="relative py-10 md:py-14">
      <Reveal>
        <div className="border-y border-white/[0.07] bg-base-900/70 backdrop-blur-sm">
          <div className="mask-fade-x overflow-hidden py-8 md:py-10">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
              <MarqueeCopy />
              <MarqueeCopy hidden />
            </div>
          </div>
        </div>
        <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
          daily drivers
        </p>
      </Reveal>
    </section>
  );
}
