'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Editor from '@/components/Editor';
import Sidebar from '@/components/Sidebar';
import Welcome from '@/components/Welcome';
import { useNoteStore } from '@/store/noteStore';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteId = searchParams.get('note');
  const [isLoading, setIsLoading] = useState(true);

  const {
    notes,
    selectedNoteId,
    setSelectedNoteId,
    createNote,
    deleteNote,
    updateNote,
    isDirty,
    initializeNotes,
  } = useNoteStore();

  useEffect(() => {
    initializeNotes();
    setIsLoading(false);
  }, [initializeNotes]);

  useEffect(() => {
    if (noteId) {
      if (notes.some(note => note.id === noteId)) {
        setSelectedNoteId(noteId);
      } else {
        router.push('/');
      }
    } else {
      setSelectedNoteId(null);
    }
  }, [noteId, notes, setSelectedNoteId, router]);

  const handleNoteSelect = (id: string) => {
    router.push(`/?note=${id}`);
  };

  const handleNewNote = () => {
    const newNote = createNote();
    router.push(`/?note=${newNote.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <main className="flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-80 border-r border-[var(--border)]">
          <Sidebar
            notes={notes}
            selectedNoteId={selectedNoteId}
            onNoteSelect={handleNoteSelect}
            onNewNote={handleNewNote}
          />
        </div>
        <div className="flex-1 min-w-0">
          {selectedNoteId ? (
            <Editor
              note={notes.find((n) => n.id === selectedNoteId)!}
              onUpdate={updateNote}
              onDelete={deleteNote}
              isDirty={isDirty}
            />
          ) : (
            <Welcome onCreateNote={handleNewNote} />
          )}
        </div>
      </main>
    </div>
  );
}
