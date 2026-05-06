import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import useNotesStore from '../store/notesStore';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import NotesList from '../components/notes/NotesList';
import NoteEditor from '../components/editor/NoteEditor';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const { resolvedTheme } = useTheme();
  const {
    editorOpen,
    sidebarOpen,
    setSidebarOpen,
    fetchNotes,
    fetchNotebooks,
    fetchStats,
  } = useNotesStore();

  useEffect(() => {
    fetchNotes();
    fetchNotebooks();
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--surface)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--brand)] flex items-center justify-center animate-pulse">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <p className="text-sm text-[var(--ink-muted)] animate-pulse">Loading your notes…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={resolvedTheme === 'dark' ? 'dark' : ''}>
      <div className="h-screen flex overflow-hidden bg-[var(--surface)] text-[var(--ink)]">
        {/* Mobile sidebar overlay backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Topbar */}
          <Topbar onMenuClick={() => setSidebarOpen((p) => !p)} />

          {/* Body: notes list + optional editor panel */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Notes list — hidden on mobile when editor is open */}
            <div
              className={`
      flex flex-col overflow-hidden transition-all duration-300
      ${editorOpen
                  ? 'hidden md:flex md:w-[380px] md:flex-shrink-0 border-r border-[var(--edge)]'
                  : 'flex-1'}
    `}
            >
              <NotesList />
            </div>

            {/* Editor panel — full screen on mobile */}
            {editorOpen && (
              <div className="flex-1 overflow-hidden animate-slide-in-right absolute inset-0 md:static">
                <NoteEditor />
              </div>
            )}
          </div>
        </div>

        {/* Toast notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--surface-overlay)',
              color: 'var(--ink)',
              border: '1px solid var(--edge)',
              borderRadius: '12px',
              fontSize: '13px',
              fontFamily: 'Inter, system-ui, sans-serif',
            },
            success: {
              iconTheme: { primary: 'var(--brand)', secondary: 'white' },
            },
            error: {
              iconTheme: { primary: 'var(--danger)', secondary: 'white' },
            },
          }}
        />
      </div>
    </div>
  );
}