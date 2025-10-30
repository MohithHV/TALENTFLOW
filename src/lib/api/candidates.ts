import type { Candidate, CandidateTimeline, CandidateNote, CandidateStage, PaginatedResponse } from '@/types';

const API_BASE = '/api';

export const candidatesApi = {
  async getCandidates(params: {
    search?: string;
    stage?: CandidateStage | '';
    page?: number;
    pageSize?: number;
  } = {}): Promise<PaginatedResponse<Candidate>> {
    const searchParams = new URLSearchParams();

    if (params.search) searchParams.append('search', params.search);
    if (params.stage) searchParams.append('stage', params.stage);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());

    const response = await fetch(`${API_BASE}/candidates?${searchParams.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch candidates');
    }

    return response.json();
  },

  async getCandidateById(id: string): Promise<Candidate> {
    const response = await fetch(`${API_BASE}/candidates/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch candidate');
    }

    return response.json();
  },

  async updateCandidate(id: string, updates: Partial<Candidate>): Promise<Candidate> {
    const response = await fetch(`${API_BASE}/candidates/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update candidate');
    }

    return response.json();
  },

  async getCandidateTimeline(id: string): Promise<CandidateTimeline[]> {
    const response = await fetch(`${API_BASE}/candidates/${id}/timeline`);

    if (!response.ok) {
      throw new Error('Failed to fetch timeline');
    }

    return response.json();
  },

  async getCandidateNotes(id: string): Promise<CandidateNote[]> {
    const response = await fetch(`${API_BASE}/candidates/${id}/notes`);

    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }

    return response.json();
  },

  async addNote(candidateId: string, content: string, mentions: string[]): Promise<CandidateNote> {
    const response = await fetch(`${API_BASE}/candidates/${candidateId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, mentions })
    });

    if (!response.ok) {
      throw new Error('Failed to add note');
    }

    return response.json();
  }
};
