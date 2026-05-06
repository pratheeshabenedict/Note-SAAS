import React, { useState, useEffect } from 'react';
import {
  BookOpen, Plus, Search, Star, Archive, Trash2, Hash,
  ChevronDown, ChevronRight, Settings, MoreHorizontal,
  Layers, Pin, Home, PanelLeftClose, PanelLeft, Pencil
} from 'lucide-react';
import useNotesStore from '../../store/notesStore';
import { useAuth } from '../../context/AuthContext';
import NotebookModal from '../notes/NotebookModal';

const COLOR_MAP = {
  red: '#fca5a5', orange: '#fdba74', yellow: '#fde047',
  green: '#86efac', teal: '#5eead4', blue: '#93c5fd',
  purple: '#c4b5fd', pink: '#f9a8d4', default: null,
};

export default function Sidebar() {
  const {
    notebooks, stats, filters, sidebarOpen,
    setFilters, resetFilters, fetchNotes,
    setSidebarOpen, createNote, fetchStats, fetchNotebooks,
  } = useNotesStore();

  const { user } = useAuth();
  const [notebooksExpanded, setNotebooksExpanded] = useState(true);
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const [notebookModal, setNotebookModal] = useState(false);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchNotebooks();
  }, []);

  const navigate = (newFilters) => {
    resetFilters();
    setFilters(newFilters);
    fetchNotes(newFilters);
  };

  const isActive = (check) => {
    return Object.entries(check).every(([k, v]) => filters[k] === v);
  };

  if (!sidebarOpen) {
    return (
      <div className="hidden md:flex w-14 flex-shrink-0 border-r border-[var(--edge)] bg-[var(--sidebar-bg)] flex-col items-center py-4 gap-2">
        <button onClick={() => setSidebarOpen(true)} className="btn-icon btn-ghost" title="Open sidebar">
          <PanelLeft size={18} />
        </button>
        <div className="w-8 h-8 rounded-lg bg-[var(--brand)] flex items-center justify-center mt-1">
          <BookOpen size={14} className="text-white" />
        </div>
        <div className="flex-1" />
        <button onClick={() => createNote()} className="btn-icon btn-primary" title="New note">
          <Plus size={16} />
        </button>
      </div>
    );
  }

  return (
    <>
      <aside className="
  fixed inset-y-0 left-0 z-30
  w-[260px] flex-shrink-0
  border-r border-[var(--edge)]
  bg-[var(--sidebar-bg)]
  flex flex-col h-full overflow-hidden
  md:static md:z-auto
">        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-[var(--edge)]">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[var(--brand)] flex items-center justify-center flex-shrink-0">
              <BookOpen size={14} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--ink)] truncate leading-tight">
                {user?.name?.split(' ')[0]}'s Notes
              </p>
              <p className="text-xs text-[var(--ink-muted)] capitalize">{user?.plan} plan</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="btn-icon btn-ghost w-7 h-7"
            title="Collapse sidebar"
          >
            <PanelLeftClose size={15} />
          </button>
        </div>

        {/* New Note Button */}
        <div className="p-3">
          <button
            onClick={() => createNote()}
            className="btn-primary w-full gap-2 py-2.5"
          >
            <Plus size={16} />
            New Note
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 pb-4 space-y-0.5">
          {/* Main navigation */}
          <NavItem
            icon={<Home size={16} />}
            label="All Notes"
            count={stats?.total}
            active={isActive({ isTrashed: false, isArchived: false, isPinned: null, isFavorite: null, notebook: null })}
            onClick={() => navigate({ isTrashed: false, isArchived: false })}
          />
          <NavItem
            icon={<Pin size={16} />}
            label="Pinned"
            count={stats?.pinned}
            active={filters.isPinned === true && !filters.isTrashed}
            onClick={() => navigate({ isPinned: true, isTrashed: false, isArchived: false })}
          />
          <NavItem
            icon={<Star size={16} />}
            label="Favorites"
            count={stats?.favorites}
            active={filters.isFavorite === true && !filters.isTrashed}
            onClick={() => navigate({ isFavorite: true, isTrashed: false, isArchived: false })}
          />
          <NavItem
            icon={<Archive size={16} />}
            label="Archive"
            count={stats?.archived}
            active={filters.isArchived === true && !filters.isTrashed}
            onClick={() => navigate({ isArchived: true, isTrashed: false })}
          />
          <NavItem
            icon={<Trash2 size={16} />}
            label="Trash"
            count={stats?.trashed}
            active={filters.isTrashed === true}
            onClick={() => navigate({ isTrashed: true })}
          />

          <div className="my-3 border-t border-[var(--edge)]" />

          {/* Notebooks section */}
          <div>
            <button
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-[var(--ink-muted)] hover:text-[var(--ink)] uppercase tracking-wider"
              onClick={() => setNotebooksExpanded((p) => !p)}
            >
              <span>Notebooks</span>
              <div className="flex items-center gap-1">
                <span
                  className="hover:bg-[var(--surface-sunken)] rounded p-0.5 transition-colors"
                  onClick={(e) => { e.stopPropagation(); setNotebookModal(true); }}
                  title="New notebook"
                >
                  <Plus size={13} />
                </span>
                {notebooksExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              </div>
            </button>

            {notebooksExpanded && (
              <div className="mt-1 space-y-0.5 animate-fade-in">
                {notebooks.map((nb) => (
                  <NavItem
                    key={nb._id}
                    icon={<span className="text-sm">{nb.icon}</span>}
                    label={nb.name}
                    count={nb.noteCount}
                    active={filters.notebook === nb._id && !filters.isTrashed && !filters.isArchived}
                    colorDot={COLOR_MAP[nb.color]}
                    onClick={() => navigate({ notebook: nb._id, isTrashed: false, isArchived: false })}
                  />
                ))}
                {notebooks.length === 0 && (
                  <p className="px-3 py-2 text-xs text-[var(--ink-muted)]">No notebooks yet</p>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--edge)]">
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--surface-sunken)] cursor-pointer transition-colors">
            <div className="w-7 h-7 rounded-full bg-[var(--brand)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--ink)] truncate">{user?.name}</p>
              <p className="text-xs text-[var(--ink-muted)] truncate">{user?.email}</p>
            </div>
            <Settings size={14} className="text-[var(--ink-muted)] flex-shrink-0" />
          </div>
        </div>
      </aside>

      {notebookModal && (
        <NotebookModal onClose={() => setNotebookModal(false)} />
      )}
    </>
  );
}

// Sidebar.jsx - NavItem function

function NavItem({ icon, label, count, active, onClick, colorDot }) {
  return (
    <button
      onClick={onClick}
      className={`nav-item w-full ${active ? 'active' : ''}`}
    >
      <span className="flex-shrink-0 text-[var(--ink-muted)]">{icon}</span>
      <span className="flex-1 text-left truncate">{label}</span>

      {/* ✅ ADD THIS */}
      {colorDot && (
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: colorDot }}
        />
      )}

      {count != null && count > 0 && (
        <span className="text-xs text-[var(--ink-muted)] font-mono">{count}</span>
      )}
    </button>
  );
}