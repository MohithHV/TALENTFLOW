# TalentFlow - Quick Setup Guide

This is a portable version of TalentFlow ready to run on any computer!

## Quick Start (3 Steps)

### Step 1: Install Node.js (if not installed)

**Check if Node.js is installed:**
```bash
node --version
```

If you see a version number (v18.0.0 or higher), skip to Step 2.

**If not installed, download from:**
- https://nodejs.org/ (Download LTS version)
- Install it and restart your terminal

### Step 2: Install Dependencies

Open terminal/command prompt in this folder and run:

```bash
npm install
```

⏱This will take 2-5 minutes. You'll see a progress bar.

### Step 3: Start the Application

```bash
npm run dev
```

You should see:
```
VITE v7.1.12  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Step 4: Open in Browser

Open your browser and go to:
```
http://localhost:5173
```

**That's it! The app is running!**

---

## What's Included

Complete source code
All configuration files
Documentation (README.md)
Quick start guide (QUICKSTART.md)
Implementation details (IMPLEMENTATION_SUMMARY.md)

node_modules/ - Will be installed when you run `npm install`
dist/ - Build output (not needed for development)

---

## Features

- **Jobs Board** - Manage job postings with drag-and-drop
- **Candidates** - Track 1000+ candidates with kanban board
- **Assessments** - Build custom questionnaires with live preview

---



### "npm: command not found"
→ Node.js is not installed. Install from https://nodejs.org/

### "Port 5173 is already in use"
→ Another app is using this port. Use a different port:
```bash
npm run dev -- --port 3000
```

### Dependencies fail to install
→ Clear cache and retry:
```bash
npm cache clean --force
npm install
```

### Want to reset the database?
→ Open browser DevTools (F12) → Application → IndexedDB → Delete "TalentFlowDB" → Refresh

---

- Check README.md for detailed documentation
- Check QUICKSTART.md for feature guide
- Check IMPLEMENTATION_SUMMARY.md for technical details

---
**Built with React, TypeScript, Vite, Zustand, Dexie, MSW, Tailwind CSS**
