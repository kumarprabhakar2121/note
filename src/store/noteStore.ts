import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '@/types/note';
import { loadFromStorage, saveToStorage } from '@/utils/storage';

interface NoteStore {
  notes: Note[];
  selectedNoteId: string | null;
  isDirty: boolean;
  setSelectedNoteId: (id: string | null) => void;
  createNote: () => Note;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  initializeNotes: () => void;
}

const getMonthName = (month: number): string => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month];
};

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  selectedNoteId: null,
  isDirty: false,

  initializeNotes: () => {
    const loadedNotes = loadFromStorage();
    set({ notes: loadedNotes || [] });
  },

  setSelectedNoteId: (id) => {
    set({ selectedNoteId: id });
  },

  createNote: () => {
    const now = new Date();
    const date = now.getDate();
    const month = getMonthName(now.getMonth());
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const newNote: Note = {
      id: uuidv4(),
      title: `${month} ${date}, ${formattedHours}:${formattedMinutes} ${ampm}`,
      content: '',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    set((state) => {
      const newNotes = [newNote, ...state.notes];
      saveToStorage(newNotes);
      return {
        notes: newNotes,
        selectedNoteId: newNote.id,
      };
    });

    return newNote;
  },

  updateNote: (updatedNote) => {
    set((state) => {
      const newNotes = state.notes.map((note) =>
        note.id === updatedNote.id ? updatedNote : note
      );
      saveToStorage(newNotes);
      return {
        notes: newNotes,
        isDirty: false,
      };
    });
  },

  deleteNote: (id) => {
    set((state) => {
      const newNotes = state.notes.filter((note) => note.id !== id);
      saveToStorage(newNotes);
      return {
        notes: newNotes,
        selectedNoteId: null,
        isDirty: false,
      };
    });
  },
}));
