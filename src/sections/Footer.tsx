import { motion } from 'framer-motion';
import {
  Github,
  Linkedin,
  Youtube,
  Mail,
  MessageCircle,
  Heart,
  ArrowUp,
} from 'lucide-react';

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/arevanthsrisai',
    icon: Github,
    color: '#E0E0E0',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/revanth-sri-sai-avirneni-a9a103382/',
    icon: Linkedin,
    color: '#0A66C2',
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@ak_revanth',
    icon: Youtube,
    color: '#FF0000',
  },
  {
    name: 'Discord',
    url: '#',
    icon: MessageCircle,
    color: '#5865F2',
    handle: 'ak_revanth',
  },
  {
    name: 'Email',
    url: 'mailto:a.revanthsrisai@gmail.com',
    icon: Mail,
    color: '#FF6B6B',
  },
];

interface FooterProps {
  lenisRef: React.MutableRefObject<any>;
}

export default function Footer({ lenisRef }: FooterProps) {
  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0);
    }
  };

  return (
    <footer
      id="contact"
      className="relative bg-[#0B0C10] border-t border-[#1F2833]"
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Big CTA Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <h2 className="font-display text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-none tracking-tighter">
            LET&apos;S
            <br />
            <span className="text-gradient-coral">BUILD.</span>
          </h2>
          <p className="text-[#8A8D9F] mt-6 text-lg max-w-md">
            Have an idea? Want to collaborate? Just want to say hi? Hit me up!
          </p>
        </motion.div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Quick Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-white font-display font-semibold mb-4">
              Preferred Contact
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:a.revanthsrisai@gmail.com"
                className="flex items-center gap-3 text-[#8A8D9F] hover:text-[#FF6B6B] transition-colors group"
              >
                <Mail size={18} />
                <span className="group-hover:underline">
                  a.revanthsrisai@gmail.com
                </span>
              </a>
              <div className="flex items-center gap-3 text-[#8A8D9F]">
                <MessageCircle size={18} />
                <span>Discord: ak_revanth</span>
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-white font-display font-semibold mb-4">
              Find Me Online
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#8A8D9F] hover:text-white transition-colors group"
                >
                  <link.icon
                    size={16}
                    style={{ color: link.color }}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span className="group-hover:underline">{link.name}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-white font-display font-semibold mb-4">
              Location
            </h3>
            <p className="text-[#8A8D9F]">
              Guntur, Andhra Pradesh
              <br />
              India
              <br />
              <span className="text-sm">GMT +5:30</span>
            </p>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#1F2833] to-transparent mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#8A8D9F] text-sm flex items-center gap-1">
            &copy; 2025 Avirneni Revanth Sri Sai. Built with{' '}
            <Heart size={14} className="text-[#FF6B6B] fill-[#FF6B6B]" /> and
            vibes.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-[#8A8D9F] hover:text-[#C3F73A] transition-colors text-sm group"
          >
            Back to top
            <ArrowUp
              size={16}
              className="group-hover:-translate-y-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}