# GCS Frontend App

Ground Control Station web application for UAV/drone telemetry and mission control.
<img width="1512" height="948" alt="image" src="https://github.com/user-attachments/assets/ae7b4292-b39d-448e-8943-185b2b651a4a" />

## Tech Stack

- **React 19** with TypeScript
- **Vite** (SWC) — build tool
- **TailwindCSS v4** — utility-first styling
- **shadcn/ui** — UI component library (built on Radix UI primitives)
- **Aceternity UI** — special effect components (3D cards, ripples, etc.)
- **Lucide React** — icons
- **Motion** — animations
- **Leaflet** + **React-Leaflet** — interactive map
- **MAVLink** telemetry via REST API (`localhost:8088`)

## Getting Started

### Docker (recommended)

Run the full stack (frontend + ArduPilot simulator + MAVLink API) with a single command:

```bash
docker compose up --build
```

This starts three services:

| Service          | Description                | URL                   |
| ---------------- | -------------------------- | --------------------- |
| **gcs**          | Frontend (Vite dev server) | http://localhost:5173 |
| **mavlink2rest** | MAVLink REST API           | http://localhost:8088 |
| **sitl**         | ArduPilot SITL simulator   | —                     |

Open http://localhost:5173 in your browser. It may take 30–60 seconds for the simulator to initialize.

To stop:

```bash
docker compose down
```

### Without Docker

Requires a running [mavlink2rest](https://github.com/patrickelectric/mavlink2rest) instance on `localhost:8088`.

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
