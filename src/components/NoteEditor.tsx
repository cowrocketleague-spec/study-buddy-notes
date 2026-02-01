import { useState, useEffect, useRef } from 'react';
import { Trash2, Check } from 'lucide-react';
import { Note } from '@/types/notes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface NoteEditorProps {
  note: Note;
  onUpdate: (noteId: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => void;
  onDelete: (noteId: string) => void;
}

export function NoteEditor({ note, onUpdate, onDelete }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [showSaved, setShowSaved] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const savedIndicatorRef = useRef<NodeJS.Timeout>();

  // Reset local state when note changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id, note.title, note.content]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Debounce save
    saveTimeoutRef.current = setTimeout(() => {
      onUpdate(note.id, { title: newTitle });
      showSavedIndicator();
    }, 300);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Debounce save
    saveTimeoutRef.current = setTimeout(() => {
      onUpdate(note.id, { content: newContent });
      showSavedIndicator();
    }, 300);
  };

  const showSavedIndicator = () => {
    setShowSaved(true);
    if (savedIndicatorRef.current) {
      clearTimeout(savedIndicatorRef.current);
    }
    savedIndicatorRef.current = setTimeout(() => {
      setShowSaved(false);
    }, 2000);
  };

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (savedIndicatorRef.current) clearTimeout(savedIndicatorRef.current);
    };
  }, []);

  return (
    <div className="flex-1 h-full flex flex-col bg-background">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3 flex-1">
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-lg font-semibold border-none shadow-none px-0 h-auto focus-visible:ring-0 bg-transparent"
            placeholder="Note title..."
          />
          {showSaved && (
            <span className="flex items-center gap-1 text-sm text-success animate-in fade-in">
              <Check className="w-4 h-4" />
              Saved
            </span>
          )}
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Note</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{note.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(note.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="Start typing your notes here..."
          className="w-full h-full min-h-[calc(100vh-200px)] resize-none border-none shadow-none focus-visible:ring-0 text-base leading-relaxed bg-transparent"
        />
      </div>
    </div>
  );
}
