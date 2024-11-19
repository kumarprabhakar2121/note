'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });
import { Note } from '@/types/note';
import Loader from '@/components/Loader';

export default function NotePage() {
  const params = useParams();
  const noteId = params?.noteId as string;
  const [mounted, setMounted] = useState(false);
  const [note, setNote] = useState<Note | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const notes: Note[] = JSON.parse(savedNotes);
      const foundNote = notes.find(n => n.id === noteId);
      if (foundNote) {
        setNote(foundNote);
        localStorage.setItem('selectedNoteId', noteId);
      } else {
        // router.push('/notes');
      }
    }
    setMounted(true);
  }, [noteId]);

  const updateNote = (updatedNote: Note) => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const notes: Note[] = JSON.parse(savedNotes);
      const updatedNotes = notes.map(n =>
        n.id === updatedNote.id
          ? { ...updatedNote, updatedAt: new Date().toISOString() }
          : n
      );
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      setNote(updatedNote);
      setIsDirty(false);
    }
  };

  const deleteNote = () => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const notes: Note[] = JSON.parse(savedNotes);
      const updatedNotes = notes.filter(n => n.id !== noteId);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      localStorage.removeItem('selectedNoteId');
      // router.push('/notes');
    }
  };

  if (!mounted) {
    return <Loader />;
  }

  if (!note) {
    return null;
  }

  return (
    <Editor
      note={note}
      onUpdate={updateNote}
      onDelete={deleteNote}
      isDirty={isDirty}
      onChange={() => setIsDirty(true)}
    />
  );
}
