# Resume AI — Monorepo Architecture

This repository contains both the **Frontend** client and the **Backend** API service for **Resume AI**.

## Directory Structure

```
Resume AI/
├── frontend/             # TanStack Start / React 19 / Tailwind v4 Client
│   ├── src/              # Routes, Components, UI Elements, Hooks & Utilities
│   ├── public/           # Static Assets
│   ├── package.json      # Frontend Dependencies & Scripts
│   └── vite.config.ts    # Vite & TanStack Start Config
│
├── backend/              # Node.js / Express / TypeScript API Service
│   ├── src/              # Controllers, Routes, Services & Server Entry
│   ├── package.json      # Backend Dependencies & Scripts
│   └── tsconfig.json     # NodeNext TypeScript Config
│
└── README.md             # Project Root Overview
```

## Running the Applications

### 1. Frontend Development
```sh
cd frontend
npm install
npm run dev
```

### 2. Backend Development
```sh
cd backend
npm install
npm run dev
```
