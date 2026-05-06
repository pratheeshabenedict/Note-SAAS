import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Grid3X3, List, Sun, Moon, Monitor,
  Plus, Filter, X, SortAsc, Trash2, Archive,
  Pin, Star, MoreHorizontal
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import useNotesStore from '../../store/notesStore';
import { useAuth } from '../../context/AuthContext';

export default function Topbar({ onMenuClick }) {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const {
    view, setView, searchQuery, setSearchQuery,
    fetchNotes, filters, setFilters, selectedNotes,
    clearSelection, bulkUpdate, emptyTrash, deleteNote
  } = useNotesStore();

  const [showSearch, setShowSearch] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const searchRef = useRef(null);
  const themeRef = useRef(null);

  useEffect(() => {
    if (showSearch) searchRef.current?.focus();
  }, [showSearch]);

  useEffect(() => {
    const handler = (e) => {
      if (!themeRef.current?.contains(e.target)) setShowThemeMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    fetchNotes({ search: q });
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: <Sun size={14} /> },
    { value: 'dark', label: 'Dark', icon: <Moon size={14} /> },
    { value: 'system', label: 'System', icon: <Monitor size={14} /> },
  ];

  const currentThemeIcon = theme === 'dark' ? <Moon size={16} /> : theme === 'light' ? <Sun size={16} /> : <Monitor size={16} />;

  const getPageTitle = () => {
    if (filters.isTrashed) return 'Trash';
    if (filters.isArchived) return 'Archive';
    if (filters.isPinned) return 'Pinned';
    if (filters.isFavorite) return 'Favorites';
    if (filters.notebook) return 'Notebook';
    return 'All Notes';
  };

  return (
    <header className="h-14 flex-shrink-0 border-b border-[var(--edge)] bg-[var(--surface)] flex items-center px-4 gap-3 z-10">
      {/* Hamburger — mobile only */}
      <button
        className="btn-icon btn-ghost md:hidden flex-shrink-0"
        onClick={onMenuClick}
        title="Menu"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Title */}
      {!showSearch && (
        <div className="flex-1 flex items-center gap-3">
          <h1 className="text-base font-semibold text-[var(--ink)]">{getPageTitle()}</h1>

          {/* Bulk actions */}
          {selectedNotes.length > 0 && (
            <div className="flex items-center gap-1.5 ml-2 animate-fade-in">
              <span className="text-xs text-[var(--ink-muted)] bg-[var(--surface-raised)] px-2 py-1 rounded-md border border-[var(--edge)]">
                {selectedNotes.length} selected
              </span>
              <button className="btn-ghost btn-sm gap-1.5" onClick={() => bulkUpdate(selectedNotes, { isPinned: true })}>
                <Pin size={12} /> Pin
              </button>
              <button className="btn-ghost btn-sm gap-1.5" onClick={() => bulkUpdate(selectedNotes, { isArchived: true })}>
                <Archive size={12} /> Archive
              </button>
              <button className="btn-ghost btn-sm gap-1.5 text-red-500 hover:text-red-600" onClick={() => bulkUpdate(selectedNotes, { isTrashed: true })}>
                <Trash2 size={12} /> Delete
              </button>
              <button className="btn-icon btn-ghost w-7 h-7" onClick={clearSelection}>
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Search bar */}
      {showSearch ? (
        <div className="flex-1 flex items-center gap-2 animate-fade-in">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={handleSearch}
              className="input pl-9 h-9 text-sm"
            />
          </div>
          <button
            className="btn-icon btn-ghost"
            onClick={() => { setShowSearch(false); setSearchQuery(''); fetchNotes({ search: '' }); }}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <button className="btn-icon btn-ghost" onClick={() => setShowSearch(true)} title="Search">
            <Search size={16} />
          </button>

          {/* View toggle */}
          <div className="flex items-center bg-[var(--surface-raised)] rounded-lg p-0.5 border border-[var(--edge)]">
            <button
              className={`p-1.5 rounded-md transition-all ${view === 'grid' ? 'bg-[var(--surface-overlay)] shadow-sm text-[var(--ink)]' : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'}`}
              onClick={() => setView('grid')}
              title="Grid view"
            >
              <Grid3X3 size={14} />
            </button>
            <button
              className={`p-1.5 rounded-md transition-all ${view === 'list' ? 'bg-[var(--surface-overlay)] shadow-sm text-[var(--ink)]' : 'text-[var(--ink-muted)] hover:text-[var(--ink)]'}`}
              onClick={() => setView('list')}
              title="List view"
            >
              <List size={14} />
            </button>
          </div>

          {/* Trash-specific: empty trash button */}
          {filters.isTrashed && (
            <button
              className="btn-secondary btn-sm text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20 ml-1"
              onClick={() => { if (window.confirm('Permanently delete all trashed notes?')) emptyTrash(); }}
            >
              <Trash2 size={13} />
              Empty Trash
            </button>
          )}

          {/* Theme toggle */}
          <div className="relative" ref={themeRef}>
            <button
              className="btn-icon btn-ghost"
              onClick={() => setShowThemeMenu((p) => !p)}
              title="Theme"
            >
              {currentThemeIcon}
            </button>
            {showThemeMenu && (
              <div className="absolute right-0 top-full mt-1.5 bg-[var(--surface-overlay)] border border-[var(--edge)] rounded-xl shadow-modal p-1 z-50 w-36 animate-scale-in">
                {themeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setTheme(opt.value); setShowThemeMenu(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${theme === opt.value
                      ? 'bg-[var(--brand-subtle)] text-[var(--brand-text)] font-medium'
                      : 'text-[var(--ink-secondary)] hover:bg-[var(--surface-sunken)]'
                      }`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}