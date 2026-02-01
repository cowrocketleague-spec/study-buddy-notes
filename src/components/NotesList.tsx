import { Plus } from 'lucide-react';
import { Note, Subject } from '@/types/notes';
import { Button } from '@/components/ui/button';

interface NotesListProps {
  subject: Subject;
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onAddNote: () => void;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function NotesList({
  subject,
  notes,
  selectedNoteId,
  onSelectNote,
  onAddNote,
}: NotesListProps) {
  return (
    <div className="w-72 h-full bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{subject.icon}</span>
            <h2 className="font-semibold text-foreground">{subject.name}</h2>
          </div>
          <span className="text-sm text-muted-foreground">{notes.length} notes</span>
        </div>
        <Button onClick={onAddNote} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          New Note
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <p className="text-sm">No notes yet.</p>
            <p className="text-sm mt-1">Click "New Note" to get started!</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {notes.map((note) => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedNoteId === note.id
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent/50'
                }`}
              >
                <h3 className="font-medium text-sm truncate">{note.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {note.content || 'Empty note...'}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatDate(note.updatedAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
