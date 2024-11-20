'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Note } from '@/types/note';
import { Plus, FileText, Search, Calendar } from 'react-feather';

interface SidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  onNoteSelect: (noteId: string) => void;
  onNewNote: () => void;
}

interface GroupedNotes {
  [key: string]: Note[];
}

// Move constants outside component to prevent recreating on each render
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${year}`;
};

const getRelativeTime = (date: Date): string => {
  const now = Date.now();
  const timestamp = new Date(date).getTime();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  // Use fixed date format to avoid locale issues
  const d = new Date(date);
  const month = MONTHS[d.getMonth()].slice(0, 3);
  const day = d.getDate();
  const year = d.getFullYear();
  const currentYear = new Date().getFullYear();
  
  return currentYear === year ? `${month} ${day}` : `${month} ${day}, ${year}`;
};

const Sidebar: React.FC<SidebarProps> = ({
  notes,
  selectedNoteId,
  onNoteSelect,
  onNewNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState<{ [key: string]: boolean }>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize filtered notes
  const filteredNotes = useMemo(() => 
    notes.filter(note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [notes, searchQuery]
  );

  // Memoize grouped notes with stable date formatting
  const groupedNotes = useMemo(() => 
    filteredNotes.reduce((groups: GroupedNotes, note) => {
      const month = formatDate(note.createdAt);
      if (!groups[month]) {
        groups[month] = [];
      }
      groups[month].push(note);
      return groups;
    }, {}),
    [filteredNotes]
  );

  const toggleExpand = useCallback((month: string) => {
    setIsExpanded(prev => ({
      ...prev,
      [month]: !prev[month]
    }));
  }, []);

  // Don't render anything until mounted
  if (!mounted) {
    return <div className="flex flex-col h-full animate-pulse bg-gray-100" />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-4 py-3 border-y border-[var(--border-light)]">
        <h2 className="text-lg font-medium text-gray-800">My Notes</h2>
        <button
          onClick={onNewNote}
          className="p-2 text-gray-600 hover:text-[var(--primary)] hover:bg-blue-50 rounded-lg transition-colors"
          aria-label="Create new note"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 py-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-gray-50 border border-[var(--border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-20"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {Object.entries(groupedNotes).map(([month, monthNotes]) => (
          <div key={month} className="mb-2">
            <button
              onClick={() => toggleExpand(month)}
              className="w-full px-4 py-2 flex items-center justify-between text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{month}</span>
                <span className="text-xs text-gray-400">({monthNotes.length})</span>
              </div>
              <svg
                className={`w-4 h-4 transition-transform ${isExpanded[month] ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {isExpanded[month] && (
              <div className="py-1 space-y-0.5">
                {monthNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => onNoteSelect(note.id)}
                    className={`w-full px-4 py-2 text-left flex items-center gap-3 group transition-colors ${
                      selectedNoteId === note.id
                        ? 'bg-blue-50 text-[var(--primary)]'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{note.title}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {getRelativeTime(new Date(note.updatedAt))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
