# 🌱 ParaYield Lab

**ParaYield Lab** is an advanced **Yield Simulation & Backtesting Engine** designed specifically for the Polkadot Ecosystem. It empowers DeFi users and strategists to simulate liquidity provision, analyze Impermanent Loss (IL), and optimize cross-chain (XCM) yield strategies across major parachains like **Bifrost, Acala, and Hydration**.

Built with a dark-mode "Grass Node" UI, it provides a professional, data-driven environment for making informed DeFi decisions on Polkadot.

---

## ✨ Key Features

- 📊 **Historical Backtesting Engine:** Run your DeFi strategies on real historical data from major Polkadot parachains to evaluate performance.
- 📉 **IL Simulator:** Simulate and visualize Impermanent Loss based on historical price volatility before risking capital.
- 🌉 **XCM Fee Optimizer:** Precisely calculate cross-chain hops and routing costs down to the micro-dot.
- 🔄 **Real-time Ecosystem Indexing:** Track 120+ live pools and $450M+ in liquid assets with continuous synchronization.
- 🎨 **Grass Node Design System:** A highly optimized, terminal-inspired Glassmorphism UI (Deep Black `#020402` & Neon Green `#00FFA3`).

---

## 🛠️ Technology Stack

- **Framework:** Next.js 15 (React 19)
- **Styling:** Tailwind CSS v4
- **UI Architecture:** shadcn/ui + Radix UI Primitives + Framer Motion
- **Package Manager: pnpm** (Strictly required for deterministic dependency resolution)
- **Language:** TypeScript

---

## 🚀 How to Run the Project (For Judges)

### 📌 Prerequisites
1. **Node.js**: Require version `18.17.0` or higher.
2. **pnpm**: This project strictly uses `pnpm` as the package manager. If you don't have it installed, you can install it globally via npm:
   ```bash
   npm install -g pnpm
   ```

### 💻 Installation & Setup

**Step 1. Clone the repository and navigate into the project:**
```bash
git clone <repository_url>
cd ParaYield_Lab-FE
```

**Step 2. Install dependencies:**
> **⚠️ IMPORTANT:** You MUST use `pnpm` to install dependencies to respect the `pnpm-workspace.yaml` and `pnpm-lock.yaml`.

```bash
pnpm install
```

**Step 3. Start the development server:**
```bash
pnpm dev
```

**Step 4. View the App:**
Open your browser and navigate to: [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Project Structure Context

- `src/app/` - Next.js App Router definitions (Pages and Layouts).
- `src/components/` - Reusable UI components, including the custom shadcn/ui components adhering to the Grass Node design system.
- `src/lib/` - Utility functions and configurations (e.g., Tailwind class merging).
- `public/BG/` - Asset directory for the smooth animated hero background sequence.

---

*Built with ❤️ for the Polkadot Hackathon.*
