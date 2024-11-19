import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import FontFamily from '@tiptap/extension-font-family';
import { common, createLowlight } from 'lowlight'
import EditorToolbar from './EditorToolbar';
import { useEffect, useState, useRef } from 'react';
import { ArrowUp } from 'react-feather';

const lowlight = createLowlight(common);

interface EditorProps {
  note: { title: string; content: string };
  onUpdate: (note: { title: string; content: string }) => void;
  onDelete: () => void;
  isDirty: boolean;
}

const Editor = ({ note, onUpdate, onDelete, isDirty }: EditorProps) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(note?.title || '');
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitleValue(note?.title || '');
  }, [note?.title]);

  const handleTitleClick = () => {
    setIsEditingTitle(true);
    setTimeout(() => {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }, 0);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
    onUpdate({ ...note, title: e.target.value });
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (titleValue.trim() === '') {
      setTitleValue(note?.title || '');
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
    } else if (e.key === 'Escape') {
      setTitleValue(note?.title || '');
      setIsEditingTitle(false);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your note...',
      }),
      Highlight,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Superscript,
      Subscript,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Image.configure({
        allowBase64: true,
        inline: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'plaintext',
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
    ],
    content: note.content,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      onUpdate({ ...note, content });
    },
  });

  useEffect(() => {
    if (editor && note.content !== editor.getHTML()) {
      editor.commands.setContent(note.content);
    }
  }, [note.content, editor]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setShowScrollTop(scrollTop > 300);
  };

  const scrollToTop = () => {
    if (editorContainerRef.current) {
      editorContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[var(--border-light)] bg-gray-50/30">
        <div className="flex items-center gap-4 p-4 sm:p-6">
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={titleValue}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="text-xl font-semibold text-gray-800 bg-white border border-[var(--primary)] rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-20"
              placeholder="Note title"
            />
          ) : (
            <h2
              onClick={handleTitleClick}
              className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-[var(--primary)] transition-colors"
            >
              {note?.title || 'Untitled'}
            </h2>
          )}
          {isDirty && (
            <span className="text-sm bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full flex items-center">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5"></span>
              Unsaved changes
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 px-4 sm:px-6 pb-4 sm:pb-0 w-full sm:w-auto">
          <button
            onClick={onDelete}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full sm:w-auto border border-red-200"
          >
            Delete Note
          </button>
          <button
            onClick={() => onUpdate({ ...note })}
            disabled={!isDirty}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors w-full sm:w-auto ${
              isDirty
                ? 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] border border-transparent'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }`}
          >
            {isDirty ? 'Save Changes' : 'Saved'}
          </button>
        </div>
      </div>
      <EditorToolbar editor={editor} />
      <div
        ref={editorContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-white w-full relative"
      >
        <div className="h-full w-full max-w-[95%] xl:max-w-[90%] mx-auto py-8">
          <EditorContent
            editor={editor}
            className="min-h-[500px] w-full prose prose-base sm:prose-lg lg:prose-xl prose-slate prose-headings:font-display rounded-lg border border-[var(--border-light)] transition-all duration-200 focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)] focus-within:ring-opacity-20"
          />
        </div>
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-white rounded-full shadow-lg border border-[var(--border-light)] hover:shadow-xl transition-all duration-200 hover:border-[var(--primary)] group"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 text-gray-600 group-hover:text-[var(--primary)]" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Editor;
