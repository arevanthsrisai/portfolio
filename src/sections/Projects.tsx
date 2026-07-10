import { motion } from 'framer-motion';
import { ExternalLink, Github, Radar, Ghost } from 'lucide-react';

const projects = [
  {
    id: 1,
    name: 'LiDAR Maze Game',
    description:
      'A real-time multiplayer maze game built around a LiDAR-scanning mechanic — the maze stays pitch dark until players fire off short-range scans, racing to reach the center first. One player hosts on desktop while others join as mobile controllers over the local network.',
    image: null,
    tech: ['Node.js', 'Express', 'Socket.IO', 'Phaser 3'],
    github: 'https://github.com/arevanthsrisai/lidar-maze',
    icon: Radar,
    accent: '#C3F73A',
  },
  {
    id: 2,
    name: 'Anonymous Confessions',
    description:
      'A full-stack anonymous messaging board with an admin moderation dashboard. Hardened the Express API with Helmet, rate limiting, and CORS so messages stay untraceable to their authors while the platform stays resistant to abuse.',
    image: null,
    tech: ['Node.js', 'Express', 'REST API', 'Helmet'],
    github: 'https://github.com/arevanthsrisai/confessions',
    icon: Ghost,
    accent: '#FF6B6B',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="relative py-24 md:py-32 bg-[#0B0C10]">
      {/* Top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C3F73A]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-[#C3F73A] font-arcade text-xs tracking-wider">
            &lt;PROJECTS /&gt;
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-2">
            What I&apos;ve Built.
          </h2>
          <p className="text-[#8A8D9F] mt-4 max-w-lg mx-auto">
            Projects built with curiosity, caffeine, and a lot of vibe coding.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group relative bg-[#1F2833]/50 border border-[#1F2833] rounded-2xl overflow-hidden hover:border-[#FF6B6B]/30 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      background: `radial-gradient(circle at 50% 40%, ${project.accent}25, #1F2833 70%)`,
                    }}
                  >
                    <project.icon size={56} strokeWidth={1.5} style={{ color: project.accent }} />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F2833] to-transparent" />
                <div
                  className="absolute top-4 left-4 p-2 rounded-lg"
                  style={{ backgroundColor: `${project.accent}20` }}
                >
                  <project.icon
                    size={20}
                    style={{ color: project.accent }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-white mb-2 group-hover:text-[#FF6B6B] transition-colors">
                  {project.name}
                </h3>
                <p className="text-[#8A8D9F] text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 bg-[#0B0C10] text-[#8A8D9F] text-xs rounded-md border border-[#1F2833]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#8A8D9F] hover:text-white text-sm transition-colors"
                  >
                    <Github size={16} />
                    Code
                  </a>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#8A8D9F] hover:text-[#C3F73A] text-sm transition-colors"
                  >
                    <ExternalLink size={16} />
                    View
                  </a>
                </div>
              </div>

              {/* Hover glow effect */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 60px ${project.accent}10`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* More Projects CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="https://github.com/arevanthsrisai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#8A8D9F] hover:text-[#C3F73A] transition-colors text-sm"
          >
            <Github size={18} />
            More projects on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}