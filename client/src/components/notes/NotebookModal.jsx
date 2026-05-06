import React, { useState } from 'react';
import { X } from 'lucide-react';
import useNotesStore from '../../store/notesStore';

const COLORS = ['default', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'purple', 'pink'];
const COLOR_STYLES = {
  default: 'bg-[var(--surface-sunken)] border-[var(--edge)]',
  red: 'bg-red-200 border-red-300', orange: 'bg-orange-200 border-orange-300',
  yellow: 'bg-yellow-200 border-yellow-300', green: 'bg-green-200 border-green-300',
  teal: 'bg-teal-200 border-teal-300', blue: 'bg-blue-200 border-blue-300',
  purple: 'bg-purple-200 border-purple-300', pink: 'bg-pink-200 border-pink-300',
};
const ICONS = ['📓', '📔', '📒', '📕', '📗', '📘', '📙', '🗒️', '📋', '🗂️', '💡', '✏️', '🎯', '🚀', '💼', '🎨'];

export default function NotebookModal({ notebook, onClose }) {
  const { createNotebook, updateNotebook } = useNotesStore();
  const [form, setForm] = useState({
    name: notebook?.name || '',
    description: notebook?.description || '',
    color: notebook?.color || 'default',
    icon: notebook?.icon || '📓',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    if (notebook) {
      await updateNotebook(notebook._id, form);
    } else {
      await createNotebook(form);
    }
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[var(--surface-overlay)] rounded-2xl border border-[var(--edge)] shadow-modal w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-[var(--edge)]">
          <h2 className="font-semibold text-[var(--ink)]">
            {notebook ? 'Edit Notebook' : 'New Notebook'}
          </h2>
          <button className="btn-icon btn-ghost" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Icon picker */}
          <div>
            <label className="text-xs font-medium text-[var(--ink-secondary)] mb-2 block">Icon</label>
            <div className="flex flex-wrap gap-1.5">
              {ICONS.map((icon) => (
                <button
                  type="button"
                  key={icon}
                  onClick={() => setForm((f) => ({ ...f, icon }))}
                  className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all border-2 ${
                    form.icon === icon
                      ? 'border-[var(--brand)] bg-[var(--brand-subtle)]'
                      : 'border-transparent hover:border-[var(--edge-strong)] bg-[var(--surface-raised)]'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-medium text-[var(--ink-secondary)] mb-1.5 block">Name *</label>
            <input
              type="text"
              className="input"
              placeholder="My Notebook"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-[var(--ink-secondary)] mb-1.5 block">Description</label>
            <textarea
              className="input resize-none h-20"
              placeholder="What's this notebook for?"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>

          {/* Color */}
          <div>
            <label className="text-xs font-medium text-[var(--ink-secondary)] mb-2 block">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setForm((f) => ({ ...f, color }))}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${COLOR_STYLES[color]} ${
                    form.color === color ? 'ring-2 ring-[var(--brand)] ring-offset-2 ring-offset-[var(--surface-overlay)]' : ''
                  }`}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button type="button" className="btn-secondary flex-1" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={loading || !form.name.trim()}>
              {loading ? 'Saving...' : notebook ? 'Save Changes' : 'Create Notebook'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}