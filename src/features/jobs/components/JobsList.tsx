import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useJobsStore } from '@/stores/jobsStore';
import { jobsApi } from '@/lib/api/jobs';
import { JobCard } from './JobCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import type { Job } from '@/types';

interface JobsListProps {
  onCreateJob: () => void;
  onEditJob: (job: Job) => void;
}

export function JobsList({ onCreateJob, onEditJob }: JobsListProps) {
  const {
    jobs,
    filters,
    pagination,
    isLoading,
    error,
    setJobs,
    setFilters,
    setPage,
    setLoading,
    setError,
    updateJob,
    reorderJobs
  } = useJobsStore();

  const [searchInput, setSearchInput] = useState(filters.search || '');
  

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadJobs();
  }, [filters.page, filters.status, filters.sort]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters({ search: searchInput, page: 1 });
        loadJobs();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  async function loadJobs() {
    try {
      setLoading(true);
      setError(null);
      const response = await jobsApi.getJobs(filters);
      setJobs(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }

  async function handleArchiveToggle(job: Job) {
    try {
      const newStatus = job.status === 'active' ? 'archived' : 'active';
      await jobsApi.updateJob(job.id, { status: newStatus });
      updateJob(job.id, { status: newStatus });
    } catch (err) {
      console.error('Failed to toggle archive status:', err);
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = jobs.findIndex(job => job.id === active.id);
    const newIndex = jobs.findIndex(job => job.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedJobs = arrayMove(jobs, oldIndex, newIndex);

    // Optimistic update
    const previousJobs = [...jobs];
    reorderJobs(reorderedJobs);

    try {
      // Send reorder request to API
      await jobsApi.reorderJob(
        active.id as string,
        jobs[oldIndex].order,
        jobs[newIndex].order
      );
    } catch (err) {
      // Rollback on failure
      console.error('Failed to reorder jobs, rolling back:', err);
      reorderJobs(previousJobs);
      setError('Failed to reorder jobs. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  }

  

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Jobs Board</h1>
          <p className="text-muted-foreground mt-1">Manage job postings and opportunities</p>
        </div>
        <Button onClick={onCreateJob}>
          <Plus className="w-4 h-4 mr-2" />
          Create Job
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs by title or tags..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant={filters.status === '' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilters({ status: '', page: 1 })}
          >
            All
          </Button>
          <Button
            variant={filters.status === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilters({ status: 'active', page: 1 })}
          >
            Active
          </Button>
          <Button
            variant={filters.status === 'archived' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilters({ status: 'archived', page: 1 })}
          >
            Archived
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && jobs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Loading jobs...
        </div>
      )}

      {/* Jobs List */}
      {!isLoading && jobs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No jobs found. {filters.search || filters.status ? 'Try adjusting your filters.' : 'Create your first job to get started.'}
        </div>
      )}

      {jobs.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={jobs.map(j => j.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {jobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  onEdit={onEditJob}
                  onArchiveToggle={handleArchiveToggle}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total} jobs
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={page === pagination.page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
