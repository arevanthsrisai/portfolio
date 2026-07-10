import { motion } from 'framer-motion';
import { GraduationCap, School, Award, BookOpen, Star } from 'lucide-react';

const education = [
  {
    id: 1,
    institution: 'Amrita Vishwa Vidyapeetham',
    location: 'Amaravati Campus',
    degree: 'B.Tech in Computer Science and Engineering',
    period: '2025 – Present',
    grade: 'CGPA: 9.02',
    icon: GraduationCap,
    accent: '#FF6B6B',
    current: true,
  },
  {
    id: 2,
    institution: 'Narayana Junior College',
    location: 'Amaravati, Andhra Pradesh',
    degree: 'Higher Secondary Education (Class XII)',
    period: '2023 – 2024',
    grade: '96%',
    icon: School,
    accent: '#C3F73A',
    current: false,
  },
  {
    id: 3,
    institution: 'Narayana E.M. School',
    location: 'Guntur, Andhra Pradesh',
    degree: 'Secondary Education (Class X)',
    period: '2022 – 2023',
    grade: '95.67%',
    icon: BookOpen,
    accent: '#9B5DE5',
    current: false,
  },
];

const achievements = [
  {
    title: 'Prompt Craft Winner',
    description: 'Won the Prompt Craft event at Tantrotsav 2026 conducted by Amrita Chennai',
    icon: Award,
    accent: '#FF6B6B',
  },
  {
    title: 'Python Certification',
    description: 'Python Course for Beginners With Certification – Scaler Topics (2026)',
    icon: Star,
    accent: '#C3F73A',
  },
  {
    title: 'ReLU Club Activator',
    description: 'Active member participating in AI/ML technical sessions and peer learning',
    icon: GraduationCap,
    accent: '#9B5DE5',
  },
];

export default function Education() {
  return (
    <section className="relative py-24 md:py-32 bg-[#0B0C10]">
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
          <span className="text-[#9B5DE5] font-arcade text-xs tracking-wider">
            &lt;EDUCATION /&gt;
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mt-2">
            The Journey.
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#FF6B6B] via-[#C3F73A] to-[#9B5DE5]" />

          <div className="space-y-12">
            {education.map((edu, index) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-16 md:pl-20"
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-3 md:left-5 top-2 w-6 h-6 rounded-full border-4 border-[#0B0C10]"
                  style={{ backgroundColor: edu.accent }}
                />
                {edu.current && (
                  <div
                    className="absolute left-3 md:left-5 top-2 w-6 h-6 rounded-full animate-ping opacity-40"
                    style={{ backgroundColor: edu.accent }}
                  />
                )}

                {/* Card */}
                <div className="bg-[#1F2833]/50 border border-[#1F2833] rounded-xl p-6 hover:border-[#FF6B6B]/20 transition-all">
                  <div className="flex items-start gap-4">
                    <div
                      className="p-3 rounded-lg shrink-0"
                      style={{ backgroundColor: `${edu.accent}15` }}
                    >
                      <edu.icon size={24} style={{ color: edu.accent }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-display text-lg font-bold text-white">
                          {edu.institution}
                        </h3>
                        {edu.current && (
                          <span className="px-2 py-0.5 bg-[#C3F73A]/20 text-[#C3F73A] text-xs rounded-full font-medium">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[#8A8D9F] text-sm mt-1">
                        {edu.location}
                      </p>
                      <p className="text-[#E0E0E0] mt-2">{edu.degree}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="text-[#8A8D9F]">{edu.period}</span>
                        <span
                          className="font-semibold"
                          style={{ color: edu.accent }}
                        >
                          {edu.grade}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mt-24"
        >
          <span className="text-[#C3F73A] font-arcade text-xs tracking-wider">
            &lt;ACHIEVEMENTS /&gt;
          </span>
          <h3 className="font-display text-3xl font-bold text-white mt-2 mb-8">
            Milestones.
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-[#1F2833]/50 border border-[#1F2833] rounded-xl p-6 hover:border-[#FF6B6B]/20 transition-all group"
              >
                <div
                  className="p-3 rounded-lg w-fit mb-4"
                  style={{
                    backgroundColor: `${achievement.accent}15`,
                  }}
                >
                  <achievement.icon
                    size={24}
                    style={{ color: achievement.accent }}
                  />
                </div>
                <h4 className="font-display text-lg font-bold text-white group-hover:text-[#FF6B6B] transition-colors">
                  {achievement.title}
                </h4>
                <p className="text-[#8A8D9F] text-sm mt-2 leading-relaxed">
                  {achievement.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}