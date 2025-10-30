import type { Assessment, AssessmentResponse } from '@/types';

const API_BASE = '/api';

export const assessmentsApi = {
  async getAssessment(jobId: string): Promise<Assessment> {
    const response = await fetch(`${API_BASE}/assessments/${jobId}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Assessment not found');
      }
      throw new Error('Failed to fetch assessment');
    }

    return response.json();
  },

  async saveAssessment(jobId: string, assessment: Partial<Assessment>): Promise<Assessment> {
    const response = await fetch(`${API_BASE}/assessments/${jobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assessment)
    });

    if (!response.ok) {
      throw new Error('Failed to save assessment');
    }

    return response.json();
  },

  async submitResponse(jobId: string, candidateId: string, answers: Record<string, any>): Promise<AssessmentResponse> {
    const response = await fetch(`${API_BASE}/assessments/${jobId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateId,
        answers
      })
    });

    if (!response.ok) {
      throw new Error('Failed to submit assessment');
    }

    return response.json();
  }
};
