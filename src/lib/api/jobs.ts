import type { Job, JobFilters, PaginatedResponse } from '@/types';

const API_BASE = '/api';

export const jobsApi = {
  async getJobs(filters: JobFilters = {}): Promise<PaginatedResponse<Job>> {
    const params = new URLSearchParams();

    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.sort) params.append('sort', filters.sort);

    const response = await fetch(`${API_BASE}/jobs?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }

    return response.json();
  },

  async getJobById(id: string): Promise<Job> {
    const response = await fetch(`${API_BASE}/jobs/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch job');
    }

    return response.json();
  },

  async createJob(job: Partial<Job>): Promise<Job> {
    const response = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create job');
    }

    return response.json();
  },

  async updateJob(id: string, updates: Partial<Job>): Promise<Job> {
    const response = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update job');
    }

    return response.json();
  },

  async reorderJob(id: string, fromOrder: number, toOrder: number): Promise<Job> {
    const response = await fetch(`${API_BASE}/jobs/${id}/reorder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromOrder, toOrder })
    });

    if (!response.ok) {
      throw new Error('Failed to reorder job');
    }

    return response.json();
  }
};
