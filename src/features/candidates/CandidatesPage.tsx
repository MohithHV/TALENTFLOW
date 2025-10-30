import { useState } from 'react';
import { CandidatesList } from './components/CandidatesList';
import { KanbanBoard } from './components/KanbanBoard';
import { Button } from '@/components/ui/button';
import { List, LayoutGrid } from 'lucide-react';

type ViewMode = 'list' | 'kanban';

export function CandidatesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  return (
    <div className="container mx-auto py-8 px-4">
      {/* View Mode Toggle */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-lg border p-1">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4 mr-2" />
            List View
          </Button>
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('kanban')}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Kanban
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? <CandidatesList /> : <KanbanBoard />}
    </div>
  );
}
