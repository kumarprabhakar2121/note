'use client';

import { useState, useMemo } from 'react';
import { Note } from '@/types/note';
import { Plus, FileText, Search, Calendar } from 'react-feather';

interface SidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  onNoteSelect: (id: string) => void;
  onNewNote: () => void;
}

interface GroupedNotes {
  [key: string]: Note[];
}

const getMonthName = (month: number): string => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month];
};

const Sidebar = ({ notes, selectedNoteId, onNoteSelect, onNewNote }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState<{ [key: string]: boolean }>({});

  // Group notes by date
  const groupedNotes = useMemo(() => {
    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.reduce((groups: GroupedNotes, note) => {
      const date = new Date(note.createdAt);
      const month = `${getMonthName(date.getMonth())} ${date.getFullYear()}`;

      if (!groups[month]) {
        groups[month] = [];
      }
      groups[month].push(note);
      return groups;
    }, {});
  }, [notes, searchQuery]);

  const toggleGroup = (month: string) => {
    setIsExpanded(prev => ({
      ...prev,
      [month]: !prev[month]
    }));
  };

  const formatUpdateTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

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
              onClick={() => toggleGroup(month)}
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
                        {formatUpdateTime(new Date(note.updatedAt))}
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
