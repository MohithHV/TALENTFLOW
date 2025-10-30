import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { jobsApi } from '@/lib/api/jobs';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Edit, Archive, ArchiveRestore } from 'lucide-react';
import type { Job } from '@/types';

interface JobDetailProps {
  onEditJob: (job: Job) => void;
}

export function JobDetail({ onEditJob }: JobDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadJob(id);
    }
  }, [id]);

  async function loadJob(jobId: string) {
    try {
      setIsLoading(true);
      setError(null);
      const data = await jobsApi.getJobById(jobId);
      setJob(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleArchiveToggle() {
    if (!job) return;

    try {
      const newStatus = job.status === 'active' ? 'archived' : 'active';
      await jobsApi.updateJob(job.id, { status: newStatus });
      setJob({ ...job, status: newStatus });
    } catch (err) {
      console.error('Failed to toggle archive status:', err);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center py-12 text-muted-foreground">
          Loading job details...
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error || 'Job not found'}</p>
          <Button onClick={() => navigate('/jobs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link to="/jobs">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>

          <div className="flex items-start gap-3 mb-2">
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
              {job.status}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground">
            {job.department && <span>{job.department}</span>}
            {job.location && <span>• {job.location}</span>}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEditJob(job)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" onClick={handleArchiveToggle}>
            {job.status === 'active' ? (
              <>
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </>
            ) : (
              <>
                <ArchiveRestore className="w-4 h-4 mr-2" />
                Unarchive
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Slug</h3>
            <p className="text-muted-foreground">{job.slug}</p>
          </div>

          {job.description && (
            <div>
              <h3 className="font-semibold mb-1">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
            </div>
          )}

          {job.tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {job.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h3 className="font-semibold mb-1">Created</h3>
              <p className="text-muted-foreground">{formatDate(job.createdAt)}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Last Updated</h3>
              <p className="text-muted-foreground">{formatDate(job.updatedAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Section - Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Candidate management will be available in the next phase.
          </p>
        </CardContent>
      </Card>

      {/* Assessment Section */}
      <Card>
        <CardHeader>
          <CardTitle>Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Build and configure the assessment for this job.
          </p>
          <Link to={`/assessments/${job.id}`}>
            <Button>
              Open Assessment Builder
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
