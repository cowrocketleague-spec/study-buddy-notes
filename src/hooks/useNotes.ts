import { useState, useEffect, useCallback } from 'react';
import { Note, Subject, DEFAULT_SUBJECTS } from '@/types/notes';

const STORAGE_KEYS = {
  SUBJECTS: 'studynotes-subjects',
  NOTES: 'studynotes-notes',
};

export function useNotes() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSubjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    const savedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);

    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    } else {
      setSubjects(DEFAULT_SUBJECTS);
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(DEFAULT_SUBJECTS));
    }

    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }

    setIsLoaded(true);
  }, []);

  // Save subjects to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    }
  }, [subjects, isLoaded]);

  // Save notes to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    }
  }, [notes, isLoaded]);

  const addSubject = useCallback((name: string, icon: string = '📁') => {
    const newSubject: Subject = {
      id: `subject-${Date.now()}`,
      name,
      icon,
      isDefault: false,
    };
    setSubjects(prev => [...prev, newSubject]);
    return newSubject;
  }, []);

  const deleteSubject = useCallback((subjectId: string) => {
    setSubjects(prev => prev.filter(s => s.id !== subjectId));
    setNotes(prev => prev.filter(n => n.subjectId !== subjectId));
    if (selectedSubjectId === subjectId) {
      setSelectedSubjectId(null);
      setSelectedNoteId(null);
    }
  }, [selectedSubjectId]);

  const addNote = useCallback((subjectId: string) => {
    const today = new Date();
    const dateHeader = today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      content: `📅 ${dateHeader}\n\n`,
      subjectId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    return newNote;
  }, []);

  const updateNote = useCallback((noteId: string, updates: Partial<Pick<Note, 'title' | 'content'>>) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId 
        ? { ...note, ...updates, updatedAt: Date.now() }
        : note
    ));
  }, []);

  const deleteNote = useCallback((noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
    if (selectedNoteId === noteId) {
      setSelectedNoteId(null);
    }
  }, [selectedNoteId]);

  const getNotesForSubject = useCallback((subjectId: string) => {
    return notes
      .filter(n => n.subjectId === subjectId)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes]);

  const selectedNote = notes.find(n => n.id === selectedNoteId) || null;
  const selectedSubject = subjects.find(s => s.id === selectedSubjectId) || null;

  return {
    subjects,
    notes,
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
  };
}
