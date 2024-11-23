import React from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';
import type { IAllProps } from '@tinymce/tinymce-react';
import { ArrowUp, Check } from 'lucide-react';
import type { Editor as TinyMCEEditorType } from 'tinymce';
import { Note } from '@/types/note';
import { ErrorBoundary } from './ErrorBoundary';

interface EditorProps {
  note: Note;
  onUpdate: (note: Note) => void;
  onDelete: () => void;
  isDirty: boolean;
  onChange: () => void;
}

const Editor = ({ note, onUpdate, onDelete, isDirty, onChange }: EditorProps) => {
  const [isEditingTitle, setIsEditingTitle] = React.useState(false);
  const [titleValue, setTitleValue] = React.useState(note?.title || '');
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  const [showSaveIndicator, setShowSaveIndicator] = React.useState(false);
  const [isEditorReady, setIsEditorReady] = React.useState(false);
  const editorContainerRef = React.useRef<HTMLDivElement>(null);
  const editorRef = React.useRef<TinyMCEEditorType | null>(null);
  const saveTimeoutRef = React.useRef<NodeJS.Timeout>();
  const contentRef = React.useRef(note.content);
  const initialLoadRef = React.useRef(true);

  // Load note from localStorage on mount
  React.useEffect(() => {
    const savedNote = localStorage.getItem(`note_${note.id}`);
    if (savedNote) {
      try {
        const parsedNote = JSON.parse(savedNote);
        setTitleValue(parsedNote.title);
        contentRef.current = parsedNote.content;
        if (editorRef.current && isEditorReady) {
          editorRef.current.setContent(parsedNote.content || '');
        }
        onUpdate(parsedNote);
      } catch (error) {
        console.error('Error loading note from localStorage:', error);
      }
    }
  }, [note.id, isEditorReady, onUpdate]);

  // Update local state when note prop changes
  React.useEffect(() => {
    if (isEditorReady && editorRef.current) {
      setTitleValue(note.title);

      const currentContent = editorRef.current.getContent();
      if (currentContent !== note.content) {
        try {
          editorRef.current.setContent(note.content || '');
        } catch (error) {
          console.error('Error updating editor content:', error);
        }
      }

      contentRef.current = note.content;
    }
  }, [note, isEditorReady]);

  const showSavedMessage = React.useCallback(() => {
    setShowSaveIndicator(true);
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      setShowSaveIndicator(false);
    }, 2000);
  }, []);

  const saveNote = React.useCallback((updatedNote: Partial<Note>) => {
    const newNote = {
      ...note,
      ...updatedNote,
      updatedAt: new Date().toISOString()
    };

    // Update parent component
    onUpdate(newNote);
    onChange();

    // Save to localStorage
    try {
      localStorage.setItem(`note_${note.id}`, JSON.stringify(newNote));
      console.log('Note saved to localStorage:', newNote);
      showSavedMessage();
    } catch (error) {
      console.error('Error saving note to localStorage:', error);
    }
  }, [note, onUpdate, onChange, showSavedMessage]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitleValue(newTitle);
    saveNote({ title: newTitle });
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditingTitle(false);
    }
  };

  const handleEditorChange = (content: string) => {
    if (content !== contentRef.current) {
      contentRef.current = content;
      saveNote({ content });
    }
  };

  const handlePrint = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent();
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${titleValue}</title>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
                  font-size: 14px;
                  line-height: 1.5;
                  padding: 20px;
                }
                img { max-width: 100%; height: auto; }
                pre { background-color: #f4f4f4; padding: 1em; border-radius: 4px; }
                table { border-collapse: collapse; width: 100%; }
                table td, table th { border: 1px solid #ddd; padding: 8px; }
              </style>
            </head>
            <body>
              <h1>${titleValue}</h1>
              ${content}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  React.useEffect(() => {
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

  const editorConfig: NonNullable<IAllProps['init']> = {
    height: 670,
    menubar: false,
    plugins: [
      'lists', 'advlist', 'autolink', 'link',
      'image', 'media', 'table', 'codesample',
      'charmap', 'emoticons', 'pagebreak',
      'visualchars', 'searchreplace', 'visualblocks',
      'code', 'fullscreen', 'preview', 'wordcount', 'help'
    ],
    toolbar: [
      'bold italic underline strikethrough | bullist numlist | alignleft aligncenter alignright alignjustify',
      'formatselect | styles blocks | fontfamily fontsize lineheight | forecolor backcolor | superscript subscript | indent outdent | removeformat',
      'link image media table codesample | charmap emoticons',
      'undo redo | searchreplace | preview fullscreen customprint markdownhelp'
    ].join(' | '),
    setup: (editor: TinyMCEEditorType) => {
      editorRef.current = editor;

      editor.ui.registry.addButton('customprint', {
        icon: 'print',
        tooltip: 'Print',
        onAction: handlePrint
      });

      editor.ui.registry.addButton('markdownhelp', {
        icon: 'help',
        tooltip: 'Markdown Shortcuts',
        onAction: () => {
          editor.windowManager.open({
            title: 'Markdown Shortcuts',
            body: {
              type: 'panel',
              items: [{
                type: 'htmlpanel',
                html: `
                  <div style="padding: 10px;">
                    <h3>Available Shortcuts:</h3>
                    <ul style="list-style-type: disc; margin-left: 20px;">
                      <li># - Heading 1</li>
                      <li>## - Heading 2</li>
                      <li>### - Heading 3</li>
                      <li>* - Bullet list</li>
                      <li>1. - Numbered list</li>
                      <li>> - Blockquote</li>
                      <li>\`\`\` - Code block</li>
                      <li>--- - Horizontal line</li>
                      <li>__text__ - Bold</li>
                      <li>_text_ - Italic</li>
                      <li>~~text~~ - Strikethrough</li>
                      <li>\`text\` - Inline code</li>
                    </ul>
                  </div>
                `
              }]
            },
            buttons: [{ type: 'cancel', text: 'Close' }]
          });
        }
      });

      editor.on('init', () => {
        setIsEditorReady(true);
      });

      // Debounced save handler for continuous typing
      let saveTimeout: NodeJS.Timeout;
      const debouncedSave = () => {
        if (saveTimeout) {
          clearTimeout(saveTimeout);
        }
        saveTimeout = setTimeout(() => {
          const content = editor.getContent();
          if (content !== contentRef.current) {
            saveNote({ content });
          }
        }, 1000);
      };

      // Add save handlers for different events
      editor.on('keyup', debouncedSave);
      editor.on('paste', debouncedSave);
      editor.on('cut', debouncedSave);
      editor.on('change', debouncedSave);

      // Cleanup on editor destroy
      editor.on('remove', () => {
        if (saveTimeout) {
          clearTimeout(saveTimeout);
        }
        setIsEditorReady(false);
      });

      const patterns = [
        { start: '# ', cmd: 'mceInsertContent', value: '<h1>$SELECTION</h1>' },
        { start: '## ', cmd: 'mceInsertContent', value: '<h2>$SELECTION</h2>' },
        { start: '### ', cmd: 'mceInsertContent', value: '<h3>$SELECTION</h3>' },
        { start: '* ', cmd: 'InsertUnorderedList' },
        { start: '1. ', cmd: 'InsertOrderedList' },
        { start: '> ', format: 'blockquote' },
        { start: '```', cmd: 'mceInsertContent', value: '<pre><code>$SELECTION</code></pre>' },
        { start: '---', cmd: 'mceInsertContent', value: '<hr />' }
      ];

      editor.on('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          const node = editor.selection.getNode();
          const text = node.textContent || '';
          patterns.forEach(pattern => {
            if (text.startsWith(pattern.start)) {
              e.preventDefault();
              const newText = text.substring(pattern.start.length);
              if (pattern.cmd) {
                editor.selection.setContent(newText);
                editor.execCommand(pattern.cmd, false, pattern.value?.replace('$SELECTION', newText) || '');
              } else if (pattern.format) {
                editor.selection.setContent(newText);
                editor.formatter.apply(pattern.format);
              }
            }
          });
        }
      });
    },
    content_style: `
      body {
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        font-size: 14px;
        line-height: 1.5;
      }
      img { max-width: 100%; height: auto; }
      pre { background-color: #f4f4f4; padding: 1em; border-radius: 4px; }
      table { border-collapse: collapse; width: 100%; }
      table td, table th { border: 1px solid #ddd; padding: 8px; }
      .tox-toolbar__group {
        padding: 4px 8px !important;
        border-right: 1px solid #e2e8f0 !important;
      }
      .tox-toolbar__group:last-child {
        border-right: none !important;
      }
      .tox-toolbar {
        background: #f8fafc !important;
        padding: 4px !important;
      }
      .tox-toolbar__primary {
        border-bottom: 1px solid #e2e8f0 !important;
      }
      .tox-tbtn {
        margin: 2px !important;
      }
      .tox-tbtn:hover {
        background: #e2e8f0 !important;
      }
    `,
    toolbar_mode: 'wrap' as const,
    toolbar_sticky: true,
    toolbar_location: 'top' as const,
    statusbar: true,
    resize: true,
    branding: false,
    promotion: false,
    disabled: false,
    browser_spellcheck: true,
    auto_focus: true as const,
    paste_data_images: true
  };

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
        {showSaveIndicator && (
          <div className="flex items-center text-sm text-green-600 gap-1 transition-opacity duration-300">
            <Check size={16} />
            <span>Saved</span>
          </div>
        )}
      </div>

      <div
        ref={editorContainerRef}
        className="flex-1 overflow-y-auto bg-gray-50/50"
      >
        <div className="h-full w-[95%] mx-auto p-8">
          <ErrorBoundary>
            <TinyMCEEditor
              apiKey="tedw2nu4kjgb57labcw2b1hs5h31ftwyygfx1ylb0h0aag71"
              onInit={(_, editor) => {
                editorRef.current = editor;
                editor.setContent(note.content || '');
              }}
              init={editorConfig}
              onEditorChange={handleEditorChange}
            />
          </ErrorBoundary>
        </div>
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
  );
};

export default Editor;
