import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Trophy,
  GraduationCap,
  Sparkles,
  GitBranch,
  Terminal,
} from 'lucide-react';

const stats = [
  { icon: GraduationCap, label: 'CGPA', value: '9.02' },
  { icon: Code2, label: 'Projects', value: '5+' },
  { icon: Trophy, label: 'Hackathons', value: '1 Won' },
  { icon: Sparkles, label: 'Vibe Coder', value: '100%' },
];

const skills = [
  'Python',
  'Java',
  'HTML',
  'Git',
  'GitHub',
  'VS Code',
  'OOP',
  'Problem Solving',
  'AI/ML',
  'Data Handling',
];

const terminalLines = [
  { text: '$ whoami', delay: 0 },
  { text: 'revanth', delay: 300, output: true },
  { text: '$ git status', delay: 600 },
  { text: 'On branch main', delay: 900, output: true },
  { text: 'Your branch is ahead of "origin/main" by 42 commits.', delay: 1200, output: true },
  { text: '$ git push --force-with-lease', delay: 1500 },
  { text: 'Enumerating objects: 42, done.', delay: 2000, output: true },
  { text: 'Writing objects: 100% (42/42), done.', delay: 2300, output: true },
  { text: 'Successfully deployed! 🚀', delay: 2600, output: true, highlight: true },
];

function TerminalWindow() {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);

  useEffect(() => {
    terminalLines.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
      }, line.delay);
    });
  }, []);

  return (
    <div className="bg-[#0B0C10] border border-[#1F2833] rounded-xl overflow-hidden shadow-2xl">
      {/* Terminal Header */}
      <div className="bg-[#1F2833] px-4 py-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#FF6B6B]" />
        <div className="w-3 h-3 rounded-full bg-[#C3F73A]" />
        <div className="w-3 h-3 rounded-full bg-[#9B5DE5]" />
        <span className="text-[#8A8D9F] text-xs ml-2 font-body">revanth@portfolio:~</span>
      </div>

      {/* Terminal Body */}
      <div className="p-4 font-mono text-sm min-h-[200px]">
        {terminalLines.map((line, i) => (
          <div
            key={i}
            className={`transition-opacity duration-300 ${
              visibleLines.includes(i) ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {line.output ? (
              <p
                className={`${
                  line.highlight
                    ? 'text-[#C3F73A] font-semibold'
                    : 'text-[#8A8D9F]'
                }`}
              >
                {line.text}
              </p>
            ) : (
              <p className="text-[#E0E0E0]">
                <span className="text-[#FF6B6B]">$</span>{' '}
                <span className="text-[#9B5DE5]">{line.text.replace('$ ', '')}</span>
              </p>
            )}
          </div>
        ))}
        {visibleLines.length === terminalLines.length && (
          <p className="text-[#FF6B6B] animate-pulse mt-2">
            $<span className="ml-1">_</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-[#0B0C10]"
    >
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B6B]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[#FF6B6B] font-arcade text-xs tracking-wider">
            &lt;ABOUT /&gt;
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-2">
            Built by Passion.
          </h2>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-8"
          >
            {/* Profile Image */}
            <div className="relative w-32 h-32 mx-auto lg:mx-0">
              <img
                src="/images/profile.jpg"
                alt="Revanth"
                className="w-full h-full rounded-2xl object-cover border-2 border-[#FF6B6B]/30"
              />
              <div className="absolute -bottom-2 -right-2 bg-[#C3F73A] text-[#0B0C10] text-xs font-bold px-2 py-1 rounded-full">
                LVL 2
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-4">
              <p className="text-[#E0E0E0] text-lg leading-relaxed">
                I&apos;m{' '}
                <span className="text-[#FF6B6B] font-semibold">Revanth</span>, a
                B.Tech CSE student at{' '}
                <span className="text-[#C3F73A] font-semibold">
                  Amrita Vishwa Vidyapeetham
                </span>
                . I don&apos;t just write code; I{' '}
                <span className="text-gradient-coral font-semibold">
                  vibe code
                </span>
                .
              </p>
              <p className="text-[#8A8D9F] leading-relaxed">
                From building search engines to recommending movies, and winning
                hackathons like{' '}
                <span className="text-[#FF6B6B]">Prompt Craft</span>, I&apos;m on
                a journey to turn ideas into interactive reality.
              </p>
            </div>

            {/* Skills Tags */}
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Terminal size={18} className="text-[#C3F73A]" />
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-[#1F2833] text-[#E0E0E0] text-sm rounded-lg border border-[#1F2833] hover:border-[#FF6B6B]/50 hover:text-[#FF6B6B] transition-all cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#1F2833]/50 border border-[#1F2833] rounded-xl p-4 text-center hover:border-[#FF6B6B]/30 transition-all"
                >
                  <stat.icon
                    size={20}
                    className="text-[#FF6B6B] mx-auto mb-2"
                  />
                  <div className="text-white font-display text-xl font-bold">
                    {stat.value}
                  </div>
                  <div className="text-[#8A8D9F] text-xs mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Club Info */}
            <div className="flex items-center gap-3 bg-[#1F2833]/30 rounded-lg p-4 border border-[#1F2833]">
              <GitBranch size={20} className="text-[#9B5DE5]" />
              <div>
                <p className="text-[#E0E0E0] text-sm font-medium">
                  Activator at{' '}
                  <span className="text-[#9B5DE5]">ReLU Club</span>
                </p>
                <p className="text-[#8A8D9F] text-xs">
                  AI & ML Technical Sessions
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center"
          >
            <TerminalWindow />
          </motion.div>
        </div>
      </div>
    </section>
  );
}