# TalentFlow - Mini Hiring Platform

A modern front-end hiring platform built with **React**, **TypeScript**, and **Zustand**, simulating a full recruitment workflow using **IndexedDB** and **MSW** for local persistence and API mocking.

## Evaluation Highlights

*   **State Management**: Implemented using Zustand for global state and Dexie (IndexedDB) for persistence.
*   **Deployment**: Fully deployed on Vercel, accessible through the live demo link.
*   **Documentation**: Detailed setup guide, feature breakdown, and architecture explanation.
*   **Bonus Features**: Includes Dark mode and optimistic updates.

## Live Demo

[https://talentflow-c.vercel.app](https://talentflow-c.vercel.app)

## Features Implemented

*   **Jobs Board**: Create, edit, archive, and reorder job postings with drag-and-drop.
*   **Candidates Pipeline**: Manage candidates in a Kanban board and view detailed profiles.
*   **Assessments Builder**: Dynamically create custom assessments for jobs.

## Tech Stack

*   **React 18** & **TypeScript**
*   **Vite**
*   **Zustand** & **Dexie (IndexedDB)**
*   **Mock Service Worker (MSW)**
*   **Tailwind CSS**
*   **@dnd-kit/core**
*   **React Hook Form** & **Zod**
*   **React Router v6**

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start the development server**:
    ```bash
    npm run dev
    ```
3.  **Open your browser** to `http://localhost:5173`.

## Documentation

*   **[Quick Start Guide](QUICK_START_GUIDE.md)**: A guide to quickly get the application running and try out the features.
*   **[Setup Guide](SETUP_GUIDE.md)**: Detailed setup instructions.
*   **[Implementation](IMPLEMENTATION.md)**: In-depth explanation of the technical implementation.
