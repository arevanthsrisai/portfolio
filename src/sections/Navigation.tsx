import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  lenisRef: React.MutableRefObject<any>;
}

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#projects' },
  { label: 'Arcade', href: '#arcade' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation({ lenisRef }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(href, { offset: -64 });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B0C10]/80 backdrop-blur-md border-b border-[#1F2833]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (lenisRef.current) lenisRef.current.scrollTo(0);
          }}
          className="font-display text-2xl font-bold text-[#FF6B6B] hover:scale-105 transition-transform"
        >
          R.
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-[#8A8D9F] hover:text-[#E0E0E0] transition-colors text-sm font-medium"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <button
            onClick={() => handleNavClick('#contact')}
            className="bg-[#C3F73A] text-[#0B0C10] px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#d4ff5a] hover:scale-105 transition-all"
          >
            Let&apos;s Build
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-[#E0E0E0] p-2"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0B0C10]/95 backdrop-blur-md border-t border-[#1F2833]">
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-[#8A8D9F] hover:text-[#E0E0E0] transition-colors text-base font-medium text-left"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick('#contact')}
              className="bg-[#C3F73A] text-[#0B0C10] px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#d4ff5a] transition-all w-fit"
            >
              Let&apos;s Build
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}