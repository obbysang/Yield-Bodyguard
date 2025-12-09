# YieldBodyguard
<p align="center">
  <img src="Yield-Bodyguard/assets/logo.png" alt="YieldBodyguard Logo" width="140" />
  <br/>
</p>
Autonomous safety layer for DeFi yield. It continuously monitors pools, scores risk from on‑chain signals, and turns insights into actionable alerts and protective workflows. Non‑custodial by design, multi‑chain, and optimized for fast execution.

## Key Features

- Real‑time monitoring of pools for APY spikes, liquidity drains, and anomalies
- AI‑style risk scoring with clear, actionable explanations
- Instant safeguards including rebalancing cues and rapid exits on threats
- Non‑custodial: you keep control of your keys; the agent only assists
- Multi‑chain coverage across Ethereum mainnet and L2s
- Clean UI with portfolio health, risk scores, and performance history

## Architecture

- Frontend (React + Vite)
  - Path: `Yield-Bodyguard/`
  - Tech: React 18, Vite 6, Tailwind, Framer Motion, Recharts, Wagmi/Viem
  - Landing page and dashboard components (e.g., `pages/Landing.tsx`, `pages/Dashboard.tsx`, `pages/Portfolio.tsx`)
  - Environment injection via `vite.config.ts` for `GEMINI_API_KEY`
- Agent Service (Node + Hono)
  - Path: `agent-service/`
  - Tech: Hono, Viem, Node‑Cron, Cross‑Fetch
  - Endpoints: `/health`, `/pools`, `/atp/status`, `/alerts/discord`, `/executor/rebalance` (see `agent-service/src/index.ts:12–40`)
  - Default port: `8787` (see `agent-service/src/index.ts:51–54`)

## Quick Start

- Requirements
  - Node.js 18+
  - npm (or pnpm/yarn)

- Frontend (Vite app)
  - `cd Yield-Bodyguard`
  - `npm install`
  - `npm run dev`
  - Open `http://localhost:3000`

- Agent Service (backend)
  - `cd agent-service`
  - `npm install`
  - Create `.env` with the variables below
  - `npm run dev`
  - API served at `http://localhost:8787`

## Configuration

- Frontend `.env` (optional)
  - `GEMINI_API_KEY=` used for AI features (`yield-bodyguard/vite.config.ts:13–16`)

- Agent Service `.env`
  - `RELAYER_PRIVATE_KEY=` private key for on‑chain writes (normalized to `0x...`)
  - `DISCORD_WEBHOOK_URL=` optional, for alert forwarding
  - `PORT=8787` optional override

- Notes
  - Private key is loaded via `viem/accounts` and used by the executor (`agent-service/src/agent/executor.ts:14–22, 29–35`).
  - Frontend expects backend at `http://localhost:8787` (see `Yield-Bodyguard/metadata.json:6–10`).

## Build & Run

- Frontend
  - Build: `npm run build` (outputs to `Yield-Bodyguard/dist`)
  - Preview: `npm run preview`

- Agent Service
  - Build: `npm run build` (outputs to `agent-service/dist` per `tsconfig.json`)
  - Start: `npm start` (runs `dist/index.js`)

## API Overview

- `GET /health` service status
- `GET /pools?limit=30` latest monitored pool snapshot
- `GET /atp/status?address=0x...` gate checks for features
- `POST /alerts/discord` forwards `{ message }` to Discord webhook
- `POST /executor/rebalance` executes policy‑driven rebalance flow

Example:

```bash
curl http://localhost:8787/health
curl "http://localhost:8787/pools?limit=10"
```

## Security

- Non‑custodial: keys remain with the user; actions are policy‑driven
- No secrets committed; configure via `.env` files only
- Fast failure on missing relayer key to avoid unsafe default writes

## Project Paths

- Frontend root: `Yield-Bodyguard/`
- Backend root: `agent-service/`
- Backend build dir: `agent-service/dist`
- Frontend build dir: `Yield-Bodyguard/dist`

## Licensing

Copyright © 2025 YieldBodyguard Inc.
