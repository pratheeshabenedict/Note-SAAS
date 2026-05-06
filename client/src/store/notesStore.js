import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../services/api';
import toast from 'react-hot-toast';

const useNotesStore = create(
  devtools(
    (set, get) => ({
      notes: [],
      activeNote: null,
      notebooks: [],
      stats: null,
      loading: false,
      saving: false,
      searchQuery: '',
      filters: {
        notebook: null,
        tags: [],
        color: null,
        isPinned: null,
        isFavorite: null,
        isArchived: false,
        isTrashed: false,
      },
      view: 'grid', // 'grid' | 'list'
      pagination: { total: 0, page: 1, limit: 20, pages: 1 },
      selectedNotes: [],
      sidebarOpen: true,
      editorOpen: false,

      // ── Notes CRUD ──────────────────────────────────────────

      fetchNotes: async (params = {}) => {
        set({ loading: true });
        try {
          const { filters, searchQuery, pagination } = get();
          const query = {
            page: pagination.page,
            limit: pagination.limit,
            ...filters,
            ...(searchQuery && { search: searchQuery }),
            ...params,
          };

          // Clean null/undefined
          Object.keys(query).forEach((k) => {
            if (query[k] === null || query[k] === undefined || query[k] === '') delete query[k];
          });

          const { data } = await api.get('/notes', { params: query });
          set({ notes: data.data, pagination: data.pagination });
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to load notes');
        } finally {
          set({ loading: false });
        }
      },

      fetchNote: async (id) => {
        try {
          const { data } = await api.get(`/notes/${id}`);
          set({ activeNote: data.data, editorOpen: true });
          return data.data;
        } catch (err) {
          toast.error('Failed to load note');
        }
      },

      createNote: async (noteData = {}) => {
        set({ saving: true });
        try {
          const { filters } = get();
          const payload = {
            title: 'Untitled Note',
            content: '',
            notebook: filters.notebook || null,
            ...noteData,
          };
          const { data } = await api.post('/notes', payload);
          set((s) => ({
            notes: [data.data, ...s.notes],
            activeNote: data.data,
            editorOpen: true,
          }));
          return data.data;
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to create note');
        } finally {
          set({ saving: false });
        }
      },

      updateNote: async (id, updates) => {
        set({ saving: true });
        try {
          const { data } = await api.patch(`/notes/${id}`, updates);
          set((s) => ({
            notes: s.notes.map((n) => (n._id === id ? data.data : n)),
            activeNote: s.activeNote?._id === id ? data.data : s.activeNote,
          }));
          return data.data;
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to save note');
        } finally {
          set({ saving: false });
        }
      },

      deleteNote: async (id) => {
        try {
          await api.delete(`/notes/${id}`);
          set((s) => ({
            notes: s.notes.filter((n) => n._id !== id),
            activeNote: s.activeNote?._id === id ? null : s.activeNote,
            editorOpen: s.activeNote?._id === id ? false : s.editorOpen,
          }));
          toast.success('Note moved to trash');
          get().fetchStats();
        } catch (err) {
          toast.error('Failed to delete note');
        }
      },

      restoreNote: async (id) => {
        try {
          const { data } = await api.patch(`/notes/${id}/restore`);
          set((s) => ({ notes: s.notes.filter((n) => n._id !== id) }));
          toast.success('Note restored');
          get().fetchStats();
        } catch (err) {
          toast.error('Failed to restore note');
        }
      },

      emptyTrash: async () => {
        try {
          await api.delete('/notes/trash');
          set({ notes: [] });
          toast.success('Trash emptied');
          get().fetchStats();
        } catch (err) {
          toast.error('Failed to empty trash');
        }
      },

      bulkUpdate: async (ids, updates) => {
        try {
          await api.patch('/notes/bulk', { ids, updates });
          await get().fetchNotes();
          toast.success(`${ids.length} notes updated`);
        } catch (err) {
          toast.error('Bulk update failed');
        }
      },

      fetchStats: async () => {
        try {
          const { data } = await api.get('/notes/stats');
          set({ stats: data.data });
        } catch {}
      },

      // ── Notebooks ─────────────────────────────────────────

      fetchNotebooks: async () => {
        try {
          const { data } = await api.get('/notebooks');
          set({ notebooks: data.data });
        } catch {}
      },

      createNotebook: async (notebookData) => {
        try {
          const { data } = await api.post('/notebooks', notebookData);
          set((s) => ({ notebooks: [...s.notebooks, data.data] }));
          toast.success('Notebook created');
          return data.data;
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to create notebook');
        }
      },

      updateNotebook: async (id, updates) => {
        try {
          const { data } = await api.patch(`/notebooks/${id}`, updates);
          set((s) => ({
            notebooks: s.notebooks.map((nb) => (nb._id === id ? data.data : nb)),
          }));
        } catch (err) {
          toast.error('Failed to update notebook');
        }
      },

      deleteNotebook: async (id) => {
        try {
          await api.delete(`/notebooks/${id}`);
          set((s) => ({ notebooks: s.notebooks.filter((nb) => nb._id !== id) }));
          toast.success('Notebook deleted');
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to delete notebook');
        }
      },

      // ── UI State ──────────────────────────────────────────

      setActiveNote: (note) => set({ activeNote: note, editorOpen: !!note }),
      setEditorOpen: (open) => set({ editorOpen: open }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setView: (view) => set({ view }),
      setSearchQuery: (q) => set({ searchQuery: q }),

      setFilters: (filters) =>
        set((s) => ({ filters: { ...s.filters, ...filters }, pagination: { ...s.pagination, page: 1 } })),

      resetFilters: () =>
        set({
          filters: { notebook: null, tags: [], color: null, isPinned: null, isFavorite: null, isArchived: false, isTrashed: false },
          searchQuery: '',
        }),

      toggleNoteSelection: (id) =>
        set((s) => ({
          selectedNotes: s.selectedNotes.includes(id)
            ? s.selectedNotes.filter((nid) => nid !== id)
            : [...s.selectedNotes, id],
        })),

      clearSelection: () => set({ selectedNotes: [] }),
      selectAll: () => set((s) => ({ selectedNotes: s.notes.map((n) => n._id) })),
    }),
    { name: 'NotesStore' }
  )
);

export default useNotesStore;