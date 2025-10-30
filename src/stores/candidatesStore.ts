import { create } from 'zustand';
import type { Candidate, CandidateTimeline, CandidateNote, CandidateStage, PaginatedResponse } from '@/types';

interface CandidatesState {
  candidates: Candidate[];
  currentCandidate: Candidate | null;
  timeline: CandidateTimeline[];
  notes: CandidateNote[];
  searchQuery: string;
  stageFilter: CandidateStage | '';
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setCandidates: (response: PaginatedResponse<Candidate>) => void;
  setCurrentCandidate: (candidate: Candidate | null) => void;
  setTimeline: (timeline: CandidateTimeline[]) => void;
  setNotes: (notes: CandidateNote[]) => void;
  setSearchQuery: (query: string) => void;
  setStageFilter: (stage: CandidateStage | '') => void;
  setPage: (page: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  addNote: (note: CandidateNote) => void;
  updateCandidateStage: (id: string, stage: CandidateStage) => void;
}

export const useCandidatesStore = create<CandidatesState>((set) => ({
  candidates: [],
  currentCandidate: null,
  timeline: [],
  notes: [],
  searchQuery: '',
  stageFilter: '',
  pagination: {
    page: 1,
    pageSize: 50,
    total: 0,
    totalPages: 0
  },
  isLoading: false,
  error: null,

  setCandidates: (response) => set({
    candidates: response.data,
    pagination: {
      page: response.page,
      pageSize: response.pageSize,
      total: response.total,
      totalPages: response.totalPages
    }
  }),

  setCurrentCandidate: (candidate) => set({ currentCandidate: candidate }),

  setTimeline: (timeline) => set({ timeline }),

  setNotes: (notes) => set({ notes }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setStageFilter: (stage) => set({ stageFilter: stage }),

  setPage: (page) => set((state) => ({
    pagination: { ...state.pagination, page }
  })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  updateCandidate: (id, updates) => set((state) => ({
    candidates: state.candidates.map(c => c.id === id ? { ...c, ...updates } : c),
    currentCandidate: state.currentCandidate?.id === id
      ? { ...state.currentCandidate, ...updates }
      : state.currentCandidate
  })),

  addNote: (note) => set((state) => ({
    notes: [note, ...state.notes]
  })),

  updateCandidateStage: (id, stage) => set((state) => ({
    candidates: state.candidates.map(c =>
      c.id === id ? { ...c, stage, updatedAt: new Date().toISOString() } : c
    ),
    currentCandidate: state.currentCandidate?.id === id
      ? { ...state.currentCandidate, stage, updatedAt: new Date().toISOString() }
      : state.currentCandidate
  }))
}));
