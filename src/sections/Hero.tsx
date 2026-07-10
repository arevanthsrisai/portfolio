import { useEffect, useRef } from 'react';
import RetroScanlineHero from './RetroScanlineHero';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  lenisRef: React.MutableRefObject<any>;
}

export default function Hero({ lenisRef }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parallax effect: hero stays fixed while content scrolls over it
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      if (scrollY < heroHeight) {
        heroRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollDown = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo('#about', { offset: -64 });
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* 3D Background */}
      <div ref={heroRef} className="absolute inset-0 z-0">
        <RetroScanlineHero />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-end p-8 md:p-12 pb-20">
        <div className="max-w-2xl">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
            Student.
            <br />
            Builder.
            <br />
            <span className="text-gradient-coral">Vibe Coder.</span>
          </h1>
          <p className="text-[#8A8D9F] text-lg md:text-xl max-w-md mb-8 leading-relaxed">
            Computer Science undergrad crafting games, apps, and digital
            experiences.
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleScrollDown}
              className="border border-[#FF6B6B] text-[#FF6B6B] px-6 py-3 rounded-full font-medium hover:bg-[#FF6B6B] hover:text-[#0B0C10] transition-all duration-300 flex items-center gap-2"
            >
              View My Work
              <ChevronDown size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="text-[#8A8D9F]" size={24} />
      </div>
    </section>
  );
}