import { useEffect, useState, useRef, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import FontFamily from '@tiptap/extension-font-family';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';
import { ArrowUp, Eye, Edit2, AlertCircle } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import EditorToolbar from './EditorToolbar';

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
  note: {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  };
  onUpdate: (note: any) => void;
  onDelete: () => void;
  isDirty: boolean;
  onChange?: () => void;
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

const Editor = ({ note, onUpdate, onDelete, isDirty, onChange }: EditorProps) => {
  const [isEditMode, setIsEditMode] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(note?.title || '');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [editorError, setEditorError] = useState<Error | null>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleScroll = useCallback((event: Event) => {
    const target = event.target as HTMLDivElement;
    setShowScrollTop(target.scrollTop > 100);
  }, []);

  const handleEditorError = (error: Error) => {
    console.error('Editor error:', error);
    setEditorError(error);
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Typography,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Superscript,
      Subscript,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:text-blue-600 underline',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'plaintext',
      }),
      TextStyle.configure(),
      FontFamily,
      FontSize.configure({
        types: ['textStyle'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TaskList,
      TaskItem,
      Underline,
    ],
    content: note.content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-lg lg:prose-xl mx-auto focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      try {
        const content = editor.getHTML();
        onChange?.();
        onUpdate({ ...note, content });
      } catch (error) {
        handleEditorError(error as Error);
      }
    },
  });

  const resetEditor = useCallback(() => {
    if (!editor) return;

    try {
      setEditorError(null);
      editor.commands.clearContent();
      editor.commands.setContent(note.content);
    } catch (error) {
      handleEditorError(error as Error);
    }
  }, [editor, note.content]);

  // Handle content updates
  useEffect(() => {
    if (!editor || !note?.content) return;

    try {
      const currentContent = editor.getHTML();
      if (currentContent !== note.content) {
        editor.commands.setContent(note.content);
      }
    } catch (error) {
      handleEditorError(error as Error);
    }
  }, [note?.content]);

  // Handle scroll behavior
  useEffect(() => {
    const container = editorContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setTitleValue(e.target.value);
    } catch (error) {
      handleEditorError(error as Error);
    }
  }, []);

  const handleTitleBlur = useCallback(() => {
    try {
      setIsEditingTitle(false);
      if (titleValue !== note.title) {
        onUpdate({ ...note, title: titleValue });
      }
    } catch (error) {
      handleEditorError(error as Error);
    }
  }, [titleValue, note, onUpdate]);

  const handleTitleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      titleInputRef.current?.blur();
    }
  }, []);

  const handleTitleClick = () => {
    if (isEditMode) {
      setIsEditingTitle(true);
      setTimeout(() => {
        titleInputRef.current?.focus();
        titleInputRef.current?.select();
      }, 0);
    }
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    editor?.setEditable(!isEditMode);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      onDelete();
    }
  };

  const scrollToTop = () => {
    editorContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (editorError) {
    return <ErrorFallback error={editorError} resetEditor={resetEditor} />;
  }

  return (
    <ErrorBoundary>
      <div className="h-full flex flex-col bg-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[var(--border-light)] bg-gray-50/30">
          <div className="flex items-center ml-20 gap-4 p-4 sm:p-6">
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                value={titleValue}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="text-xl font-semibold text-gray-800 bg-white border border-[var(--primary)] rounded px-2 py-1 focus:outline-none"
                placeholder="Note title"
              />
            ) : (
              <h2
                onClick={handleTitleClick}
                className={`text-xl font-semibold text-gray-800 ${isEditMode ? 'cursor-pointer hover:text-[var(--primary)]' : 'cursor-default'} transition-colors`}
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
              onClick={toggleEditMode}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 border border-[var(--border-light)]"
              title={isEditMode ? "Switch to preview mode" : "Switch to edit mode"}
            >
              {isEditMode ? (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  <span>Edit</span>
                </>
              )}
            </button>
            <button
              onClick={handleDelete}
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
        {isEditMode && <EditorToolbar editor={editor} />}
        <div
          ref={editorContainerRef}
          className="flex-1 overflow-y-auto bg-gray-50/50 w-full relative p-4 sm:p-6"
        >
          <div className="h-full w-full max-w-[95%] xl:max-w-[90%] mx-auto bg-white rounded-xl shadow-sm">
            <EditorContent
              editor={editor}
              className="min-h-[500px] w-full prose prose-base sm:prose-lg lg:prose-xl prose-slate prose-headings:font-display rounded-lg border border-[var(--border-light)] transition-all duration-200"
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
    </ErrorBoundary>
  );
};

export default Editor;
