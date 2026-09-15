/**
 * Single source of truth for all personal content.
 * Edit this file to update the site — no component changes required.
 */

export const identity = {
  name: "Revanth",
  fullName: "Avirneni Revanth Sri Sai",
  handle: "arevanthsrisai",
  tagline: ["Student.", "Builder.", "Agentic Coder."],
  degree: "B.Tech Computer Science and Engineering",
  school: "Amrita Vishwa Vidyapeetham, Amaravati Campus",
  location: "Guntur, Andhra Pradesh, India",
  timezone: "GMT +5:30",
  github: "https://github.com/arevanthsrisai",
  email: "a.revanthsrisai@gmail.com",
  discord: "ak_revanth",
  linkedin: "https://www.linkedin.com/in/revanth-sri-sai-avirneni-a9a103382/",
  youtube: "https://www.youtube.com/@ak_revanth",
  bio: [
    "Computer Science undergrad crafting games, apps, and digital experiences.",
    "I'm Revanth, a B.Tech CSE student at Amrita Vishwa Vidyapeetham. I build with AI agents as collaborators — architecting systems, delegating to specialists, and shipping polished software faster than solo workflows ever could.",
    "From building search engines to recommending movies, and winning hackathons like Prompt Craft, I'm on a journey to turn ideas into interactive reality.",
  ],
};

export const stats = [
  { value: "9.04", label: "CGPA" },
  { value: "5+", label: "Projects" },
  { value: "1", label: "Events Won" },
  { value: "100%", label: "Security-First" },
];

export type Social = {
  id: "email" | "discord" | "github" | "linkedin" | "youtube";
  label: string;
  href: string;
  display: string;
  copyable: boolean;
};

/** All public contact handles — rendered on the Contact page and linked elsewhere. */
export const socials: Social[] = [
  {
    id: "email",
    label: "Email",
    href: `mailto:${identity.email}`,
    display: identity.email,
    copyable: true,
  },
  {
    id: "discord",
    label: "Discord",
    href: "",
    display: identity.discord,
    copyable: true,
  },
  {
    id: "github",
    label: "GitHub",
    href: identity.github,
    display: `github.com/${identity.handle}`,
    copyable: false,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: identity.linkedin,
    display: identity.linkedin.replace(/^https:\/\/(www\.)?/, ""),
    copyable: false,
  },
  {
    id: "youtube",
    label: "YouTube",
    href: identity.youtube,
    display: identity.youtube.replace(/^https:\/\/(www\.)?/, ""),
    copyable: false,
  },
];

/** Technologies from the existing site's stack. */
export const toolbox = [
  "Python",
  "Java",
  "HTML",
  "Git",
  "GitHub",
  "VS Code",
  "OOP",
  "Problem Solving",
  "AI/ML",
  "Data Handling",
];

export type Project = {
  index: string;
  name: string;
  kind: string;
  year: string;
  description: string;
  tags: string[];
  code: string;
  live: string;
  accent: "iris" | "teal" | "amber";
  image: string;
  imgPos: string;
  imgFilter: string;
};

export const projects: Project[] = [
  {
    index: "01",
    name: "LiDAR Maze Game",
    kind: "Real-time Multiplayer Game",
    year: "2025",
    description:
      "A real-time multiplayer maze game built around a LiDAR-scanning mechanic — the maze stays pitch dark until players fire off short-range scans, racing to reach the center first. One player hosts on desktop while others join as mobile controllers over the local network.",
    tags: ["Node.js", "Express", "Socket.IO", "Phaser 3"],
    code: "https://github.com/arevanthsrisai/lidar-maze",
    live: "https://github.com/arevanthsrisai/lidar-maze",
    accent: "teal",
    image: "/assets/lidar_maze.png",
    imgPos: "object-center",
    imgFilter:
      "opacity-55 brightness-110 contrast-[1.05] group-hover:opacity-75 group-hover:brightness-125",
  },
  {
    index: "02",
    name: "Anonymous Confessions",
    kind: "Full-stack Web Application",
    year: "2025",
    description:
      "A full-stack anonymous messaging board with an admin moderation dashboard. Hardened the Express API with Helmet, rate limiting, and CORS so messages stay untraceable to their authors while the platform stays resistant to abuse.",
    tags: ["Node.js", "Express", "REST API", "Helmet"],
    code: "https://github.com/arevanthsrisai/confessions",
    live: "https://github.com/arevanthsrisai/confessions",
    accent: "iris",
    image: "/assets/anonymouse.png",
    imgPos: "object-top",
    imgFilter:
      "opacity-30 grayscale-[0.4] group-hover:opacity-45 group-hover:grayscale-0",
  },
  {
    index: "03",
    name: "AUMS UI",
    kind: "Student Portal Interface",
    year: "2026",
    description:
      "A custom front-end for the Amrita University Management System — turning dense academic dashboards into a clean, fast interface for courses, attendance, and grades.",
    tags: ["Frontend", "UI", "Design"],
    code: "https://github.com/arevanthsrisai/AUMS_UI",
    live: "https://github.com/arevanthsrisai/AUMS_UI",
    accent: "amber",
    image: "/assets/AUMS_UI.png",
    imgPos: "object-top",
    imgFilter:
      "opacity-50 brightness-110 group-hover:opacity-70 group-hover:brightness-125",
  },
];

