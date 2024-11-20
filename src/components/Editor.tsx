import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, Editor as TiptapEditor } from '@tiptap/react';
import { AlertCircle, ArrowUp, Eye, Edit2 } from 'lucide-react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Image from '@tiptap/extension-image';
import { Color } from '@tiptap/extension-color';
import { Note } from '@/types/note';
import { ErrorBoundary } from './ErrorBoundary';
import EditorToolbar from './EditorToolbar';
import { Extension } from '@tiptap/core';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import Typography from '@tiptap/extension-typography';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      /**
       * Set the font size
       */
      setFontSize: (size: string) => ReturnType;
      /**
       * Unset the font size
       */
      unsetFontSize: () => ReturnType;
    };
  }
}

const lowlight = createLowlight(common);

// Custom extension for font size
const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
      defaultSize: '16px',
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain, state }) => {
          return chain()
            .setMark('textStyle', { fontSize })
            .run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark('textStyle', { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

interface EditorProps {
  note: Note;
  onUpdate: (note: Note) => void;
  onDelete: () => void;
  isDirty: boolean;
  onChange: () => void;
}

const ErrorFallback = ({ error, resetEditor }: { error: Error; resetEditor: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full p-6 bg-red-50">
    <AlertCircle className="w-12 h-12 mb-4 text-red-500" />
    <h3 className="text-lg font-semibold text-red-800 mb-2">Editor Error</h3>
    <p className="text-sm text-red-600 text-center mb-4">
      {error.message || 'There was an error loading the editor'}
    </p>
    <button
      onClick={resetEditor}
      className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
    >
      Reset Editor
    </button>
  </div>
);

const Editor: React.FC<EditorProps> = ({ note, onUpdate, onDelete, isDirty, onChange }) => {
  const [isEditMode, setIsEditMode] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(note?.title || '');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextStyle,
      FontFamily,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'cursor-pointer text-blue-500 hover:underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
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
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Typography,
      Underline,
      Superscript,
      Subscript,
    ],
    content: note.content || '<p></p>',
    editable: true,
    autofocus: 'end',
    editorProps: {
      attributes: {
        class: 'prose max-w-none w-full focus:outline-none min-h-[calc(100vh-10rem)] h-full',
        spellcheck: 'false',
      },
    },
    onTransaction: ({ editor }) => {
      // Only set empty content if there's no content at all
      if (editor.isEmpty && !editor.isActive('paragraph')) {
        editor.commands.clearContent();
        editor.commands.setContent('<p></p>');
      }
    },
    onUpdate: ({ editor }) => {
      // Prevent update if content is just an empty paragraph
      const content = editor.getHTML();
      if (content === '<p></p>' && note.content === '<p></p>') {
        return;
      }
      onChange();
      onUpdate({
        ...note,
        content,
        updatedAt: new Date().toISOString(),
      });
    },
  });

  // Sync content with note changes
  useEffect(() => {
    if (editor && note?.content && !editor.isDestroyed) {
      const currentContent = editor.getHTML();
      if (currentContent !== note.content) {
        editor.commands.setContent(note.content);
      }
    }
  }, [editor, note]);

  useEffect(() => {
    const container = editorContainerRef.current;
    if (container) {
      const handleScroll = () => {
        setShowScrollTop(container.scrollTop > 100);
      };
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    editorContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitleValue(newTitle);
    onChange();
    onUpdate({
      ...note,
      title: newTitle,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-white">
        <div className="flex items-center flex-1">
          {isEditingTitle ? (
            <input
              type="text"
              value={titleValue}
              onChange={handleTitleChange}
              onKeyDown={handleTitleKeyDown}
              onBlur={() => setIsEditingTitle(false)}
              className="flex-1 text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0"
              autoFocus
            />
          ) : (
            <h1
              className="text-xl font-semibold cursor-pointer"
              onClick={() => setIsEditingTitle(true)}
            >
              {titleValue}
            </h1>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="p-2 text-gray-500 hover:text-gray-700"
            title={isEditMode ? 'Preview' : 'Edit'}
          >
            {isEditMode ? <Eye size={20} /> : <Edit2 size={20} />}
          </button>
        </div>
      </div>

      <EditorToolbar editor={editor} />

      <div
        ref={editorContainerRef}
        className="flex-1 overflow-y-auto bg-gray-50/50"
      >
        <div className="h-full w-[95%] mx-auto p-8">
          <ErrorBoundary>
            <EditorContent editor={editor} className="w-full min-h-[500px]" />
          </ErrorBoundary>
        </div>

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
            title="Scroll to top"
          >
            <ArrowUp size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Editor;
