import React, { useState } from 'react';
import { NoteItem, SoundPackId } from '../../types/launcher';
import { Plus, Trash2, Search, StickyNote } from 'lucide-react';
import { solarSound } from '../../utils/solarSound';

interface NotesAppProps {
  notes: NoteItem[];
  onAddNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
  soundEnabled: boolean;
  soundPack?: SoundPackId;
}

export const NotesApp: React.FC<NotesAppProps> = ({
  notes,
  onAddNote,
  onDeleteNote,
  soundEnabled,
  soundPack = 'solar-harmonix',
}) => {
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FEF08A');

  const colors = ['#FEF08A', '#FED7AA', '#BAE6FD', '#BBF7D0', '#FBCFE8'];

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    solarSound.playTap(soundEnabled);
    const newNote: NoteItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      content: newContent.trim() || 'No additional content',
      date: 'Just now',
      color: selectedColor,
    };

    onAddNote(newNote);
    setNewTitle('');
    setNewContent('');
    setIsCreating(false);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col justify-between space-y-3">
      {/* Top Search & Add Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search solar notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white/70 border border-white/80 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <button
          onClick={() => {
            solarSound.playTap(soundEnabled);
            setIsCreating(!isCreating);
          }}
          className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Creation Modal / Inline Drawer */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="glass-panel bg-white/80 rounded-3xl p-4 border border-white shadow-lg space-y-2.5 animate-in fade-in zoom-in-95 duration-200"
        >
          <input
            type="text"
            placeholder="Note title..."
            value={newTitle}
            onChange={(e) => {
              solarSound.playTypingSound(soundEnabled, soundPack, e.target.value.slice(-1));
              setNewTitle(e.target.value);
            }}
            className="w-full px-3 py-1.5 bg-white rounded-xl text-xs font-semibold text-slate-900 border border-amber-200/50 focus:outline-none"
            autoFocus
          />
          <textarea
            placeholder="Write thoughts under the sunlight..."
            value={newContent}
            onChange={(e) => {
              solarSound.playTypingSound(soundEnabled, soundPack, e.target.value.slice(-1));
              setNewContent(e.target.value);
            }}
            rows={3}
            className="w-full px-3 py-2 bg-white rounded-xl text-xs text-slate-800 border border-amber-200/50 focus:outline-none resize-none"
          />

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              {colors.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`w-5 h-5 rounded-full border ${
                    selectedColor === c ? 'ring-2 ring-amber-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <button
              type="submit"
              className="px-3 py-1 bg-amber-600 text-white text-xs font-semibold rounded-xl shadow-sm"
            >
              Save Note
            </button>
          </div>
        </form>
      )}

      {/* Notes Masonry / List */}
      <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
        {filtered.map((note) => (
          <div
            key={note.id}
            className="p-4 rounded-3xl shadow-sm border border-black/5 flex flex-col justify-between transition-all hover:shadow-md relative group"
            style={{ backgroundColor: note.color }}
          >
            <div className="flex items-start justify-between">
              <h4 className="font-display font-bold text-xs text-slate-900 leading-snug">
                {note.title}
              </h4>
              <button
                onClick={() => {
                  solarSound.playTap(soundEnabled);
                  onDeleteNote(note.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-600 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-700 mt-1.5 line-clamp-3 leading-relaxed">
              {note.content}
            </p>

            <span className="text-[9px] font-mono text-slate-500 mt-2 font-medium">
              {note.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
