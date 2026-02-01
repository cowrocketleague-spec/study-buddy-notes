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
  
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function getPreviewText(content: string): string {
  // Skip the date header line if present
  const lines = content.split('\n').filter(line => !line.startsWith('📅') && line.trim());
  return lines.join(' ').substring(0, 80) || 'Empty note...';
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
                className={`p-3 rounded-lg cursor-pointer transition-colors border-l-3 ${
                  selectedNoteId === note.id
                    ? 'bg-accent text-accent-foreground border-l-primary'
                    : 'hover:bg-accent/50 border-l-transparent'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-sm truncate flex-1">{note.title}</h3>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {formatDate(note.updatedAt)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">
                  {getPreviewText(note.content)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
