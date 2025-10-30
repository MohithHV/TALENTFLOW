import { create } from 'zustand';
import type { Job, JobFilters, PaginatedResponse } from '@/types';

interface JobsState {
  jobs: Job[];
  currentJob: Job | null;
  filters: JobFilters;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;

  // Actions
  setJobs: (response: PaginatedResponse<Job>) => void;
  setCurrentJob: (job: Job | null) => void;
  setFilters: (filters: Partial<JobFilters>) => void;
  setPage: (page: number) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  removeJob: (id: string) => void;
  reorderJobs: (jobs: Job[]) => void;
}

export const useJobsStore = create<JobsState>((set) => ({
  jobs: [],
  currentJob: null,
  filters: {
    search: '',
    status: '',
    tags: [],
    page: 1,
    pageSize: 10,
    sort: 'order'
  },
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  },
  isLoading: false,
  error: null,

  setJobs: (response) => set({
    jobs: response.data,
    pagination: {
      page: response.page,
      pageSize: response.pageSize,
      total: response.total,
      totalPages: response.totalPages
    }
  }),

  setCurrentJob: (job) => set({ currentJob: job }),

  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),

  setPage: (page) => set((state) => ({
    filters: { ...state.filters, page }
  })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  addJob: (job) => set((state) => ({
    jobs: [job, ...state.jobs]
  })),

  updateJob: (id, updates) => set((state) => ({
    jobs: state.jobs.map(job => job.id === id ? { ...job, ...updates } : job),
    currentJob: state.currentJob?.id === id ? { ...state.currentJob, ...updates } : state.currentJob
  })),

  removeJob: (id) => set((state) => ({
    jobs: state.jobs.filter(job => job.id !== id)
  })),

  reorderJobs: (jobs) => set({ jobs })
}));
