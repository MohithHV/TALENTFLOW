import { useState } from 'react';
import { JobsList } from './components/JobsList';
import { JobFormDialog } from './components/JobFormDialog';
import type { Job } from '@/types';

export function JobsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  function handleCreateJob() {
    setEditingJob(null);
    setIsFormOpen(true);
  }

  function handleEditJob(job: Job) {
    setEditingJob(job);
    setIsFormOpen(true);
  }

  function handleCloseForm() {
    setIsFormOpen(false);
    setEditingJob(null);
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <JobsList onCreateJob={handleCreateJob} onEditJob={handleEditJob} />

      <JobFormDialog
        open={isFormOpen}
        onOpenChange={handleCloseForm}
        job={editingJob}
      />
    </div>
  );
}
