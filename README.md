# TalentFlow - Mini Hiring Platform

A modern, feature-rich hiring platform built with React, TypeScript, and cutting-edge web technologies. This is a front-end only application that simulates a complete hiring workflow with local data persistence and API mocking.

## Live Demo

**Development Server**: [http://localhost:5173](http://localhost:5173)

## Features Implemented

### 1: Jobs Board 

- **Jobs List View**
  - Server-like pagination with configurable page sizes
  - Real-time search by job title and tags
  - Filter by status (All, Active, Archived)
  - Responsive grid layout with job cards
  - Loading states and error handling

- **Create/Edit Jobs**
  - Modal-based job form with full validation
  - Required fields: Title (auto-generates unique slug)
  - Optional fields: Department, Location, Description
  - Dynamic tags system (add/remove tags)
  - Status toggle (Active/Archived)
  - Form validation with error messages

- **Archive/Unarchive**
  - Quick toggle from job cards
  - Available from detail pages
  - Persists to IndexedDB via MSW

- **Drag-and-Drop Reordering**
  - Intuitive drag-and-drop interface using @dnd-kit
  - Optimistic UI updates for instant feedback
  - Automatic rollback on server errors
  - Visual feedback during dragging
  - 5-10% simulated error rate to test rollback

- **Deep Linking**
  - Direct navigation to jobs via `/jobs/:jobId`
  - Full job details page with edit capabilities
  - Breadcrumb navigation back to jobs list

### 2: Candidates 

- **Virtualized List View**
  - 1000+ candidates with smooth scrolling using @tanstack/react-virtual
  - Client-side search by name and email
  - Server-like filtering by stage (Applied, Screening, Technical, Offer, Hired, Rejected)
  - Responsive layout with candidate cards

- **Kanban Board**
  - Visual pipeline with 6 stage columns
  - Drag-and-drop candidates between stages
  - Optimistic updates with automatic rollback on errors
  - Real-time stage count per column

- **Candidate Profile**
  - Comprehensive profile view with timeline
  - Stage history timeline showing all transitions
  - Contact information and application details
  - Deep linking via `/candidates/:id`

- **Notes System**
  - Add notes to candidates
  - @mention support with autocomplete suggestions
  - Real-time mention highlighting
  - Note history with timestamps

### 3: Assessments 

- **Assessment Builder**
  - Visual builder interface with sidebar and canvas
  - Add and organize sections
  - Add questions to sections
  - Edit section titles and descriptions
  - Live save functionality

- **Question Types**
  - Single Choice (radio buttons)
  - Multiple Choice (checkboxes)
  - Short Text (single line input)
  - Long Text (textarea)
  - Numeric (with min/max validation)
  - File Upload (stub for file selection)

- **Live Preview Pane**
  - Real-time preview of assessment as you build
  - Split-screen builder + preview layout
  - Toggle preview visibility
  - Shows exactly how candidates will see the form

- **Form Runtime with Validation**
  - Required field validation
  - Numeric range validation (min/max)
  - Text length validation (min/max length)
  - Real-time validation feedback
  - Error messages on invalid input

- **Conditional Question Logic**
  - Show/hide questions based on previous answers
  - Simple conditional rules (if Q1 === "Yes", show Q2)
  - Visual indicator for conditional questions
  - Dynamic form updates as user answers

## Tech Stack

### Core
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### State & Data
- **Zustand** - Lightweight state management
- **Dexie** - IndexedDB wrapper for local persistence
- **MSW (Mock Service Worker)** - API mocking with artificial latency

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui principles** - Accessible component patterns
- **Lucide React** - Icon library

### Drag & Drop
- **@dnd-kit/core** - Modern drag-and-drop toolkit
- **@dnd-kit/sortable** - Sortable list functionality

### Forms & Validation
- **React Hook Form** - Performant form handling
- **Zod** - TypeScript-first schema validation

### Routing
- **React Router v6** - Client-side routing with deep linking

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Input, Dialog, etc.)
│   └── shared/          # Shared feature components
├── features/
│   └── jobs/            # Jobs feature module
│       ├── components/  # JobsList, JobCard, JobFormDialog, JobDetail
│       └── JobsPage.tsx # Main jobs page
├── lib/
│   ├── api/            # API client functions
│   ├── db/             # Dexie database setup and helpers
│   └── utils/          # Utility functions
├── mocks/
│   ├── handlers.ts     # MSW request handlers
│   ├── browser.ts      # MSW browser worker setup
│   ├── seedData.ts     # Seed data generation
│   └── init.ts         # Database initialization
├── stores/             # Zustand stores
│   └── jobsStore.ts    # Jobs state management
└── types/              # TypeScript type definitions
```

## Architecture Decisions

### 1. **Local-First Architecture**
- All data persists to IndexedDB via Dexie
- MSW acts as a "network layer" simulating REST API
- Data survives page refreshes
- No real backend required

### 2. **Optimistic UI Updates**
- Immediate UI feedback for drag-and-drop
- Automatic rollback on server errors
- Better perceived performance

### 3. **Component-Based Architecture**
- Feature-based organization (jobs, candidates, assessments)
- Reusable UI components following shadcn/ui patterns
- Separation of concerns (UI, state, API)

### 4. **Type Safety**
- Comprehensive TypeScript types for all entities
- Strict type checking enabled
- Runtime validation with Zod

### 5. **Simulated Network Conditions**
- 200-1200ms artificial latency
- 5-10% error rate on write operations
- Tests resilience and error handling

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd talentflow
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Seed Data

The application automatically seeds the database on first run with:
- **25 jobs** (mix of active and archived)
- **1,000 candidates** (randomly distributed across jobs and stages)
- **3 assessments** (with 10+ questions each)

Data persists in IndexedDB (`TalentFlowDB`) and survives page refreshes.

## API Endpoints (Mocked)

### Jobs
- `GET /api/jobs` - List jobs with pagination, search, filtering
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create new job
- `PATCH /api/jobs/:id` - Update job


## Known Issues & Limitations

1. **No Authentication** - This is a demo application without user auth
2. **Client-Side Only** - All data is local to the browser
3. **No Real Backend** - MSW simulates API, not a real server
4. **Limited Validation** - Basic validation only (can be extended)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

IndexedDB and Service Workers required.

## Performance Considerations

- **Pagination** - Jobs list is paginated (default 10 per page)
- **Lazy Loading** - Routes are code-split
- **Optimistic Updates** - Instant UI feedback
- **Efficient Re-renders** - Zustand for minimal re-renders

## Future Enhancements
- Export data (CSV, JSON)
- Bulk operations
- Advanced filtering
- Analytics dashboard

<<<<<<< HEAD

=======
>>>>>>> 66dfb18029b1afd2a82df8976dad2833726a0001
### Bonus Features
- Dark mode support


## Contributing

This is a technical assignment project. For production use, consider:
- Adding real backend integration
- Implementing authentication
- Adding unit and E2E tests
- Enhancing accessibility
- Adding more comprehensive validation

## License

MIT

---








