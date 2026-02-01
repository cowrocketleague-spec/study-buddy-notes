export interface Note {
  id: string;
  title: string;
  content: string;
  subjectId: string;
  createdAt: number;
  updatedAt: number;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  isDefault: boolean;
}

export const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'math', name: 'Math', icon: '📐', isDefault: true },
  { id: 'english', name: 'English', icon: '📖', isDefault: true },
  { id: 'science', name: 'Science', icon: '🔬', isDefault: true },
  { id: 'history', name: 'History', icon: '🏛️', isDefault: true },
];
