import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Subject } from '@/types/notes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SubjectSidebarProps {
  subjects: Subject[];
  selectedSubjectId: string | null;
  onSelectSubject: (id: string) => void;
  onAddSubject: (name: string, icon: string) => void;
  onDeleteSubject: (id: string) => void;
}

const EMOJI_OPTIONS = ['📁', '📚', '🎨', '🎵', '💻', '🌍', '🧮', '✏️', '🎭', '⚽'];

export function SubjectSidebar({
  subjects,
  selectedSubjectId,
  onSelectSubject,
  onAddSubject,
  onDeleteSubject,
}: SubjectSidebarProps) {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📁');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddSubject = () => {
    if (newSubjectName.trim()) {
      onAddSubject(newSubjectName.trim(), selectedEmoji);
      setNewSubjectName('');
      setSelectedEmoji('📁');
      setIsDialogOpen(false);
    }
  };

  return (
    <aside className="w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-semibold text-sidebar-foreground flex items-center gap-2">
          <span className="text-2xl">📝</span>
          StudyNotes
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2">
          Subjects
        </p>
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className={`group flex items-center justify-between rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
              selectedSubjectId === subject.id
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
            onClick={() => onSelectSubject(subject.id)}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{subject.icon}</span>
              <span className="font-medium">{subject.name}</span>
            </div>
            {!subject.isDefault && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSubject(subject.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Plus className="w-4 h-4" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-foreground">Subject Name</label>
                <Input
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="e.g., Art, Music, PE..."
                  className="mt-1.5"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Icon</label>
                <div className="flex gap-2 mt-1.5 flex-wrap">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`w-10 h-10 text-xl rounded-lg border-2 transition-all ${
                        selectedEmoji === emoji
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={handleAddSubject} className="w-full">
                Add Subject
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </aside>
  );
}
