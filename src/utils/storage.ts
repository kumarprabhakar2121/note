import { Note } from '@/types/note';

const STORAGE_KEY = 'notes';

export const loadFromStorage = (): Note[] => {
  if (typeof window === 'undefined') return [];
  const notes = localStorage.getItem(STORAGE_KEY);
  return notes ? JSON.parse(notes) : [];
};

export const saveToStorage = (notes: Note[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};
