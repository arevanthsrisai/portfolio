import { motion } from 'framer-motion';
import BrowserArcadeCabinet from './BrowserArcadeCabinet';
import { Gamepad2 } from 'lucide-react';

export default function ArcadeSection() {
  return (
    <section
      id="arcade"
      className="relative py-24 md:py-32 bg-[#1F2833] min-h-screen flex flex-col items-center justify-center"
    >
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9B5DE5]/30 to-transparent" />

      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(155, 93, 229, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(155, 93, 229, 0.3) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="text-[#9B5DE5] font-arcade text-xs tracking-wider">
            &lt;ARCADE /&gt;
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-2 flex items-center justify-center gap-3">
            <Gamepad2 className="text-[#9B5DE5]" size={36} />
            Take a Break.
          </h2>
          <p className="text-[#8A8D9F] mt-4 max-w-md mx-auto">
            I build games too. Play a round of Breakout while you&apos;re here!
          </p>
        </motion.div>

        {/* Arcade Cabinet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          className="flex justify-center"
        >
          <BrowserArcadeCabinet />
        </motion.div>
      </div>
    </section>
  );
}