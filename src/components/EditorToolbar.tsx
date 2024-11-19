import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Quote,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Underline,
  Highlighter,
  Superscript,
  Subscript,
  CheckSquare,
  Table,
  Image as ImageIcon,
  Code2,
  Type,
} from 'lucide-react';

const SUPPORTED_LANGUAGES = [
  'bash',
  'c',
  'cpp',
  'csharp',
  'css',
  'diff',
  'go',
  'graphql',
  'ini',
  'java',
  'javascript',
  'json',
  'kotlin',
  'less',
  'lua',
  'makefile',
  'markdown',
  'objectivec',
  'perl',
  'php',
  'python',
  'r',
  'ruby',
  'rust',
  'scss',
  'shell',
  'sql',
  'swift',
  'typescript',
  'yaml',
  'xml'
];

const FONT_FAMILIES = [
  { name: 'Default', value: '' },
  { name: 'Inter', value: 'Inter' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Playfair Display', value: 'Playfair Display' },
  { name: 'Merriweather', value: 'Merriweather' },
  { name: 'Source Code Pro', value: 'Source Code Pro' },
  { name: 'Fira Code', value: 'Fira Code' },
];

const FONT_SIZES = [
  { label: 'Small', value: '12px' },
  { label: 'Medium', value: '14px' },
  { label: 'Large', value: '16px' },
  { label: 'Extra Large', value: '20px' },
  { label: 'Huge', value: '24px' },
  { label: 'Giant', value: '32px' },
];

const ToolbarButton = ({ onClick, active = false, disabled = false, children, title }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2.5 rounded-lg transition-all ${
      active
        ? 'bg-[var(--primary)] text-white shadow-sm'
        : 'hover:bg-gray-100 text-gray-700'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);

const ToolbarSelect = ({ value, onChange, options, disabled = false, title }: any) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    title={title}
    className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white hover:bg-gray-50 transition-all min-w-[160px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-50"
  >
    {options.map((option: any) => (
      <option key={option.value || option} value={option.value || option}>
        {option.label || option.name || option}
      </option>
    ))}
  </select>
);

interface EditorToolbarProps {
  editor: Editor | null;
}

const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 ml-11 pr-4 border-r border-gray-200">
          <Type size={18} className="text-gray-400 shrink-0" />
          <ToolbarSelect
            value={editor.getAttributes('textStyle').fontFamily || ''}
            onChange={(value: string) => {
              if (value) {
                editor.chain().focus().setFontFamily(value).run();
              } else {
                editor.chain().focus().unsetFontFamily().run();
              }
            }}
            options={FONT_FAMILIES}
            title="Font Family"
          />
        </div>

        <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
          <Type size={18} className="text-gray-400 shrink-0" />
          <ToolbarSelect
            value={editor.getAttributes('textStyle').fontSize || '16px'}
            onChange={(value: string) => {
              if (value === '16px') {
                editor.chain()
                  .focus()
                  .setMark('textStyle', { fontSize: null })
                  .removeEmptyTextStyle()
                  .run();
              } else {
                editor.chain()
                  .focus()
                  .setMark('textStyle', { fontSize: value })
                  .run();
              }
            }}
            options={FONT_SIZES}
            title="Font Size"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive('bold')}
              title="Bold"
            >
              <Bold size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive('italic')}
              title="Italic"
            >
              <Italic size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              active={editor.isActive('underline')}
              title="Underline"
            >
              <Underline size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              active={editor.isActive('superscript')}
              title="Superscript"
            >
              <Superscript size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              active={editor.isActive('subscript')}
              title="Subscript"
            >
              <Subscript size={18} />
            </ToolbarButton>
          </div>

          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              active={editor.isActive('heading', { level: 1 })}
              title="Heading 1"
            >
              <Heading1 size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor.isActive('heading', { level: 2 })}
              title="Heading 2"
            >
              <Heading2 size={18} />
            </ToolbarButton>
          </div>

          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <ListOrdered size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleList('taskList').run()}
              active={editor.isActive('taskList')}
              title="Task List"
            >
              <CheckSquare size={18} />
            </ToolbarButton>
          </div>

          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive('blockquote')}
              title="Quote"
            >
              <Quote size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              active={editor.isActive('highlight')}
              title="Highlight"
            >
              <Highlighter size={18} />
            </ToolbarButton>
          </div>

          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              active={editor.isActive({ textAlign: 'left' })}
              title="Align Left"
            >
              <AlignLeft size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              active={editor.isActive({ textAlign: 'center' })}
              title="Align Center"
            >
              <AlignCenter size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              active={editor.isActive({ textAlign: 'right' })}
              title="Align Right"
            >
              <AlignRight size={18} />
            </ToolbarButton>
          </div>

          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={addLink}
              active={editor.isActive('link')}
              title="Add Link"
            >
              <Link size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={addImage}
              title="Add Image"
            >
              <ImageIcon size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={addTable}
              title="Insert Table"
            >
              <Table size={18} />
            </ToolbarButton>
          </div>

          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              active={editor.isActive('codeBlock')}
              title="Code Block"
            >
              <Code2 size={18} />
            </ToolbarButton>
            {editor.isActive('codeBlock') && (
              <ToolbarSelect
                value={editor.getAttributes('codeBlock').language || 'plaintext'}
                onChange={(language: string) =>
                  editor
                    .chain()
                    .focus()
                    .setCodeBlock({ language })
                    .run()
                }
                options={SUPPORTED_LANGUAGES}
                title="Select Language"
              />
            )}
          </div>

          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo"
            >
              <Undo size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo"
            >
              <Redo size={18} />
            </ToolbarButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;
