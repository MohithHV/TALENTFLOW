import { useEffect, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { useCandidatesStore } from '@/stores/candidatesStore';
import { candidatesApi } from '@/lib/api/candidates';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import type { Candidate, CandidateStage } from '@/types';

const STAGES: CandidateStage[] = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

const STAGE_LABELS: Record<CandidateStage, string> = {
  applied: 'Applied',
  screen: 'Screening',
  tech: 'Technical',
  offer: 'Offer',
  hired: 'Hired',
  rejected: 'Rejected'
};

export function KanbanBoard() {
  const { candidates, setCandidates, updateCandidateStage, setError } = useCandidatesStore();
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    loadCandidates();
  }, []);

  async function loadCandidates() {
    try {
      setIsLoading(true);
      const response = await candidatesApi.getCandidates({
        pageSize: 1000
      });
      setCandidates(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load candidates');
    } finally {
      setIsLoading(false);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    const candidate = candidates.find(c => c.id === event.active.id);
    setActiveCandidate(candidate || null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCandidate(null);

    if (!over || active.id === over.id) return;

    const candidateId = active.id as string;
    const newStage = over.id as CandidateStage;

    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate || candidate.stage === newStage) return;

    // Optimistic update
    const previousStage = candidate.stage;
    updateCandidateStage(candidateId, newStage);

    try {
      await candidatesApi.updateCandidate(candidateId, { stage: newStage });
    } catch (err) {
      // Rollback on error
      console.error('Failed to update candidate stage, rolling back:', err);
      updateCandidateStage(candidateId, previousStage);
      setError('Failed to update candidate stage. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  }

  const candidatesByStage = STAGES.reduce((acc, stage) => {
    acc[stage] = candidates.filter(c => c.stage === stage);
    return acc;
  }, {} as Record<CandidateStage, Candidate[]>);

  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Loading kanban board...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Candidate Pipeline</h1>
        <p className="text-muted-foreground mt-1">
          Drag candidates between stages to update their status
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {STAGES.map(stage => (
            <KanbanColumn
              key={stage}
              id={stage}
              title={STAGE_LABELS[stage]}
              count={candidatesByStage[stage].length}
              candidates={candidatesByStage[stage]}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCandidate && <KanbanCard candidate={activeCandidate} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
