# SIDERIS — Governance Console

Zero-leakage procurement. Built on Midnight.

## Stack

- **Vite** + **React 18** + **Tailwind CSS v3**
- **Lucide React** for iconography
- **JetBrains Mono** (telemetry) + **Inter** (UI)

## Design tokens

| Token | Value | Role |
|---|---|---|
| `ink` | `#090D16` | Page background (Deep Space Obsidian) |
| `card` | `#131B2E` | Card surface |
| `cyan` | `#06B6D4` | Starlight Cyan — Ledger / Buyer accent |
| `indigo` | `#6366F1` | Midnight Indigo — Witness / Supplier states |
| `amber` | `#F59E0B` | Auditor / Regulator |
| `success` | `#4CAF50` | ZK proof ready, settled |

## 3-role dashboard

| Role | View |
|---|---|
| **Enterprise Buyer** | Public ledger, sealed-bid counter, circuit telemetry, can/can't list |
| **Competing Suppliers (A / B)** | Isolated bid form per supplier, ZK proof generation animation, post-deadline reveal |
| **Legal Auditor** | Compact circuit eval panel, selective-reveal controls, immutable on-chain log |

## Dev

```bash
# Install (security-safe)
pnpm install --ignore-scripts   # or: npm install --ignore-scripts

# Dev server
pnpm dev

# Production build
pnpm build
pnpm preview
```

## Lifecycle demo

The `DemoControls` bar at the top drives a shared auction state machine:

**OPEN → SEALED → RESOLVED → (reset)**

Each role view reacts to the current state — the buyer's ledger updates, supplier forms lock, the auditor's reveal panel unlocks.

## Source structure

```
src/
├── App.jsx                     # Root — LangCtx, role state, countdown
├── main.jsx                    # React entry
├── index.css                   # Tailwind directives + custom utilities
├── lib/
│   └── i18n.js                 # EN/ES dictionary + auction constants
└── components/
    ├── ui.jsx                  # Pill, Card, KPI, Hash, ZkBadge, LedgerLine, TelRow…
    ├── GovernanceBar.jsx       # Sticky topbar + LifecycleStrip
    └── DemoControls.jsx        # State-machine control card
views/
├── BuyerView.jsx
├── SupplierView.jsx
└── AuditorView.jsx
```
