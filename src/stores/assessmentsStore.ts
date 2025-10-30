import { create } from 'zustand';
import type { Assessment, AssessmentSection, Question, AssessmentResponse } from '@/types';

interface AssessmentsState {
  assessment: Assessment | null;
  sections: AssessmentSection[];
  questions: Question[];
  responses: Record<string, any>;
  isLoading: boolean;
  error: string | null;
  previewMode: boolean;

  // Actions
  setAssessment: (assessment: Assessment) => void;
  setSections: (sections: AssessmentSection[]) => void;
  setQuestions: (questions: Question[]) => void;
  addSection: (section: AssessmentSection) => void;
  updateSection: (id: string, updates: Partial<AssessmentSection>) => void;
  deleteSection: (id: string) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  reorderSections: (sections: AssessmentSection[]) => void;
  reorderQuestions: (questions: Question[]) => void;
  setResponse: (questionId: string, value: any) => void;
  setResponses: (responses: Record<string, any>) => void;
  clearResponses: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setPreviewMode: (preview: boolean) => void;
  reset: () => void;
}

export const useAssessmentsStore = create<AssessmentsState>((set) => ({
  assessment: null,
  sections: [],
  questions: [],
  responses: {},
  isLoading: false,
  error: null,
  previewMode: false,

  setAssessment: (assessment) => set({
    assessment,
    sections: assessment.sections,
    questions: assessment.questions
  }),

  setSections: (sections) => set({ sections }),

  setQuestions: (questions) => set({ questions }),

  addSection: (section) => set((state) => ({
    sections: [...state.sections, section]
  })),

  updateSection: (id, updates) => set((state) => ({
    sections: state.sections.map(s => s.id === id ? { ...s, ...updates } : s)
  })),

  deleteSection: (id) => set((state) => ({
    sections: state.sections.filter(s => s.id !== id),
    questions: state.questions.filter(q => q.sectionId !== id)
  })),

  addQuestion: (question) => set((state) => ({
    questions: [...state.questions, question]
  })),

  updateQuestion: (id, updates) => set((state) => ({
    questions: state.questions.map(q => q.id === id ? { ...q, ...updates } : q)
  })),

  deleteQuestion: (id) => set((state) => ({
    questions: state.questions.filter(q => q.id !== id)
  })),

  reorderSections: (sections) => set({ sections }),

  reorderQuestions: (questions) => set({ questions }),

  setResponse: (questionId, value) => set((state) => ({
    responses: { ...state.responses, [questionId]: value }
  })),

  setResponses: (responses) => set({ responses }),

  clearResponses: () => set({ responses: {} }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setPreviewMode: (preview) => set({ previewMode: preview }),

  reset: () => set({
    assessment: null,
    sections: [],
    questions: [],
    responses: {},
    isLoading: false,
    error: null,
    previewMode: false
  })
}));
