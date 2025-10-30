import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCandidatesStore } from '@/stores/candidatesStore';
import { candidatesApi } from '@/lib/api/candidates';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, User } from 'lucide-react';
import { formatDateRelative } from '@/lib/utils';
import type { CandidateStage } from '@/types';

const STAGE_COLORS: Record<CandidateStage, string> = {
  applied: 'bg-blue-100 text-blue-800',
  screen: 'bg-yellow-100 text-yellow-800',
  tech: 'bg-purple-100 text-purple-800',
  offer: 'bg-green-100 text-green-800',
  hired: 'bg-green-600 text-white',
  rejected: 'bg-red-100 text-red-800'
};

export function CandidatesList() {
  const {
    candidates,
    searchQuery,
    stageFilter,
    isLoading,
    error,
    setCandidates,
    setSearchQuery,
    setStageFilter,
    setLoading,
    setError
  } = useCandidatesStore();

  const [searchInput, setSearchInput] = useState(searchQuery);
  const parentRef = useRef<HTMLDivElement>(null);

  // Virtualization
  const virtualizer = useVirtualizer({
    count: candidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 10
  });

  useEffect(() => {
    loadCandidates();
  }, [stageFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        setSearchQuery(searchInput);
        loadCandidates(searchInput);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  async function loadCandidates(search?: string) {
    try {
      setLoading(true);
      setError(null);
      const response = await candidatesApi.getCandidates({
        search: search ?? searchQuery,
        stage: stageFilter,
        page: 1,
        pageSize: 1000 // Load all for virtualization
      });
      setCandidates(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load candidates');
    } finally {
      setLoading(false);
    }
  }

  const stages: (CandidateStage | '')[] = ['', 'applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];
  const stageLabels: Record<CandidateStage | '', string> = {
    '': 'All',
    applied: 'Applied',
    screen: 'Screening',
    tech: 'Technical',
    offer: 'Offer',
    hired: 'Hired',
    rejected: 'Rejected'
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Candidates</h1>
        <p className="text-muted-foreground mt-1">
          Manage {candidates.length.toLocaleString()} candidates across all stages
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {stages.map(stage => (
            <Button
              key={stage}
              variant={stageFilter === stage ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStageFilter(stage)}
              className="whitespace-nowrap"
            >
              {stageLabels[stage]}
            </Button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && candidates.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Loading candidates...
        </div>
      )}

      {/* Empty State */}
      {!isLoading && candidates.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No candidates found. {searchQuery || stageFilter ? 'Try adjusting your filters.' : ''}
        </div>
      )}

      {/* Virtualized List */}
      {candidates.length > 0 && (
        <div
          ref={parentRef}
          className="h-[600px] overflow-auto border rounded-lg bg-card"
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative'
            }}
          >
            {virtualizer.getVirtualItems().map(virtualRow => {
              const candidate = candidates[virtualRow.index];
              return (
                <Link
                  key={candidate.id}
                  to={`/candidates/${candidate.id}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`
                  }}
                >
                  <div className="px-4 py-3 hover:bg-accent border-b flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{candidate.name}</h3>
                        <Badge className={STAGE_COLORS[candidate.stage]}>
                          {stageLabels[candidate.stage]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {candidate.email}
                      </p>
                    </div>

                    <div className="text-sm text-muted-foreground whitespace-nowrap hidden sm:block">
                      Applied {formatDateRelative(candidate.appliedAt)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats */}
      {candidates.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Showing {candidates.length.toLocaleString()} candidates
          {stageFilter && ` in ${stageLabels[stageFilter]} stage`}
        </div>
      )}
    </div>
  );
}
