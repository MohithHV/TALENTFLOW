import { Link } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { User, ExternalLink } from 'lucide-react';
import { formatDateRelative } from '@/lib/utils';
import type { Candidate } from '@/types';

interface KanbanCardProps {
  candidate: Candidate;
}

export function KanbanCard({ candidate }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow bg-background"
    >
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1">
            <h4 className="font-medium text-sm truncate">{candidate.name}</h4>
            <Link
              to={`/candidates/${candidate.id}`}
              className="text-muted-foreground hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <p className="text-xs text-muted-foreground truncate mb-1">
            {candidate.email}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDateRelative(candidate.appliedAt)}
          </p>
        </div>
      </div>
    </Card>
  );
}
