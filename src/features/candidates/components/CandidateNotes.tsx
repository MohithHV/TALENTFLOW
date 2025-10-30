import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { candidatesApi } from '@/lib/api/candidates';
import { formatDateRelative } from '@/lib/utils';
import { MessageSquare, Send } from 'lucide-react';
import type { CandidateNote } from '@/types';

interface CandidateNotesProps {
  candidateId: string;
}

// Mock team members for @mentions
const TEAM_MEMBERS = [
  'Alice Johnson',
  'Bob Smith',
  'Charlie Davis',
  'Diana Wilson',
  'Eve Martinez'
];

export function CandidateNotes({ candidateId }: CandidateNotesProps) {
  const [notes, setNotes] = useState<CandidateNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState(0);

  useEffect(() => {
    loadNotes();
  }, [candidateId]);

  useEffect(() => {
    // Detect @mentions
    const lastAtIndex = newNote.lastIndexOf('@', cursorPosition);
    if (lastAtIndex !== -1 && lastAtIndex === cursorPosition - 1) {
      setSuggestions(TEAM_MEMBERS);
      setShowSuggestions(true);
    } else if (lastAtIndex !== -1 && cursorPosition > lastAtIndex) {
      const query = newNote.slice(lastAtIndex + 1, cursorPosition).toLowerCase();
      const filtered = TEAM_MEMBERS.filter(name =>
        name.toLowerCase().includes(query)
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [newNote, cursorPosition]);

  async function loadNotes() {
    try {
      const data = await candidatesApi.getCandidateNotes(candidateId);
      setNotes(data);
    } catch (err) {
      console.error('Failed to load notes:', err);
    }
  }

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setNewNote(e.target.value);
    setCursorPosition(e.target.selectionStart);
  }

  function selectMention(name: string) {
    const lastAtIndex = newNote.lastIndexOf('@', cursorPosition);
    const beforeAt = newNote.slice(0, lastAtIndex);
    const afterCursor = newNote.slice(cursorPosition);
    setNewNote(`${beforeAt}@${name} ${afterCursor}`);
    setShowSuggestions(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Extract @mentions
      const mentions = Array.from(newNote.matchAll(/@(\w+\s+\w+)/g))
        .map(match => match[1]);

      const note = await candidatesApi.addNote(candidateId, newNote, mentions);
      setNotes([note, ...notes]);
      setNewNote('');
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderNoteContent(content: string, mentions: string[]) {
    if (mentions.length === 0) return content;

    let rendered = content;
    mentions.forEach(mention => {
      rendered = rendered.replace(
        new RegExp(`@${mention}`, 'g'),
        `<span class="text-primary font-medium">@${mention}</span>`
      );
    });
    return <span dangerouslySetInnerHTML={{ __html: rendered }} />;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Note Form */}
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={newNote}
            onChange={handleTextChange}
            onSelect={(e) => setCursorPosition((e.target as HTMLTextAreaElement).selectionStart)}
            placeholder="Add a note... Use @ to mention team members"
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          />

          {/* @Mention Suggestions */}
          {showSuggestions && (
            <div className="absolute z-10 mt-1 w-full bg-popover border rounded-md shadow-lg max-h-48 overflow-auto">
              {suggestions.map(name => (
                <button
                  key={name}
                  type="button"
                  onClick={() => selectMention(name)}
                  className="w-full text-left px-3 py-2 hover:bg-accent text-sm"
                >
                  @{name}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-2">
            <Button type="submit" size="sm" disabled={!newNote.trim() || isSubmitting}>
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Adding...' : 'Add Note'}
            </Button>
          </div>
        </form>

        {/* Notes List */}
        <div className="space-y-3 pt-4 border-t">
          {notes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No notes yet. Add your first note above.
            </p>
          ) : (
            notes.map(note => (
              <div key={note.id} className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm mb-2">
                  {renderNoteContent(note.content, note.mentions)}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatDateRelative(note.createdAt)}</span>
                  {note.mentions.length > 0 && (
                    <div className="flex gap-1 ml-auto">
                      {note.mentions.map(mention => (
                        <Badge key={mention} variant="outline" className="text-xs">
                          @{mention}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
