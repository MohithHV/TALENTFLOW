import { Link } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDateRelative } from '@/lib/utils';
import { GripVertical, Edit, Archive, ArchiveRestore, ExternalLink } from 'lucide-react';
import type { Job } from '@/types';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onArchiveToggle: (job: Job) => void;
}

export function JobCard({ job, onEdit, onArchiveToggle }: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isCurrentlyDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isCurrentlyDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Link to={`/jobs/${job.id}`} className="hover:underline">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                </Link>
                <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                  {job.status}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                {job.department && <span>{job.department}</span>}
                {job.location && <span>• {job.location}</span>}
                <span>• {formatDateRelative(job.createdAt)}</span>
              </div>

              {job.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {job.description}
                </p>
              )}

              {job.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {job.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link to={`/jobs/${job.id}`}>
                <Button variant="ghost" size="icon" title="View details">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(job)}
                title="Edit job"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onArchiveToggle(job)}
                title={job.status === 'active' ? 'Archive job' : 'Unarchive job'}
              >
                {job.status === 'active' ? (
                  <Archive className="w-4 h-4" />
                ) : (
                  <ArchiveRestore className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
