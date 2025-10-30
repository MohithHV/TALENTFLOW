import Dexie from 'dexie';
import type { EntityTable } from 'dexie';
import type { Job, Candidate, CandidateTimeline, CandidateNote, Assessment, AssessmentResponse } from '@/types';

export class TalentFlowDB extends Dexie {
  jobs!: EntityTable<Job, 'id'>;
  candidates!: EntityTable<Candidate, 'id'>;
  candidateTimeline!: EntityTable<CandidateTimeline, 'id'>;
  candidateNotes!: EntityTable<CandidateNote, 'id'>;
  assessments!: EntityTable<Assessment, 'id'>;
  assessmentResponses!: EntityTable<AssessmentResponse, 'id'>;

  constructor() {
    super('TalentFlowDB');

    this.version(1).stores({
      jobs: 'id, slug, status, order, createdAt',
      candidates: 'id, email, jobId, stage, appliedAt',
      candidateTimeline: 'id, candidateId, changedAt',
      candidateNotes: 'id, candidateId, createdAt',
      assessments: 'id, jobId, createdAt',
      assessmentResponses: 'id, assessmentId, candidateId, submittedAt'
    });
  }
}

export const db = new TalentFlowDB();

// Helper functions for IndexedDB operations
export const dbHelpers = {
  // Jobs
  async getAllJobs() {
    return db.jobs.toArray();
  },

  async getJobById(id: string) {
    return db.jobs.get(id);
  },

  async createJob(job: Job) {
    await db.jobs.add(job);
    return job;
  },

  async updateJob(id: string, updates: Partial<Job>) {
    await db.jobs.update(id, { ...updates, updatedAt: new Date().toISOString() });
    return db.jobs.get(id);
  },

  async deleteJob(id: string) {
    await db.jobs.delete(id);
  },

  async bulkUpdateJobs(jobs: Job[]) {
    await db.jobs.bulkPut(jobs);
  },

  // Candidates
  async getAllCandidates() {
    return db.candidates.toArray();
  },

  async getCandidateById(id: string) {
    return db.candidates.get(id);
  },

  async createCandidate(candidate: Candidate) {
    await db.candidates.add(candidate);
    return candidate;
  },

  async updateCandidate(id: string, updates: Partial<Candidate>) {
    await db.candidates.update(id, { ...updates, updatedAt: new Date().toISOString() });
    return db.candidates.get(id);
  },

  // Timeline
  async getCandidateTimeline(candidateId: string) {
    return db.candidateTimeline
      .where('candidateId')
      .equals(candidateId)
      .sortBy('changedAt');
  },

  async addTimelineEntry(entry: CandidateTimeline) {
    await db.candidateTimeline.add(entry);
  },

  // Notes
  async getCandidateNotes(candidateId: string) {
    return db.candidateNotes
      .where('candidateId')
      .equals(candidateId)
      .reverse()
      .sortBy('createdAt');
  },

  async addNote(note: CandidateNote) {
    await db.candidateNotes.add(note);
  },

  // Assessments
  async getAssessmentByJobId(jobId: string) {
    return db.assessments.where('jobId').equals(jobId).first();
  },

  async saveAssessment(assessment: Assessment) {
    await db.assessments.put(assessment);
    return assessment;
  },

  async getAssessmentResponse(assessmentId: string, candidateId: string) {
    return db.assessmentResponses
      .where('[assessmentId+candidateId]')
      .equals([assessmentId, candidateId])
      .first();
  },

  async saveAssessmentResponse(response: AssessmentResponse) {
    await db.assessmentResponses.put(response);
    return response;
  }
};
