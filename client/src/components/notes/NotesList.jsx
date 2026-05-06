import React, { useEffect } from 'react';
import { Plus, FileText, Inbox } from 'lucide-react';
import useNotesStore from '../../store/notesStore';
import NoteCard from './NoteCard';

const SkeletonCard = () => (
  <div className="rounded-xl border border-[var(--edge)] p-4 bg-[var(--surface-raised)]">
    <div className="skeleton h-4 w-3/4 mb-3 rounded" />
    <div className="skeleton h-3 w-full mb-1.5 rounded" />
    <div className="skeleton h-3 w-5/6 mb-1.5 rounded" />
    <div className="skeleton h-3 w-4/6 mb-4 rounded" />
    <div className="skeleton h-3 w-1/3 rounded" />
  </div>
);

const EmptyState = ({ searchQuery, filters, onCreate }) => {
  if (filters.isTrashed) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-[var(--surface-raised)] border border-[var(--edge)] flex items-center justify-center mb-4">
          <Inbox size={28} className="text-[var(--ink-muted)]" />
        </div>
        <h3 className="font-semibold text-[var(--ink)] mb-1">Trash is empty</h3>
        <p className="text-sm text-[var(--ink-muted)]">Deleted notes will appear here</p>
      </div>
    );
  }

  if (searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-[var(--surface-raised)] border border-[var(--edge)] flex items-center justify-center mb-4">
          <FileText size={28} className="text-[var(--ink-muted)]" />
        </div>
        <h3 className="font-semibold text-[var(--ink)] mb-1">No results found</h3>
        <p className="text-sm text-[var(--ink-muted)]">Try different keywords or check your spelling</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-[var(--surface-raised)] border border-[var(--edge)] flex items-center justify-center mb-4">
        <Plus size={28} className="text-[var(--ink-muted)]" />
      </div>
      <h3 className="font-semibold text-[var(--ink)] mb-1">No notes yet</h3>
      <p className="text-sm text-[var(--ink-muted)] mb-5">Create your first note to get started</p>
      <button className="btn-primary" onClick={onCreate}>
        <Plus size={16} />
        New Note
      </button>
    </div>
  );
};

export default function NotesList() {
  const {
    notes, loading, view, searchQuery, filters,
    fetchNotes, createNote, pagination, setFilters
  } = useNotesStore();

  useEffect(() => {
    fetchNotes();
  }, [filters]);

  const handleLoadMore = () => {
    setFilters({});
    fetchNotes({ page: pagination.page + 1 });
  };

  if (loading && notes.length === 0) {
    return (
      <div className={`p-4 ${view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3' : ''}`}>
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (!loading && notes.length === 0) {
    return <EmptyState searchQuery={searchQuery} filters={filters} onCreate={() => createNote()} />;
  }

  // Separate pinned notes
  const pinned = notes.filter((n) => n.isPinned && !filters.isTrashed);
  const unpinned = notes.filter((n) => !n.isPinned || filters.isTrashed);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className={view === 'list' ? '' : 'p-4'}>
        {/* Pinned section */}
        {pinned.length > 0 && view === 'grid' && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-[var(--ink-muted)] uppercase tracking-wider mb-2 px-1">
              Pinned
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {pinned.map((note) => <NoteCard key={note._id} note={note} view={view} />)}
            </div>
          </div>
        )}

        {/* Other notes */}
        {pinned.length > 0 && unpinned.length > 0 && view === 'grid' && (
          <p className="text-xs font-semibold text-[var(--ink-muted)] uppercase tracking-wider mb-2 px-1">
            Other Notes
          </p>
        )}

        {view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {unpinned.map((note) => <NoteCard key={note._id} note={note} view={view} />)}
          </div>
        ) : (
          <div>
            {pinned.length > 0 && (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-[var(--ink-muted)] uppercase tracking-wider bg-[var(--surface-raised)] border-b border-[var(--edge)]">
                  Pinned
                </div>
                {pinned.map((note) => <NoteCard key={note._id} note={note} view={view} />)}
              </>
            )}
            {unpinned.length > 0 && pinned.length > 0 && (
              <div className="px-4 py-2 text-xs font-semibold text-[var(--ink-muted)] uppercase tracking-wider bg-[var(--surface-raised)] border-b border-[var(--edge)]">
                Other Notes
              </div>
            )}
            {unpinned.map((note) => <NoteCard key={note._id} note={note} view={view} />)}
          </div>
        )}

        {/* Load more */}
        {pagination.page < pagination.pages && (
          <div className={`flex justify-center py-6 ${view === 'list' ? '' : ''}`}>
            <button
              className="btn-secondary"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}

        {/* Bottom padding */}
        <div className="h-4" />
      </div>
    </div>
  );
}