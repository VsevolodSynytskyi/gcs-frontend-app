# CLAUDE.md

## Project Overview

GCS (Ground Control Station) frontend — a web app for real-time UAV/drone telemetry display and mission control.

## Tech Stack

- **React 19** + **TypeScript** + **Vite** (SWC plugin)
- **TailwindCSS v4** — all styling via utility classes (configured as Vite plugin, no `tailwind.config.js`)
- **shadcn/ui** (new-york style) — UI component library built on Radix UI primitives (`npx shadcn@latest add <component>`)
- **Aceternity UI** — special effect components (3D cards, ripples, etc.) via `@aceternity` registry
- **Motion** (`motion`) — all animations (do NOT use CSS animations or transitions for UI motion)
- **Leaflet** + **React-Leaflet** — map rendering
- **MAVLink REST API** at `http://localhost:8088` — drone telemetry source

## Conventions

### Styling

- Use **Tailwind utility classes** for all styling. No inline `style={}` props except where required by third-party libs (e.g., Leaflet).
- Do NOT write custom CSS in `index.css` or create new `.css` files. The only CSS file is `src/index.css` which contains the Tailwind import.
- Use **shadcn/ui** components for interactive UI elements (dialogs, dropdowns, tooltips, popovers, etc.). Add new components via `npx shadcn@latest add <component>`.
- Use **Aceternity UI** for special visual effects. Add via `npx shadcn@latest add @aceternity/<component>`.
- Dark theme is the default (CSS variables in `src/index.css`).
- Prefer named Tailwind classes over arbitrary values (e.g., `z-5` over `z-[5]`).

### Animations

- Use the `motion` library for all animations and transitions.
- Import from `"motion/react"` for React components (`<motion.div>`, etc.).
- Prefer `motion` over CSS transitions/animations.

### Code Style

- Functional components only, no class components.
- Use named exports for components (except the main App which uses default export).
- TypeScript strict mode is enabled.
- Prefer `switch` statements over ternaries/`if` chains for multi-branch conditionals (readability).
- Place component files in `src/` — organize into subdirectories as the project grows (e.g., `src/components/`, `src/hooks/`).

### Formatting (Prettier)

All code must follow the project's Prettier config (`.prettierrc.json`):

- **No semicolons** — omit `;` at the end of statements.
- **Single quotes** — use `'single quotes'` for strings (JSX attributes too).
- **Trailing commas** — always include trailing commas in multi-line lists, objects, parameters, etc.
- **2-space indentation**.
- **80 character line width** — break lines that exceed 80 characters.
- Tailwind classes are auto-sorted by `prettier-plugin-tailwindcss`.

### Project Structure

```
src/
  main.tsx          — app entry, Radix Theme provider
  App.tsx           — root component
  index.css         — Tailwind import only
```

## Git

- **NEVER** commit, amend, or push without the user explicitly asking you to.

## Commands

- `npm run dev` — start dev server
- `npm run build` — type-check + production build
- `npm run lint` — ESLint
- `npm run format` — format all files with Prettier
- `npm run format:check` — check formatting without writing (CI)
- `npm run preview` — preview production build
