import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { KanbanCard } from './KanbanCard';
import type { Candidate } from '@/types';

interface KanbanColumnProps {
  id: string;
  title: string;
  count: number;
  candidates: Candidate[];
}

export function KanbanColumn({ id, title, count, candidates }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex flex-col bg-muted/30 rounded-lg p-3 min-h-[500px]">
      <div className="flex items-center justify-between mb-3 pb-2 border-b">
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="text-xs bg-background px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2 min-h-[200px] rounded-md transition-colors ${
          isOver ? 'bg-primary/5 ring-2 ring-primary/20' : ''
        }`}
      >
        <SortableContext items={candidates.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {candidates.map(candidate => (
            <KanbanCard key={candidate.id} candidate={candidate} />
          ))}
        </SortableContext>

        {candidates.length === 0 && (
          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
            Drop candidates here
          </div>
        )}
      </div>
    </div>
  );
}
