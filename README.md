# Revanth — Developer Portfolio

A dark, motion-rich single-page portfolio built with React, TypeScript, and Vite. Sections include a hero, selected work, achievements, voices/testimonials, toolkit marquee, currently-working board, principles, about, education, arcade, and contact.

## Tech Stack

- **React 18 + TypeScript (strict)** — component architecture
- **Vite 5** — dev server and production bundling
- **Tailwind CSS 3** — design system (`glass`, `hairline`, custom accent tokens)
- **Framer Motion 11** — springs, 3D tilt/depth, AnimatePresence transitions
- **GSAP + Lenis** — scroll-driven motion and smooth scrolling
- **lucide-react** — icons

## Getting Started

```bash
npm install
npm run dev       # dev server with hot reload
npm run build     # type-check + production build -> dist/
npm run preview   # serve the production build locally
npm run typecheck # type-check only
```

## Project Structure

```
├── public/assets/        # optimized images served with the site
├── src/
│   ├── components/       # shared UI (Navbar, Footer, primitives, pointer glow)
│   ├── data/profile.ts   # single source of truth for all personal content
│   ├── hooks/            # useLenis, useMediaQuery
│   ├── lib/              # utils, gsap, arcade game logic
│   └── sections/         # one file per page section
├── index.html            # static shell (title/meta); all content is React-rendered
└── tailwind.config.js    # design tokens
```

## Customization

All copy and content — identity, bio, stats, projects, testimonials — lives in [`src/data/profile.ts`](src/data/profile.ts). Edit that file to update the site; no component changes required. Optimized images go in `public/assets/` (raw source originals are intentionally not committed).

## Notes

- The `Voices` section uses dwell-based hover promotion: resting the pointer in a zone promotes that image, continuous motion (circling/wiggling) never triggers a swap, and a swap cooldown absorbs click spam.
- QA was verified with `tsc`, production builds, and headless-browser smoke tests (keyboard, touch, mobile overflow, console errors).
