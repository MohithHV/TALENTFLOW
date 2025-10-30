import { useState } from 'react';
import { useAssessmentsStore } from '@/stores/assessmentsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Check, X } from 'lucide-react';
import type { AssessmentSection } from '@/types';

interface SectionEditorProps {
  section: AssessmentSection;
}

export function SectionEditor({ section }: SectionEditorProps) {
  const { updateSection, deleteSection } = useAssessmentsStore();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [description, setDescription] = useState(section.description || '');

  function handleSave() {
    updateSection(section.id, { title, description });
    setIsEditing(false);
  }

  function handleCancel() {
    setTitle(section.title);
    setDescription(section.description || '');
    setIsEditing(false);
  }

  function handleDelete() {
    if (confirm('Delete this section and all its questions?')) {
      deleteSection(section.id);
    }
  }

  if (isEditing) {
    return (
      <div className="space-y-3">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Section title"
        />
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Section description (optional)"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>
            <Check className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCancel}>
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-lg font-semibold">{section.title}</h3>
        {section.description && (
          <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
        )}
      </div>
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={handleDelete}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
