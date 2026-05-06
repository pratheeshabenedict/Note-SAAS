import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CharacterCount from '@tiptap/extension-character-count';
import Typography from '@tiptap/extension-typography';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, CheckSquare, Quote, Code, Code2,
  Heading1, Heading2, Heading3, Link as LinkIcon, Minus,
  Highlighter, Undo, Redo, X, Pin, Star, Archive, ArrowLeft,
  BookOpen, MoreHorizontal, Check, Clock, Hash
} from 'lucide-react';
import useNotesStore from '../../store/notesStore';

// Debounce hook
function useDebounce(fn, delay) {
  const timeout = useRef(null);
  return useCallback((...args) => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => fn(...args), delay);
  }, [fn, delay]);
}

const ToolbarButton = ({ onClick, active, disabled, title, children }) => (
  <button
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    disabled={disabled}
    title={title}
    className={`
      p-1.5 rounded-md text-sm transition-all
      ${active
        ? 'bg-[var(--brand-subtle)] text-[var(--brand-text)]'
        : 'text-[var(--ink-muted)] hover:bg-[var(--surface-sunken)] hover:text-[var(--ink)]'
      }
      disabled:opacity-40 disabled:cursor-not-allowed
    `}
  >
    {children}
  </button>
);

const ToolbarDivider = () => <div className="w-px h-5 bg-[var(--edge)] mx-0.5" />;

export default function NoteEditor() {
  const { activeNote, updateNote, setActiveNote, setEditorOpen, saving } = useNotesStore();
  const [title, setTitle] = useState('');
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'unsaved'
  const titleRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder: 'Start writing your thoughts...' }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: false }),
      Link.configure({ openOnClick: false, linkOnPaste: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CharacterCount,
      Typography,
    ],
    content: activeNote?.content || '',
    editorProps: {
      attributes: { class: 'min-h-[calc(100vh-280px)] focus:outline-none' },
    },
    onUpdate: ({ editor }) => {
      setSaveStatus('unsaved');
      debouncedSave(editor.getHTML());
    },
  });

  const debouncedSave = useDebounce(async (content) => {
    if (!activeNote) return;
    setSaveStatus('saving');
    await updateNote(activeNote._id, { content });
    setSaveStatus('saved');
  }, 1200);

  useEffect(() => {
    if (activeNote) {
      setTitle(activeNote.title || '');
      if (editor && activeNote.content !== editor.getHTML()) {
        editor.commands.setContent(activeNote.content || '', false);
      }
    }
  }, [activeNote?._id]);

  const saveTitle = useDebounce(async (newTitle) => {
    if (!activeNote) return;
    await updateNote(activeNote._id, { title: newTitle });
  }, 800);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setSaveStatus('unsaved');
    saveTitle(e.target.value);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editor?.commands.focus();
    }
  };

  const close = () => {
    setActiveNote(null);
    setEditorOpen(false);
  };

  if (!activeNote || !editor) return null;

  const words = editor.storage.characterCount?.words() || 0;
  const chars = editor.storage.characterCount?.characters() || 0;

  return (
    <div className="flex flex-col h-full bg-[var(--surface)] border-l border-[var(--edge)] animate-slide-in-right">
      {/* Editor Header */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-[var(--edge)] flex-shrink-0">
        {/* Back arrow on mobile, X on desktop */}
        <button onClick={close} className="btn-icon btn-ghost md:hidden" title="Back">
          <ArrowLeft size={16} />
        </button>
        <button onClick={close} className="btn-icon btn-ghost hidden md:flex" title="Close">
          <X size={16} />
        </button>

        {/* Save status */}
        <div className="flex items-center gap-1.5 ml-1">
          {saveStatus === 'saving' && (
            <div className="flex items-center gap-1.5 text-xs text-[var(--ink-muted)] animate-fade-in">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Saving...
            </div>
          )}
          {saveStatus === 'saved' && (
            <div className="flex items-center gap-1.5 text-xs text-[var(--ink-muted)] animate-fade-in">
              <Check size={12} className="text-emerald-500" />
              Saved
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <button
          className={`btn-icon btn-ghost ${activeNote.isPinned ? 'text-[var(--brand)]' : ''}`}
          onClick={() => updateNote(activeNote._id, { isPinned: !activeNote.isPinned })}
          title={activeNote.isPinned ? 'Unpin' : 'Pin'}
        >
          <Pin size={16} className={activeNote.isPinned ? 'fill-current' : ''} />
        </button>
        <button
          className={`btn-icon btn-ghost ${activeNote.isFavorite ? 'text-amber-400' : ''}`}
          onClick={() => updateNote(activeNote._id, { isFavorite: !activeNote.isFavorite })}
          title={activeNote.isFavorite ? 'Unfavorite' : 'Favorite'}
        >
          <Star size={16} className={activeNote.isFavorite ? 'fill-amber-400' : ''} />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center flex-wrap gap-0.5 px-3 py-2 border-b border-[var(--edge)] bg-[var(--surface-raised)] flex-shrink-0">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <UnderlineIcon size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight">
          <Highlighter size={14} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="H1">
          <Heading1 size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="H2">
          <Heading2 size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="H3">
          <Heading3 size={14} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Left">
          <AlignLeft size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Center">
          <AlignCenter size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Right">
          <AlignRight size={14} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          <List size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list">
          <ListOrdered size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')} title="Checklist">
          <CheckSquare size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote">
          <Quote size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">
          <Code size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block">
          <Code2 size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
          <Minus size={14} />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
          <Undo size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
          <Redo size={14} />
        </ToolbarButton>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Title */}
        <div className="px-8 pt-8">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleTitleKeyDown}
            placeholder="Untitled Note"
            className="w-full text-3xl font-bold text-[var(--ink)] bg-transparent border-none outline-none placeholder:text-[var(--ink-placeholder)] mb-2"
          />

          {/* Note meta */}
          <div className="flex items-center gap-3 text-xs text-[var(--ink-muted)] mb-6 flex-wrap">
            {activeNote.notebook && (
              <span className="flex items-center gap-1">
                <BookOpen size={11} />
                {activeNote.notebook.name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {new Date(activeNote.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            {activeNote.tags?.length > 0 && (
              <div className="flex items-center gap-1">
                <Hash size={11} />
                {activeNote.tags.slice(0, 3).join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Editor */}
        <EditorContent editor={editor} className="px-8 pb-8" />
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-between px-8 py-2.5 border-t border-[var(--edge)] bg-[var(--surface-raised)] text-xs text-[var(--ink-muted)] flex-shrink-0">
        <span>{words} words · {chars} characters</span>
        {activeNote.readingTime > 0 && (
          <span>{Math.ceil(activeNote.readingTime / 60)} min read</span>
        )}
      </div>
    </div>
  );
}