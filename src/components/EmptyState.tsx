import { BookOpen, PenLine, FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-subject' | 'no-note';
  subjectName?: string;
}

export function EmptyState({ type, subjectName }: EmptyStateProps) {
  if (type === 'no-subject') {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
            <FolderOpen className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Welcome to StudyNotes! 👋
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Select a subject from the sidebar to view your notes, or create a new subject to get started with organizing your schoolwork.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>4 default subjects</span>
            </div>
            <div className="flex items-center gap-2">
              <PenLine className="w-4 h-4" />
              <span>Auto-saves instantly</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-background">
      <div className="text-center max-w-sm px-6">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-accent flex items-center justify-center">
          <PenLine className="w-6 h-6 text-accent-foreground" />
        </div>
        <h3 className="text-xl font-medium text-foreground mb-2">
          Select a note
        </h3>
        <p className="text-muted-foreground">
          Choose a note from the list or create a new one to start writing in {subjectName}.
        </p>
      </div>
    </div>
  );
}
