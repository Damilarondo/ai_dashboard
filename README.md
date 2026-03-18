# AI Dashboard — Admin Monitoring Console

A real-time **Next.js** dashboard for the central administrator. Provides full visibility into the AI troubleshooting system: live incident feeds, system telemetry charts, ML-driven health scores, agent management, and operational controls.

> **Part of the [Web Server Troubleshooting Agent](https://github.com/Damilarondo/web-server-troubleshooting-agent) system.**

---

## Features

| Feature | Description |
|---|---|
| **Live Event Feed** | Real-time WebSocket stream of incident lifecycle events (detected → analyzing → remediated → resolved) |
| **Health Score Gauge** | Composite stability index combining service uptime, resource pressure, unresolved incidents, and ML anomaly predictions |
| **System Telemetry** | SVG sparkline charts for CPU, memory, and disk utilization, updated every 10 seconds |
| **Top Processes** | Live list of the top 5 RAM-consuming processes on monitored servers |
| **Service Status Grid** | At-a-glance view of all discovered services and their running state |
| **Incident Management** | Paginated, filterable, and searchable incident table with full detail views (logs, AI analysis, remediation commands, MTTR) |
| **Agent Management** | View registered agents, their heartbeat status, IP addresses, and OS details |
| **Operations Centre** | Configure the AI model (temperature, max tokens), remediation mode (full-auto / semi-auto / manual), and system prompt |
| **Expert Mode** | Toggle to a terminal-style console view for advanced users |
| **JWT Authentication** | Login with client-side password hashing (SHA-256), automatic session invalidation on 401 |

---

## Pages

| Route | Description |
|---|---|
| `/` | Dashboard — KPIs, live feed, telemetry charts, health gauge |
| `/login` | Authentication page |
| `/incidents` | Paginated incident list with search and status filters |
| `/incidents/[id]` | Incident detail view (logs, analysis, remediation, workflow state) |
| `/agents` | Registered agent list with heartbeat and status |
| `/operations` | System configuration (model, mode, prompt) |
| `/documentation` | In-app documentation / reference |

---

## Tech Stack

- **Next.js 16** (App Router, React 19)
- **TypeScript**
- **Tailwind CSS 4**
- **WebSocket** (for real-time events)

---

## Prerequisites

- **Node.js 18+** and **npm**
- A running [AI Control Plane](https://github.com/Damilarondo/ai_control_plane) backend

---

## Setup

```bash
# Clone the repo
git clone https://github.com/Damilarondo/ai_dashboard.git
cd ai_dashboard

# Install dependencies
npm install

# Set the API URL (defaults to http://localhost:8000)
export NEXT_PUBLIC_API_URL=https://<control-plane-host>

# Start the development server
npm run dev
```

The dashboard is available at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run start
```

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the AI Control Plane API | `http://localhost:8000` |

---

## License

This project is part of a Final Year Project at the University of Lagos.