export type Medium = "text" | "image" | "video" | "voice";

/** The app currently in development — rendered in the "Currently Building" spotlight. */
export const currentlyBuilding = {
  name: "OX-Share",
  status: "In development",
  headline: "One app for every message.",
  description:
    "A secure, end-to-end messaging platform for sharing text, images, video, and voice. Every message is sealed on the sender's device and verified before it ever reaches the recipient.",
  media: [
    {
      id: "text" as Medium,
      title: "Text",
      detail: "Instant, encrypted conversations with delivery receipts and typing states.",
    },
    {
      id: "image" as Medium,
      title: "Images",
      detail: "Compressed, integrity-checked photo sharing that never leaks metadata.",
    },
    {
      id: "video" as Medium,
      title: "Video",
      detail: "Stream or send clips of any length — sealed the moment recording stops.",
    },
    {
      id: "voice" as Medium,
      title: "Voice",
      detail: "Push-to-talk notes and voice messages with the same zero-knowledge pipeline.",
    },
  ],
  security: [
    "End-to-end encryption on every medium",
    "SHA-256 message fingerprinting",
    "Tamper-evident delivery pipeline",
    "Zero plaintext on the wire",
  ],
};

export type TimelineEntry = {
  period: string;
  title: string;
  place: string;
  credential: string;
  score: string;
  current: boolean;
  accent: "iris" | "teal" | "amber";
};

export const education: TimelineEntry[] = [
  {
    period: "2025 — Present",
    title: "Amrita Vishwa Vidyapeetham",
    place: "Amaravati Campus",
    credential: "B.Tech in Computer Science and Engineering",
    score: "CGPA: 9.04",
    current: true,
    accent: "iris",
  },
  {
    period: "2023 — 2024",
    title: "Narayana Junior College",
    place: "Amaravati, Andhra Pradesh",
    credential: "Higher Secondary Education (Class XII)",
    score: "96%",
    current: false,
    accent: "teal",
  },
  {
    period: "2022 — 2023",
    title: "Narayana E.M. School",
    place: "Guntur, Andhra Pradesh",
    credential: "Secondary Education (Class X)",
    score: "95.67%",
    current: false,
    accent: "amber",
  },
];

/** Academic scores for the expandable breakdown in the Education section. */
export const academics = {
  cgpa: "9.04",
  label: "CGPA",
  semesters: [
    { term: "Semester 1", sgpa: "9.02" },
    { term: "Semester 2", sgpa: "9.05" },
  ],
};

export type Achievement = {
  title: string;
  detail: string;
  accent: "iris" | "teal" | "amber";
  icon: "award" | "star" | "cap";
  image: string;
  imgPos: string;
};

export const achievements: Achievement[] = [
  {
    title: "Prompt Craft Winner",
    detail: "Won the Prompt Craft event at Tantrotsav 2026 conducted by Amrita Chennai",
    accent: "iris",
    icon: "award",
    image: "/assets/tantrotsav.jpg",
    imgPos: "object-center",
  },
  {
    title: "ReLU Club Activator",
    detail: "Active member participating in AI/ML technical sessions and peer learning",
    accent: "amber",
    icon: "cap",
    image: "/assets/relu_group.jpg",
    imgPos: "object-[50%_30%]",
  },
];

export type Testimonial = {
  quote: string;
  role: string;
  context: string;
  image: string;
  secondaryImage?: string;
  accent: "iris" | "teal" | "amber";
};

/** Peer and organizer voices — rendered in the Voices carousel. */
export const testimonials: Testimonial[] = [
  {
    quote: "Revanth ships like someone three semesters ahead of his syllabus.",
    role: "ReLU Club coordinator",
    context: "Technical sessions",
    image: "/assets/relu_gang.jpg",
    secondaryImage: "/assets/explain.jpg",
    accent: "iris",
  },
  {
    quote: "The winning prompt was not luck. It was structure, refined twice over.",
    role: "Tantrotsav 2026 | 1st Place",
    context: "Prompt Craft, Amrita Chennai",
    image: "/assets/winning.jpg",
    secondaryImage: "/assets/certificate.jpg",
    accent: "amber",
  },
];
