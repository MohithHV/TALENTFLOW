// Job types
export interface Job {
  id: string;
  title: string;
  slug: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
  description?: string;
  location?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  search?: string;
  status?: 'active' | 'archived' | '';
  tags?: string[];
  page?: number;
  pageSize?: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Candidate types
export type CandidateStage = 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  stage: CandidateStage;
  jobId: string;
  appliedAt: string;
  updatedAt: string;
  phone?: string;
  resume?: string;
}

export interface CandidateTimeline {
  id: string;
  candidateId: string;
  fromStage: CandidateStage | null;
  toStage: CandidateStage;
  changedAt: string;
  note?: string;
}

export interface CandidateNote {
  id: string;
  candidateId: string;
  content: string;
  createdAt: string;
  mentions: string[];
}

// Assessment types
export type QuestionType = 'single-choice' | 'multi-choice' | 'short-text' | 'long-text' | 'numeric' | 'file-upload';

export interface QuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
}

export interface ConditionalRule {
  questionId: string;
  operator: '===' | '!==' | 'includes' | 'not-includes';
  value: string | string[];
}

export interface Question {
  id: string;
  sectionId: string;
  type: QuestionType;
  label: string;
  description?: string;
  options?: QuestionOption[];
  validation?: ValidationRule;
  conditional?: ConditionalRule;
  order: number;
}

export interface AssessmentSection {
  id: string;
  assessmentId: string;
  title: string;
  description?: string;
  order: number;
}

export interface Assessment {
  id: string;
  jobId: string;
  title: string;
  description?: string;
  sections: AssessmentSection[];
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  candidateId: string;
  answers: Record<string, any>;
  submittedAt: string;
  completedAt?: string;
}
