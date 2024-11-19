'use client';

import Welcome from '@/components/Welcome';
import { useRouter } from 'next/navigation';

export default function NotesPage() {
  const router = useRouter();

  const handleCreateNote = () => {
    const now = new Date();
    const date = now.getDate();
    const month = now.toLocaleString('default', { month: 'long' });
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    const newNote = {
      id: crypto.randomUUID(),
      title: `${month} ${date}, ${formattedHours}:${formattedMinutes} ${ampm}`,
      content: '',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    const savedNotes = localStorage.getItem('notes');
    const notes = savedNotes ? JSON.parse(savedNotes) : [];
    const updatedNotes = [newNote, ...notes];
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    router.push(`/notes/${newNote.id}`);
  };

  return <Welcome onCreateNote={handleCreateNote} />;
}
