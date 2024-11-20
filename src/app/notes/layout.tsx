'use client';

import { useEffect, useState } from 'react';
import { Note } from '@/types/note';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useRouter, usePathname } from 'next/navigation';
import Loader from '@/components/Loader';

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
    setMounted(true);
  }, []);

  const createNewNote = () => {
    const now = new Date();
    const date = now.getDate();
    const month = now.toLocaleString('default', { month: 'long' });
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const newNote: Note = {
      id: crypto.randomUUID(),
      title: `${month} ${date}, ${formattedHours}:${formattedMinutes} ${ampm}`,
      content: '',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    router.push(`/notes/${newNote.id}`);
  };

  const handleNoteSelect = (id: string) => {
    router.push(`/notes/${id}`);
  };

  if (!mounted) {
    return <Loader />;
  }

  const selectedNoteId = pathname.startsWith('/notes/') 
    ? pathname.split('/notes/')[1] 
    : null;

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 pt-14 flex overflow-hidden">
        <div className="w-80 border-r border-[var(--border)] bg-white">
          <Sidebar
            notes={notes}
            selectedNoteId={selectedNoteId}
            onNoteSelect={handleNoteSelect}
            onNewNote={createNewNote}
          />
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
