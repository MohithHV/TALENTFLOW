import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { jobsApi } from '@/lib/api/jobs';
import { useJobsStore } from '@/stores/jobsStore';
import { generateSlug } from '@/lib/utils';
import { X } from 'lucide-react';
import type { Job } from '@/types';

interface JobFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job?: Job | null;
}

interface JobFormData {
  title: string;
  slug: string;
  description: string;
  location: string;
  department: string;
  status: 'active' | 'archived';
  tags: string[];
}

export function JobFormDialog({ open, onOpenChange, job }: JobFormDialogProps) {
  const { addJob, updateJob } = useJobsStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<JobFormData>({
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      location: '',
      department: '',
      status: 'active',
      tags: []
    }
  });

  const titleValue = watch('title');

  // Auto-generate slug from title
  useEffect(() => {
    if (titleValue && !job) {
      setValue('slug', generateSlug(titleValue));
    }
  }, [titleValue, job, setValue]);

  // Load job data when editing
  useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        slug: job.slug,
        description: job.description || '',
        location: job.location || '',
        department: job.department || '',
        status: job.status,
        tags: job.tags
      });
      setTags(job.tags);
    } else {
      reset({
        title: '',
        slug: '',
        description: '',
        location: '',
        department: '',
        status: 'active',
        tags: []
      });
      setTags([]);
    }
    setError(null);
  }, [job, reset, open]);

  function handleAddTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();

      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
        setTagInput('');
      }
    }
  }

  function handleRemoveTag(tagToRemove: string) {
    setTags(tags.filter(tag => tag !== tagToRemove));
  }

  async function onSubmit(data: JobFormData) {
    try {
      setIsSubmitting(true);
      setError(null);

      const jobData = {
        ...data,
        tags
      };

      if (job) {
        // Update existing job
        const updatedJob = await jobsApi.updateJob(job.id, jobData);
        updateJob(job.id, updatedJob);
      } else {
        // Create new job
        const newJob = await jobsApi.createJob(jobData);
        addJob(newJob);
      }

      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save job');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{job ? 'Edit Job' : 'Create New Job'}</DialogTitle>
          <DialogClose onClose={() => onOpenChange(false)} />
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Job Title <span className="text-destructive">*</span>
            </label>
            <Input
              {...register('title', { required: 'Title is required' })}
              placeholder="e.g. Senior Software Engineer"
            />
            {errors.title && (
              <p className="text-destructive text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Slug <span className="text-destructive">*</span>
            </label>
            <Input
              {...register('slug', { required: 'Slug is required' })}
              placeholder="e.g. senior-software-engineer"
            />
            {errors.slug && (
              <p className="text-destructive text-sm mt-1">{errors.slug.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              URL-friendly identifier (auto-generated from title)
            </p>
          </div>

          {/* Department & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <Input
                {...register('department')}
                placeholder="e.g. Engineering"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input
                {...register('location')}
                placeholder="e.g. Remote, San Francisco"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register('description')}
              placeholder="Describe the role and responsibilities..."
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type a tag and press Enter or comma"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Press Enter or comma to add a tag
            </p>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="pl-2 pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              {...register('status')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
