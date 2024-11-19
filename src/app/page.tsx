'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Editor from '@/components/Editor';
import Welcome from '@/components/Welcome';
import Loader from '@/components/Loader';
import { Note } from '@/types/note';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const noteId = searchParams.get('note');
  
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Handle initial load of notes
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    setMounted(true);
  }, []);

  // Handle note restoration
  useEffect(() => {
    if (!mounted) return;
    
    if (!noteId) {
      const savedNoteId = localStorage.getItem('selectedNoteId');
      if (savedNoteId && notes.some(note => note.id === savedNoteId)) {
        router.push(`/?note=${savedNoteId}`);
      } else {
        setIsLoading(false);
      }
    }
  }, [mounted, notes, noteId, router]);

  // Handle note selection
  useEffect(() => {
    if (!mounted) return;

    if (noteId) {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        setSelectedNote(note);
        localStorage.setItem('selectedNoteId', noteId);
      } else {
        localStorage.removeItem('selectedNoteId');
        router.push('/');
      }
      setIsLoading(false);
    } else {
      setSelectedNote(null);
      setIsLoading(false);
    }
  }, [mounted, noteId, notes]);

  const createNewNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled Note',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    router.push(`/?note=${newNote.id}`);
  };

  const updateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map(note =>
      note.id === updatedNote.id
        ? { ...updatedNote, updatedAt: new Date().toISOString() }
        : note
    );
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    setIsDirty(false);
  };

  const deleteNote = () => {
    if (!selectedNote) return;
    
    const updatedNotes = notes.filter(note => note.id !== selectedNote.id);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    router.push('/');
  };

  const handleNoteSelect = (id: string) => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to switch notes?');
      if (!confirmed) return;
    }
    router.push(`/?note=${id}`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-80 border-r border-[var(--border)] bg-white">
        <Sidebar
          notes={notes}
          selectedNoteId={selectedNote?.id || null}
          onNoteSelect={handleNoteSelect}
          onNewNote={createNewNote}
        />
      </div>
      <div className="flex-1">
        {isLoading ? (
          <Loader />
        ) : selectedNote ? (
          <Editor
            note={selectedNote}
            onUpdate={(note) => {
              updateNote(note);
              setIsDirty(false);
            }}
            onDelete={deleteNote}
            isDirty={isDirty}
            onChange={() => setIsDirty(true)}
          />
        ) : (
          <Welcome onCreateNote={createNewNote} />
        )}
      </div>
    </div>
  );
}
