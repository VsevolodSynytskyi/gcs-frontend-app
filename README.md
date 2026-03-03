# GCS Frontend App

Ground Control Station web application for UAV/drone telemetry and mission control.

## Tech Stack

- **React 19** with TypeScript
- **Vite** (SWC) — build tool
- **TailwindCSS v4** — utility-first styling
- **Radix UI** — accessible UI primitives
- **Motion** — animations
- **Leaflet** + **React-Leaflet** — interactive map
- **MAVLink** telemetry via REST API (`localhost:8088`)

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start dev server                    |
| `npm run build`   | Type-check and build for production |
| `npm run preview` | Preview production build            |
| `npm run lint`    | Run ESLint                          |
