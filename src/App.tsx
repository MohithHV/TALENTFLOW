import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/shared/Navigation';
import { JobsPage } from './features/jobs/JobsPage';
import { JobDetail } from './features/jobs/components/JobDetail';
import { JobFormDialog } from './features/jobs/components/JobFormDialog';
import { CandidatesPage } from './features/candidates/CandidatesPage';
import { CandidateProfile } from './features/candidates/components/CandidateProfile';
import { AssessmentBuilder } from './features/assessments/components/AssessmentBuilder';
import type { Job } from './types';

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  function handleEditJob(job: Job) {
    setEditingJob(job);
    setIsFormOpen(true);
  }

  function handleCloseForm() {
    setIsFormOpen(false);
    setEditingJob(null);
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Navigation />

        <Routes>
          <Route path="/" element={<Navigate to="/jobs" replace />} />

          {/* Jobs Routes */}
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:id" element={<JobDetail onEditJob={handleEditJob} />} />

          {/* Candidates Routes */}
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/candidates/:id" element={<CandidateProfile />} />

          {/* Assessments Routes */}
          <Route path="/assessments/:jobId" element={<AssessmentBuilder />} />

          <Route path="*" element={<Navigate to="/jobs" replace />} />
        </Routes>

        <JobFormDialog
          open={isFormOpen}
          onOpenChange={handleCloseForm}
          job={editingJob}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
