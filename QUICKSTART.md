# Quick Start Guide

## Getting Started in 3 Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open the App
Navigate to **http://localhost:** in your browser

## What You'll See

The app will automatically:
- Initialize IndexedDB with seed data (25 jobs, 1000 candidates, 3 assessments)
- Start Mock Service Worker (MSW) to simulate API calls
- Display the Jobs Board with all features ready to use

## Features to Try

### Search & Filter
- Type in the search box to find jobs by title or tags
- Click "Active", "Archived", or "All" to filter jobs

### Create a New Job
- Click "Create Job" button
- Fill in the form (title is required)
- Tags: type and press Enter or comma to add
- Click "Create Job" to save

### Edit a Job
- Click the edit icon (pencil) on any job card
- Modify any field
- Click "Update Job" to save

### Archive/Unarchive
- Click the archive icon on any job card
- Or open a job detail and use the Archive button

### Drag to Reorder
- Grab the grip handle (⋮⋮) on any job card
- Drag to reorder jobs in the list
- Watch for optimistic updates!
- Some reorder operations will fail (simulated 8% error rate) - you'll see automatic rollback

### Deep Linking
- Click on a job title or the external link icon
- Share the URL - it goes directly to that job
- Example: http://localhost:5173/jobs/[job-id]

## Data Persistence

All your changes are saved to IndexedDB:
- Create, edit, archive jobs
- Reorder jobs
- Everything persists across page refreshes

To reset the data, open DevTools Console and run:
```javascript
indexedDB.deleteDatabase('TalentFlowDB')
```
Then refresh the page.

## Network Simulation

The app simulates real network conditions:
- **Latency**: 200-1200ms random delay on all API calls
- **Error Rate**: 5-10% failure rate on write operations (especially reorder)
- Check the browser console to see API logs

## Troubleshooting

### Port Already in Use
If port 5173 is busy:
```bash
npm run dev -- --port 3000
```

### Clear Cache
If you see stale data:
1. Open DevTools
2. Application tab → Clear storage
3. Refresh the page

### MSW Not Working
Make sure you're accessing via `localhost` (not `127.0.0.1` or custom domain)






Enjoy exploring TalentFlow! 
