import { useState } from 'react';
import { useAssessmentsStore } from '@/stores/assessmentsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Edit, Trash2, Check, X, Plus, GripVertical } from 'lucide-react';
import { generateId } from '@/lib/utils';
import type { Question, QuestionOption } from '@/types';

interface QuestionEditorProps {
  question: Question;
}

export function QuestionEditor({ question }: QuestionEditorProps) {
  const { updateQuestion, deleteQuestion, questions } = useAssessmentsStore();
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(question.label);
  const [description, setDescription] = useState(question.description || '');
  const [options, setOptions] = useState<QuestionOption[]>(question.options || []);
  const [required, setRequired] = useState(question.validation?.required || false);
  const [minValue, setMinValue] = useState<string>(question.validation?.min?.toString() || '');
  const [maxValue, setMaxValue] = useState<string>(question.validation?.max?.toString() || '');
  const [conditionalQuestionId, setConditionalQuestionId] = useState(question.conditional?.questionId || '');
  const [conditionalValue, setConditionalValue] = useState(question.conditional?.value?.toString() || '');

  const hasChoices = question.type.includes('choice');
  const isNumeric = question.type === 'numeric';

  function handleSave() {
    const updates: Partial<Question> = {
      label,
      description,
      validation: {
        required,
        ...(isNumeric && minValue && { min: parseFloat(minValue) }),
        ...(isNumeric && maxValue && { max: parseFloat(maxValue) })
      }
    };

    if (hasChoices) {
      updates.options = options;
    }

    if (conditionalQuestionId && conditionalValue) {
      updates.conditional = {
        questionId: conditionalQuestionId,
        operator: '===',
        value: conditionalValue
      };
    } else {
      updates.conditional = undefined;
    }

    updateQuestion(question.id, updates);
    setIsEditing(false);
  }

  function handleCancel() {
    setLabel(question.label);
    setDescription(question.description || '');
    setOptions(question.options || []);
    setRequired(question.validation?.required || false);
    setIsEditing(false);
  }

  function handleDelete() {
    if (confirm('Delete this question?')) {
      deleteQuestion(question.id);
    }
  }

  function addOption() {
    const newOption = {
      id: generateId(),
      label: `Option ${options.length + 1}`,
      value: `option${options.length + 1}`
    };
    setOptions([...options, newOption]);
  }

  function updateOption(id: string, updates: Partial<QuestionOption>) {
    setOptions(options.map(opt => opt.id === id ? { ...opt, ...updates } : opt));
  }

  function deleteOption(id: string) {
    setOptions(options.filter(opt => opt.id !== id));
  }

  const availableQuestions = questions.filter(q => q.sectionId === question.sectionId && q.id !== question.id);

  if (isEditing) {
    return (
      <Card className="p-4 space-y-3 bg-accent/50">
        <div>
          <label className="text-sm font-medium mb-1 block">Question Label *</label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Enter your question"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">Description (optional)</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Additional details"
          />
        </div>

        {/* Options for choice questions */}
        {hasChoices && (
          <div>
            <label className="text-sm font-medium mb-2 block">Options</label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={option.id} className="flex gap-2">
                  <Input
                    value={option.label}
                    onChange={(e) => updateOption(option.id, { label: e.target.value })}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteOption(option.id)}
                    disabled={options.length <= 2}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button size="sm" variant="outline" onClick={addOption}>
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </div>
          </div>
        )}

        {/* Numeric validation */}
        {isNumeric && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium mb-1 block">Min Value</label>
              <Input
                type="number"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Max Value</label>
              <Input
                type="number"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
                placeholder="100"
              />
            </div>
          </div>
        )}

        {/* Conditional Logic */}
        {availableQuestions.length > 0 && (
          <div>
            <label className="text-sm font-medium mb-1 block">Conditional Logic (optional)</label>
            <p className="text-xs text-muted-foreground mb-2">Show this question only if another question has a specific answer</p>
            <div className="grid grid-cols-2 gap-2">
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={conditionalQuestionId}
                onChange={(e) => setConditionalQuestionId(e.target.value)}
              >
                <option value="">No condition</option>
                {availableQuestions.map(q => (
                  <option key={q.id} value={q.id}>{q.label}</option>
                ))}
              </select>
              {conditionalQuestionId && (
                <Input
                  value={conditionalValue}
                  onChange={(e) => setConditionalValue(e.target.value)}
                  placeholder="Expected value"
                />
              )}
            </div>
          </div>
        )}

        {/* Validation */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`required-${question.id}`}
            checked={required}
            onChange={(e) => setRequired(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor={`required-${question.id}`} className="text-sm">
            Required question
          </label>
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Button size="sm" onClick={handleSave}>
            <Check className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCancel}>
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-3 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <GripVertical className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-medium text-sm">{question.label}</h4>
            <div className="flex gap-1 flex-shrink-0">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setIsEditing(true)}>
                <Edit className="w-3 h-3" />
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleDelete}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {question.description && (
            <p className="text-xs text-muted-foreground mb-2">{question.description}</p>
          )}

          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              {question.type}
            </Badge>
            {question.validation?.required && (
              <Badge variant="secondary" className="text-xs">Required</Badge>
            )}
            {question.conditional && (
              <Badge variant="secondary" className="text-xs">Conditional</Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
