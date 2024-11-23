'use client';

import dynamic from 'next/dynamic';
import { Note } from '@/types/note';

const Editor = dynamic(() => import('./Editor'), { ssr: false });

interface EditorWrapperProps {
  note: Note;
  onUpdate: (note: Note) => void;
  onDelete: () => void;
  isDirty: boolean;
  onChange: () => void;
}

export default function EditorWrapper(props: EditorWrapperProps) {
  return <Editor {...props} />;
}
