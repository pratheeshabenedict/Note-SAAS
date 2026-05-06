import React, { useState } from 'react';
import {
  Pin, Star, Archive, Trash2, MoreHorizontal,
  RotateCcw, Edit3, BookOpen, Tag, Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import useNotesStore from '../../store/notesStore';

const COLOR_CLASSES = {
  red: 'note-color-red', orange: 'note-color-orange', yellow: 'note-color-yellow',
  green: 'note-color-green', teal: 'note-color-teal', blue: 'note-color-blue',
  purple: 'note-color-purple', pink: 'note-color-pink', default: '',
};

const COLOR_DOT = {
  red: '#fca5a5', orange: '#fdba74', yellow: '#fde047',
  green: '#86efac', teal: '#5eead4', blue: '#93c5fd',
  purple: '#c4b5fd', pink: '#f9a8d4',
};

export default function NoteCard({ note, view = 'grid' }) {
  const { setActiveNote, updateNote, deleteNote, restoreNote, selectedNotes, toggleNoteSelection, filters } = useNotesStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const isSelected = selectedNotes.includes(note._id);

  const stripHtml = (html) => html?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || '';

  const preview = stripHtml(note.content).slice(0, view === 'grid' ? 140 : 100);
  const timeAgo = formatDistanceToNow(new Date(note.updatedAt || note.createdAt), { addSuffix: true });

  const handleClick = (e) => {
    if (e.target.closest('.note-menu') || e.target.closest('.note-select')) return;
    if (note.isTrashed) return;
    setActiveNote(note);
  };

  const handleMenuAction = async (e, action) => {
    e.stopPropagation();
    setMenuOpen(false);
    await action();
  };

  const colorClass = COLOR_CLASSES[note.color] || '';

  if (view === 'list') {
    return (
      <div
        onClick={handleClick}
        className={`
          group relative flex items-center gap-4 px-4 py-3
          border-b border-[var(--edge)] hover:bg-[var(--surface-raised)]
          transition-colors cursor-pointer
          ${isSelected ? 'bg-[var(--brand-subtle)]' : ''}
          ${note.isTrashed ? 'opacity-60' : ''}
          ${colorClass}
        `}
        style={note.color !== 'default' ? { backgroundColor: 'var(--note-bg)' } : {}}
      >
        {/* Select checkbox */}
        <div
          className="note-select flex-shrink-0"
          onClick={(e) => { e.stopPropagation(); toggleNoteSelection(note._id); }}
        >
          <div className={`
            w-4 h-4 rounded border-2 transition-all flex items-center justify-center
            ${isSelected
              ? 'bg-[var(--brand)] border-[var(--brand)]'
              : 'border-[var(--edge-strong)] opacity-0 group-hover:opacity-100'
            }
          `}>
            {isSelected && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12"><path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>}
          </div>
        </div>

        {/* Color dot */}
        {note.color && note.color !== 'default' && (
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLOR_DOT[note.color] }} />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-[var(--ink)] truncate">
              {note.title || 'Untitled Note'}
            </span>
            {note.isPinned && <Pin size={11} className="text-[var(--brand)] flex-shrink-0" />}
            {note.isFavorite && <Star size={11} className="text-amber-400 flex-shrink-0 fill-amber-400" />}
          </div>
          {preview && (
            <p className="text-xs text-[var(--ink-muted)] truncate mt-0.5">{preview}</p>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {note.tags?.length > 0 && (
            <div className="hidden sm:flex items-center gap-1">
              {note.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="badge bg-[var(--surface-sunken)] text-[var(--ink-muted)]">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <span className="text-xs text-[var(--ink-muted)] whitespace-nowrap">{timeAgo}</span>
          <NoteMenu note={note} menuOpen={menuOpen} setMenuOpen={setMenuOpen} handleMenuAction={handleMenuAction} />
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={handleClick}
      className={`
        group relative rounded-xl border border-[var(--edge)] p-4
        cursor-pointer transition-all duration-200
        hover:shadow-card-hover hover:-translate-y-0.5
        ${isSelected ? 'ring-2 ring-[var(--brand)] border-[var(--brand)]' : 'hover:border-[var(--edge-strong)]'}
        ${note.isTrashed ? 'opacity-60' : ''}
        ${colorClass}
      `}
      style={{
        backgroundColor: note.color !== 'default' ? 'var(--note-bg)' : 'var(--surface-raised)',
      }}
    >
      {/* Select checkbox */}
      <div
        className="note-select absolute top-3 left-3 z-10"
        onClick={(e) => { e.stopPropagation(); toggleNoteSelection(note._id); }}
      >
        <div className={`
          w-4 h-4 rounded border-2 transition-all flex items-center justify-center
          ${isSelected
            ? 'bg-[var(--brand)] border-[var(--brand)]'
            : 'border-[var(--edge-strong)] opacity-0 group-hover:opacity-100 bg-[var(--surface)]'
          }
        `}>
          {isSelected && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12"><path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>}
        </div>
      </div>

      {/* Top badges */}
      <div className="flex items-start justify-between mb-2 gap-2">
        <div className="flex items-center gap-1.5 mt-0.5">
          {note.isPinned && <Pin size={12} className="text-[var(--brand)]" />}
          {note.isFavorite && <Star size={12} className="text-amber-400 fill-amber-400" />}
          {note.color && note.color !== 'default' && (
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLOR_DOT[note.color] }} />
          )}
        </div>
        <NoteMenu note={note} menuOpen={menuOpen} setMenuOpen={setMenuOpen} handleMenuAction={handleMenuAction} />
      </div>

      {/* Title */}
      <h3 className="font-semibold text-sm text-[var(--ink)] mb-1.5 line-clamp-1 leading-snug">
        {note.title || 'Untitled Note'}
      </h3>

      {/* Preview */}
      {preview && (
        <p className="text-xs text-[var(--ink-secondary)] line-clamp-3 leading-relaxed mb-3">
          {preview}
        </p>
      )}

      {/* Tags */}
      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="badge bg-[var(--surface-sunken)] text-[var(--ink-muted)] text-[10px]">
              #{tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="badge bg-[var(--surface-sunken)] text-[var(--ink-muted)] text-[10px]">
              +{note.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--edge)]">
        <span className="text-[10px] text-[var(--ink-muted)]">{timeAgo}</span>
        {note.wordCount > 0 && (
          <span className="text-[10px] text-[var(--ink-muted)]">{note.wordCount} words</span>
        )}
      </div>
    </div>
  );
}

function NoteMenu({ note, menuOpen, setMenuOpen, handleMenuAction }) {
  const { updateNote, deleteNote, restoreNote } = useNotesStore();

  return (
    <div className="note-menu relative">
      <button
        onClick={(e) => { e.stopPropagation(); setMenuOpen((p) => !p); }}
        className={`
          btn-icon w-7 h-7 transition-opacity
          ${menuOpen ? 'opacity-100 bg-[var(--surface-sunken)]' : 'opacity-0 group-hover:opacity-100'}
        `}
      >
        <MoreHorizontal size={14} />
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
          <div className="absolute right-0 top-full mt-1 bg-[var(--surface-overlay)] border border-[var(--edge)] rounded-xl shadow-modal p-1 z-50 w-44 animate-scale-in">
            {note.isTrashed ? (
              <>
                <MenuItem icon={<RotateCcw size={13} />} label="Restore" onClick={(e) => handleMenuAction(e, () => restoreNote(note._id))} />
                <MenuItem icon={<Trash2 size={13} />} label="Delete Forever" danger onClick={(e) => handleMenuAction(e, () => deleteNote(note._id))} />
              </>
            ) : (
              <>
                <MenuItem icon={<Edit3 size={13} />} label="Open" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }} />
                <MenuItem
                  icon={<Pin size={13} />}
                  label={note.isPinned ? 'Unpin' : 'Pin'}
                  onClick={(e) => handleMenuAction(e, () => updateNote(note._id, { isPinned: !note.isPinned }))}
                />
                <MenuItem
                  icon={<Star size={13} />}
                  label={note.isFavorite ? 'Unfavorite' : 'Favorite'}
                  onClick={(e) => handleMenuAction(e, () => updateNote(note._id, { isFavorite: !note.isFavorite }))}
                />
                <MenuItem
                  icon={<Archive size={13} />}
                  label={note.isArchived ? 'Unarchive' : 'Archive'}
                  onClick={(e) => handleMenuAction(e, () => updateNote(note._id, { isArchived: !note.isArchived }))}
                />
                <div className="my-1 border-t border-[var(--edge)]" />
                <MenuItem icon={<Trash2 size={13} />} label="Move to Trash" danger onClick={(e) => handleMenuAction(e, () => deleteNote(note._id))} />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function MenuItem({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
        danger
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          : 'text-[var(--ink-secondary)] hover:bg-[var(--surface-sunken)] hover:text-[var(--ink)]'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}