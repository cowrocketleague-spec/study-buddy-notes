import { useState } from 'react';
import { useNotes } from '@/hooks/useNotes';
import { useTheme } from '@/hooks/useTheme';
import { SubjectSidebar } from '@/components/SubjectSidebar';
import { NotesList } from '@/components/NotesList';
import { NoteEditor } from '@/components/NoteEditor';
import { EmptyState } from '@/components/EmptyState';
import { MobileHeader } from '@/components/MobileHeader';
import { Sheet, SheetContent } from '@/components/ui/sheet';

type MobileView = 'subjects' | 'notes' | 'editor';

const Index = () => {
  const {
    subjects,
    selectedSubjectId,
    selectedNoteId,
    selectedNote,
    selectedSubject,
    isLoaded,
    setSelectedSubjectId,
    setSelectedNoteId,
    addSubject,
    deleteSubject,
    addNote,
    updateNote,
    deleteNote,
    getNotesForSubject,
  } = useNotes();
  const { theme, toggleTheme } = useTheme();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState<MobileView>('subjects');

  const handleSelectSubject = (id: string) => {
    setSelectedSubjectId(id);
    setSelectedNoteId(null);
    setIsMobileSidebarOpen(false);
    setMobileView('notes');
  };

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
    setMobileView('editor');
  };

  const handleAddNote = () => {
    if (selectedSubjectId) {
      const newNote = addNote(selectedSubjectId);
      setMobileView('editor');
    }
  };

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    setMobileView('notes');
  };

  const handleMobileBack = () => {
    if (mobileView === 'editor') {
      setMobileView('notes');
      setSelectedNoteId(null);
    } else if (mobileView === 'notes') {
      setMobileView('subjects');
      setSelectedSubjectId(null);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading your notes...</div>
      </div>
    );
  }

  const currentNotes = selectedSubjectId ? getNotesForSubject(selectedSubjectId) : [];

  // Desktop Layout
  const DesktopLayout = () => (
    <div className="hidden lg:flex h-screen w-full">
      <SubjectSidebar
        subjects={subjects}
        selectedSubjectId={selectedSubjectId}
        onSelectSubject={handleSelectSubject}
        onAddSubject={addSubject}
        onDeleteSubject={deleteSubject}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      
      {selectedSubjectId && selectedSubject ? (
        <>
          <NotesList
            subject={selectedSubject}
            notes={currentNotes}
            selectedNoteId={selectedNoteId}
            onSelectNote={handleSelectNote}
            onAddNote={handleAddNote}
          />
          {selectedNote ? (
            <NoteEditor
              note={selectedNote}
              onUpdate={updateNote}
              onDelete={handleDeleteNote}
            />
          ) : (
            <EmptyState type="no-note" subjectName={selectedSubject.name} />
          )}
        </>
      ) : (
        <EmptyState type="no-subject" />
      )}
    </div>
  );

  // Mobile/Tablet Layout
  const MobileLayout = () => (
    <div className="lg:hidden flex flex-col h-screen">
      {/* Mobile Sidebar Sheet */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <SubjectSidebar
            subjects={subjects}
            selectedSubjectId={selectedSubjectId}
            onSelectSubject={handleSelectSubject}
            onAddSubject={addSubject}
            onDeleteSubject={deleteSubject}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        </SheetContent>
      </Sheet>

      {/* Mobile Views */}
      {mobileView === 'subjects' && (
        <>
          <MobileHeader
            title="StudyNotes"
            onMenuClick={() => setIsMobileSidebarOpen(true)}
          />
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-sm text-muted-foreground mb-4">Select a subject to view notes</p>
            <div className="space-y-2">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => handleSelectSubject(subject.id)}
                  className="w-full flex items-center gap-3 p-4 rounded-lg bg-card border border-border hover:bg-accent transition-colors text-left"
                >
                  <span className="text-2xl">{subject.icon}</span>
                  <span className="font-medium text-foreground">{subject.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {mobileView === 'notes' && selectedSubject && (
        <>
          <MobileHeader
            title={selectedSubject.name}
            showBack
            onMenuClick={() => setIsMobileSidebarOpen(true)}
            onBackClick={handleMobileBack}
          />
          <div className="flex-1 overflow-hidden">
            <NotesList
              subject={selectedSubject}
              notes={currentNotes}
              selectedNoteId={selectedNoteId}
              onSelectNote={handleSelectNote}
              onAddNote={handleAddNote}
            />
          </div>
        </>
      )}

      {mobileView === 'editor' && selectedNote && (
        <>
          <MobileHeader
            title={selectedNote.title}
            showBack
            onMenuClick={() => setIsMobileSidebarOpen(true)}
            onBackClick={handleMobileBack}
          />
          <div className="flex-1 overflow-hidden">
            <NoteEditor
              note={selectedNote}
              onUpdate={updateNote}
              onDelete={handleDeleteNote}
            />
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <DesktopLayout />
      <MobileLayout />
    </>
  );
};

export default Index;
