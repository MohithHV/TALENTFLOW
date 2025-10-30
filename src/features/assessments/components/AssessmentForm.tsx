import { useState } from 'react';
import { useAssessmentsStore } from '@/stores/assessmentsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Send } from 'lucide-react';
import type { Assessment, AssessmentSection, Question } from '@/types';

interface AssessmentFormProps {
  assessment: Assessment | null;
  sections: AssessmentSection[];
  questions: Question[];
  isPreview?: boolean;
  onSubmit?: (responses: Record<string, any>) => void;
}

export function AssessmentForm({
  assessment,
  sections,
  questions,
  isPreview = false,
  onSubmit
}: AssessmentFormProps) {
  const { responses, setResponse } = useAssessmentsStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if question should be shown based on conditional logic
  function shouldShowQuestion(question: Question): boolean {
    if (!question.conditional) return true;

    const conditionalValue = responses[question.conditional.questionId];
    const expectedValue = question.conditional.value;

    if (question.conditional.operator === '===') {
      return conditionalValue === expectedValue;
    }

    return true;
  }

  function validateQuestion(question: Question, value: any): string | null {
    if (!question.validation) return null;

    if (question.validation.required && !value) {
      return 'This field is required';
    }

    if (question.type === 'numeric' && value) {
      const numValue = parseFloat(value);
      if (question.validation.min !== undefined && numValue < question.validation.min) {
        return `Value must be at least ${question.validation.min}`;
      }
      if (question.validation.max !== undefined && numValue > question.validation.max) {
        return `Value must be at most ${question.validation.max}`;
      }
    }

    if (question.type === 'short-text' && value) {
      if (question.validation.maxLength && value.length > question.validation.maxLength) {
        return `Maximum ${question.validation.maxLength} characters`;
      }
    }

    if (question.type === 'long-text' && value) {
      if (question.validation.minLength && value.length < question.validation.minLength) {
        return `Minimum ${question.validation.minLength} characters`;
      }
      if (question.validation.maxLength && value.length > question.validation.maxLength) {
        return `Maximum ${question.validation.maxLength} characters`;
      }
    }

    return null;
  }

  function handleChange(questionId: string, value: any, question: Question) {
    setResponse(questionId, value);

    // Validate on change
    const error = validateQuestion(question, value);
    setErrors(prev => ({
      ...prev,
      [questionId]: error || ''
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isPreview) return;

    // Validate all visible required fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    questions.forEach(question => {
      if (shouldShowQuestion(question)) {
        const error = validateQuestion(question, responses[question.id]);
        if (error) {
          newErrors[question.id] = error;
          hasErrors = true;
        }
      }
    });

    setErrors(newErrors);

    if (!hasErrors && onSubmit) {
      onSubmit(responses);
    }
  }

  function renderQuestion(question: Question) {
    if (!shouldShowQuestion(question)) return null;

    const value = responses[question.id] || '';
    const error = errors[question.id];
    const isRequired = question.validation?.required;

    return (
      <div key={question.id} className="space-y-2">
        <label className="block text-sm font-medium">
          {question.label}
          {isRequired && <span className="text-destructive ml-1">*</span>}
        </label>

        {question.description && (
          <p className="text-sm text-muted-foreground">{question.description}</p>
        )}

        {/* Single Choice */}
        {question.type === 'single-choice' && question.options && (
          <div className="space-y-2">
            {question.options.map(option => (
              <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleChange(question.id, e.target.value, question)}
                  disabled={isPreview}
                  className="w-4 h-4"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        )}

        {/* Multi Choice */}
        {question.type === 'multi-choice' && question.options && (
          <div className="space-y-2">
            {question.options.map(option => {
              const selectedValues = Array.isArray(value) ? value : [];
              return (
                <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={selectedValues.includes(option.value)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...selectedValues, option.value]
                        : selectedValues.filter((v: string) => v !== option.value);
                      handleChange(question.id, newValues, question);
                    }}
                    disabled={isPreview}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              );
            })}
          </div>
        )}

        {/* Short Text */}
        {question.type === 'short-text' && (
          <Input
            value={value}
            onChange={(e) => handleChange(question.id, e.target.value, question)}
            placeholder="Your answer"
            disabled={isPreview}
          />
        )}

        {/* Long Text */}
        {question.type === 'long-text' && (
          <textarea
            value={value}
            onChange={(e) => handleChange(question.id, e.target.value, question)}
            placeholder="Your answer"
            disabled={isPreview}
            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        )}

        {/* Numeric */}
        {question.type === 'numeric' && (
          <div>
            <Input
              type="number"
              value={value}
              onChange={(e) => handleChange(question.id, e.target.value, question)}
              placeholder="Enter a number"
              disabled={isPreview}
              min={question.validation?.min}
              max={question.validation?.max}
            />
            {(question.validation?.min !== undefined || question.validation?.max !== undefined) && (
              <p className="text-xs text-muted-foreground mt-1">
                {question.validation.min !== undefined && question.validation.max !== undefined
                  ? `Range: ${question.validation.min} - ${question.validation.max}`
                  : question.validation.min !== undefined
                  ? `Minimum: ${question.validation.min}`
                  : `Maximum: ${question.validation.max}`}
              </p>
            )}
          </div>
        )}

        {/* File Upload */}
        {question.type === 'file-upload' && (
          <div className="border-2 border-dashed rounded-md p-4 text-center">
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleChange(question.id, file.name, question);
                }
              }}
              disabled={isPreview}
              className="max-w-xs mx-auto"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {isPreview ? 'File upload (preview only)' : 'Upload your file'}
            </p>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {assessment && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{assessment.title}</h2>
          {assessment.description && (
            <p className="text-muted-foreground mt-1">{assessment.description}</p>
          )}
        </div>
      )}

      {sections.map(section => {
        const sectionQuestions = questions.filter(q => q.sectionId === section.id);
        const visibleQuestions = sectionQuestions.filter(shouldShowQuestion);

        if (visibleQuestions.length === 0) return null;

        return (
          <Card key={section.id} className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              {section.description && (
                <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
              )}
            </div>

            <div className="space-y-6">
              {visibleQuestions.map(renderQuestion)}
            </div>
          </Card>
        );
      })}

      {!isPreview && sections.length > 0 && (
        <Button type="submit" className="w-full">
          <Send className="w-4 h-4 mr-2" />
          Submit Assessment
        </Button>
      )}

      {isPreview && sections.length > 0 && (
        <div className="text-center py-4">
          <Badge variant="secondary">Preview Mode - Form cannot be submitted</Badge>
        </div>
      )}
    </form>
  );
}
