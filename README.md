<h1 align="center">OS Memory Segmentation Simulator</h1>

<p align="center">
  <strong>A desktop GUI application that simulates OS memory management using segmentation.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=for-the-badge" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=for-the-badge" alt="Vite"/>
  <img src="https://img.shields.io/badge/Electron-47848F?logo=electron&logoColor=white&style=for-the-badge" alt="Electron"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge" alt="Tailwind CSS"/>
</p>

<p align="center">
  <a href="https://github.com/Mohamedkhaled687/OS_Memory_Segmentation_Simulator">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?logo=github&style=for-the-badge" alt="GitHub Repo"/>
  </a>
</p>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Architecture](#architecture)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Allocation Algorithms](#allocation-algorithms)
- [Technologies](#technologies)
- [License](#license)

---

## About

Built for **CSE335s - Operating Systems** at Ain Shams University, Faculty of Engineering. This simulator demonstrates how an OS manages memory using **segmentation** — a scheme where each process is divided into logical segments (Code, Data, Stack) that are independently allocated into free memory partitions (holes).

The application supports **First-Fit** and **Best-Fit** allocation strategies, **transactional allocation** (all-or-nothing), and **automatic coalescing** of adjacent holes upon deallocation.

---

## Features

| Feature | Description |
|---------|-------------|
| **Memory Initialization** | Define total memory and initial free partitions (holes) |
| **First-Fit Allocation** | Allocates in the first hole large enough |
| **Best-Fit Allocation** | Allocates in the smallest sufficient hole |
| **Transactional Rollback** | If any segment fails, the entire process allocation is cancelled |
| **Deallocation + Coalescing** | Freed segments become holes; adjacent holes merge automatically |
| **Live Memory Canvas** | Color-coded real-time visualization of memory layout |
| **Segment Tables** | Per-process tables showing segment name, size, and base address |
| **Free Partitions Table** | Live table of all current holes |
| **Event Logging** | Success/error/info logs for every operation |
| **Desktop App** | Cross-platform via Electron |

---

## Architecture

The project follows a strict **MVVM (Model-View-ViewModel)** pattern:

```mermaid
graph TD
    subgraph "View Layer (React Components)"
        A[App.tsx] --> B[TopAppBar]
        A --> C[Sidebar]
        A --> D[InitializationPanel]
        A --> E[AllocationPanel]
        A --> F[DeallocationPanel]
        A --> G[MemoryCanvas]
        A --> H[HolesTable]
        A --> I[ProcessTable]
        A --> J[LogPanel]
    end

    subgraph "ViewModel Layer (Custom Hook)"
        K[useMemorySimulator]
    end

    subgraph "Model Layer (Pure TypeScript)"
        L[MemoryManager class]
        M[types.ts Interfaces]
    end

    A -- "calls hook" --> K
    K -- "state + actions" --> A
    K -- "owns instance via useRef" --> L
    L -- "implements" --> M

    style A fill:#2196F3,color:#fff
    style K fill:#FF9800,color:#fff
    style L fill:#4CAF50,color:#fff
    style M fill:#4CAF50,color:#fff
```

| Layer | Responsibility | Files |
|-------|---------------|-------|
| **Model** | Pure OS logic — zero UI knowledge | `src/model/types.ts`, `src/model/MemoryManager.ts` |
| **ViewModel** | Bridges Model to View via React hooks | `src/viewmodel/useMemorySimulator.ts` |
| **View** | Renders UI, never calls Model directly | `src/components/*.tsx`, `src/App.tsx` |

### Data Flow

```
User Action → View → ViewModel (Hook) → Model → Result
                ↑                                    |
                └──── setState triggers re-render ←──┘
```

---

## Screenshots

These use paths under `assets/`. **They only render on GitHub after you commit and push those PNG files** (the folder was previously untracked).

### System Initialization
<p align="center">
  <img src="./assets/Test1_FirstFit_AddHoles.png" alt="System Initialization" width="90%"/>
</p>

### Process Allocation (First-Fit)
<p align="center">
  <img src="./assets/Test1_FirstFit_AllocateProcess1.png" alt="First-Fit Allocation" width="90%"/>
</p>

### Process Allocation (Best-Fit)
<p align="center">
  <img src="./assets/Test2_BestFit_AllocateProcess1.png" alt="Best-Fit Allocation" width="90%"/>
</p>

### Deallocation with Coalescing
<p align="center">
  <img src="./assets/Test1_FirstFit_DeallocateProcess1.png" alt="Deallocation with Coalescing" width="90%"/>
</p>

### Allocation Error (Transactional Rollback)
<p align="center">
  <img src="./assets/Test1_FirstFit_AllocateProcess3_Error.png" alt="Allocation Error" width="90%"/>
</p>

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/Mohamedkhaled687/OS_Memory_Segmentation_Simulator.git
cd OS_Memory_Segmentation_Simulator

# Install dependencies
npm install
```

### Development

```bash
# Run in browser (hot reload)
npm run dev

# Run as Electron desktop app
npm run dev:electron
```

### Production Build

```bash
# Build for production
npm run build:electron

# Package as .exe / AppImage
npm run package:electron
```

---

## Project Structure

```
OS_Memory_Segmentation_Simulator/
├── electron/
│   ├── main.ts                 # Electron main process
│   └── preload.ts              # Secure context bridge
├── src/
│   ├── model/                  # Pure OS logic (no React)
│   │   ├── types.ts            # TypeScript interfaces
│   │   └── MemoryManager.ts    # First-Fit, Best-Fit, Coalescing
│   ├── viewmodel/              # React state bridge
│   │   └── useMemorySimulator.ts
│   ├── components/             # UI components
│   │   ├── TopAppBar.tsx       # Header with system status
│   │   ├── Sidebar.tsx         # Navigation panel
│   │   ├── InitializationPanel.tsx
│   │   ├── AllocationPanel.tsx
│   │   ├── DeallocationPanel.tsx
│   │   ├── MemoryCanvas.tsx    # Visual memory map
│   │   ├── HolesTable.tsx      # Free partitions table
│   │   ├── ProcessTable.tsx    # Segment tables
│   │   └── LogPanel.tsx        # Event log
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # React entry point
│   └── index.css               # Tailwind + custom styles
├── .github/workflows/
│   └── build.yml               # CI/CD pipeline
├── scripts/
│   └── electron-builder.yml    # Packaging config
├── assets/                     # Images and icons (PNG screenshots — commit these for README images)
├── report/
│   ├── report.tex              # LaTeX source
│   └── report.pdf              # Compiled project report
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

---

## Allocation Algorithms

### First-Fit
Scans holes from the lowest address and allocates in the **first** hole that is large enough. Fast but can fragment the beginning of memory.

### Best-Fit
Scans **all** holes and allocates in the **smallest** hole that still fits. Minimizes wasted space per allocation but can create tiny unusable fragments.

### Coalescing
When a process is deallocated, its segments become holes. If two holes are adjacent in memory (`hole.start + hole.size === nextHole.start`), they are merged into one larger hole to combat external fragmentation.

### Test Results Summary

| Operation | First-Fit | Best-Fit |
|-----------|-----------|----------|
| P1 Allocate | ✅ | ✅ |
| P2 Allocate | ✅ | ✅ |
| P3 Allocate | ❌ Fails | ✅ Succeeds |
| P1 Deallocate | ✅ | ✅ |
| P4 Allocate | ✅ Succeeds | ❌ Fails |

> **Key Insight:** No single allocation strategy is universally better. First-Fit is faster but wastes space; Best-Fit minimizes waste but creates tiny fragments.

---

## Technologies

| Technology | Purpose |
|------------|---------|
| <img src="https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square" alt="TS"/> **TypeScript** | Strict type safety for logic and UI |
| <img src="https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=flat-square" alt="React"/> **React 18** | Component-based UI with hooks |
| <img src="https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white&style=flat-square" alt="Vite"/> **Vite** | Fast build tool with HMR |
| <img src="https://img.shields.io/badge/-Tailwind-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square" alt="TW"/> **Tailwind CSS** | Utility-first dark-theme styling |
| <img src="https://img.shields.io/badge/-Electron-47848F?logo=electron&logoColor=white&style=flat-square" alt="Electron"/> **Electron** | Desktop wrapper (Chromium + Node.js) |
| <img src="https://img.shields.io/badge/-GitHub_Actions-2088FF?logo=githubactions&logoColor=white&style=flat-square" alt="GHA"/> **GitHub Actions** | CI/CD automated build pipeline |

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <strong>Built for CSE335s — Operating Systems</strong><br/>
  <strong>Ain Shams University, Faculty of Engineering</strong><br/><br/>
  <a href="https://github.com/Mohamedkhaled687/OS_Memory_Segmentation_Simulator">
    <img src="https://img.shields.io/badge/View_on_GitHub-181717?logo=github&logoColor=white&style=for-the-badge" alt="GitHub"/>
  </a>
</p>
