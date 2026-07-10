import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import About from './sections/About';
import Projects from './sections/Projects';
import ArcadeSection from './sections/ArcadeSection';
import Education from './sections/Education';
import Footer from './sections/Footer';

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      syncTouch: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative bg-[#0B0C10] min-h-screen">
      {/* Navigation */}
      <Navigation lenisRef={lenisRef} />

      {/* Hero Section - Full viewport with 3D background */}
      <Hero lenisRef={lenisRef} />

      {/* Main Content */}
      <main className="relative z-10">
        <About />
        <Projects />
        <ArcadeSection />
        <Education />
      </main>

      {/* Footer */}
      <Footer lenisRef={lenisRef} />
    </div>
  );
}