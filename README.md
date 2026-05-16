# SIDERIS 🌌

**Decentralized, Zero-Leakage Bidding Infrastructure for Enterprise Procurement.**

Built natively on the **Midnight Mainnet** using Compact.

---

## 🎯 Mission
To eliminate information leakage, front-running, and internal corruption in high-value enterprise auctions, transforming corporate procurement from a system based on blind trust into an uncompromisable, cryptographically audited governance infrastructure.

## ⚡ The Problem (The $Trillion Corruption & Leakage Loophole)
In global logistics, Ag-Tech, and industrial procurement, companies lose billions annually due to bid rigging and internal information leakage. 
* **The Centralized Failure:** Current procurement software relies on database administrators or corruptible internal employees who accept bribes to filter competitor pricing before the auction closes.
* **The Web3 Failure:** Traditional public blockchains (like Ethereum or Solana) expose bid data in the mempool or public states, allowing competitors to execute commercial front-running.

Businesses need **immutable history** to prevent fraud, but they require **absolute data isolation** to protect supplier margins and trade secrets.

## 🚀 The Solution: SIDERIS
SIDERIS is a Next-Generation Governance Engine that facilitates completely confidential, sealed-bid corporate auctions. By leveraging Midnight's dual-state architecture, SIDERIS guarantees that **no one**—not even the company hosting the auction—can view or expose the competing bids before the official deadline.

### Key Innovations
* **Zero-Leakage State Aisolation:** Bids are processed locally in the user's browser (Witness Context). Only mathematically verifiable proofs of submission travel to the ledger.
* **Autonomous Cryptographic Evaluation:** Once the deadline hits, a Compact circuit evaluates all encrypted states internally, programmatically declaring the optimal winner without ever exposing the losing parties' private margins.
* **Selective Reveal (Compliant Privacy):** Complete cryptographic privacy is combined with institutional compliance. A specialized governance key allows an independent auditor or regulator to decrypt historical data strictly under official dispute or anti-collusion investigations.

---

## 🛠️ Midnight Native Architecture (Compact Spec)

SIDERIS utilizes Midnight's data protection features to divide state and execution cleanly:

1. **Public Ledger Context (On-Chain):**
   * Tracks auction metadata (`auction_deadline`, `buyer_public_key`, `auditor_public_key`).
   * Increments an anonymous counter of submitted proposals (`bids_count`).
   * Publishes *only* the finalized `winner_id` and contract execution state.

2. **Private Witness Context (Off-Chain Client):**
   * Manages sensitive parameters (`raw_bid_amount`, `supplier_secret_key`) entirely within the supplier's edge node.

3. **Compact Circuit Logic:**
   * `submit_bid`: Generates ZK-proofs confirming the bid is valid, properly structured, and timestamped.
   * `evaluate_auction`: Compares isolated values under zero-knowledge conditions to emit a verifiable winner.
   * `selective_reveal`: Grants viewing capabilities exclusively to the chosen auditor or the verified winner for contract execution.

---

## 📦 MVP Stack & Architecture

* **Smart Contracts:** Compact (Midnight SDK)
* **Frontend:** React.js + Vite + Tailwind CSS (Optimized for instantaneous role-switching simulation)
* **Icons & UI:** Lucide React + JetBrains Mono (For secure cryptographic telemetry display)
* **Local Node:** Midnight Sandbox

---

## 🗺️ Startup Roadmap & Build Club Vision

SIDERIS is designed from day one to scale into an Enterprise SaaS integration layer:
* **Phase 1 (Hackathon MVP):** Core Compact bidding circuits and multi-role simulator dashboard.
* **Phase 2 (Build Club Incubator):** Implementation of multi-criteria decision circuits (evaluating not just price, but delivery times and sustainability scores via ZK).
* **Phase 3 (Enterprise Pilot):** API integrations with legacy ERP systems (SAP, Oracle) to allow traditional enterprises to use SIDERIS without changing their current accounting workflows.

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the Midnight Sandbox, Compact compiler, and `pnpm` installed globally.
```bash
corepack enable pnpm
