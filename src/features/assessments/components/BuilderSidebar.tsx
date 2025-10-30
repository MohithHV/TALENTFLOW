import { useState } from 'react';
import { useAssessmentsStore } from '@/stores/assessmentsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateId } from '@/lib/utils';
import { Plus, ListOrdered } from 'lucide-react';
import type { QuestionType } from '@/types';

const QUESTION_TYPES: { value: QuestionType; label: string; icon: string }[] = [
  { value: 'single-choice', label: 'Single Choice', icon: '◉' },
  { value: 'multi-choice', label: 'Multiple Choice', icon: '☑' },
  { value: 'short-text', label: 'Short Text', icon: 'T' },
  { value: 'long-text', label: 'Long Text', icon: '📝' },
  { value: 'numeric', label: 'Numeric', icon: '#' },
  { value: 'file-upload', label: 'File Upload', icon: '📎' }
];

export function BuilderSidebar() {
  const { sections, addSection, addQuestion, assessment } = useAssessmentsStore();
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [showSectionInput, setShowSectionInput] = useState(false);

  function handleAddSection() {
    if (!newSectionTitle.trim() || !assessment) return;

    const newSection = {
      id: generateId(),
      assessmentId: assessment.id,
      title: newSectionTitle,
      description: '',
      order: sections.length
    };

    addSection(newSection);
    setNewSectionTitle('');
    setShowSectionInput(false);
  }

  function handleAddQuestion(type: QuestionType) {
    if (sections.length === 0) {
      alert('Please add a section first');
      return;
    }

    const lastSection = sections[sections.length - 1];

    const newQuestion = {
      id: generateId(),
      sectionId: lastSection.id,
      type,
      label: `New ${type} question`,
      description: '',
      options: type.includes('choice') ? [
        { id: generateId(), label: 'Option 1', value: 'option1' },
        { id: generateId(), label: 'Option 2', value: 'option2' }
      ] : undefined,
      validation: { required: false },
      order: 0
    };

    addQuestion(newQuestion);
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <ListOrdered className="w-4 h-4" />
          Sections
        </h3>

        {!showSectionInput ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setShowSectionInput(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        ) : (
          <div className="flex gap-2">
            <Input
              placeholder="Section title"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSection()}
              autoFocus
            />
            <Button size="sm" onClick={handleAddSection}>
              Add
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setShowSectionInput(false);
                setNewSectionTitle('');
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-2">Question Types</h3>
        <div className="grid grid-cols-2 gap-2">
          {QUESTION_TYPES.map(type => (
            <Button
              key={type.value}
              variant="outline"
              size="sm"
              className="justify-start"
              onClick={() => handleAddQuestion(type.value)}
            >
              <span className="mr-2">{type.icon}</span>
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground">
          {sections.length} section{sections.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
}
