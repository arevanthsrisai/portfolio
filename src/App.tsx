import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PointerGlow } from "@/components/pointer-glow";
import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import ToolkitMarquee from "@/sections/ToolkitMarquee";
import { Projects } from "@/sections/Projects";
import { CurrentlyWorking } from "@/sections/CurrentlyWorking";
import { Principles } from "@/sections/Principles";
import { Education } from "@/sections/Education";
import { Achievements } from "@/sections/Achievements";
import Voices from "@/sections/Voices";
import { Arcade } from "@/sections/Arcade";
import { Contact } from "@/sections/Contact";
import { useLenis } from "@/hooks/useLenis";

export default function App() {
  useLenis();
  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-base-950">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-base-950"
      >
        Skip to content
      </a>
      <Navbar />
      <PointerGlow />
      <main id="main">
        <Hero />
        <About />
        <ToolkitMarquee />
        <Projects />
        <CurrentlyWorking />
        <Principles />
        <Education />
        <Achievements />
        <Voices />
        <Arcade />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
