import React, { useState } from 'react';
import { CheckSquare, Square, Plus, StickyNote } from 'lucide-react';
import { NoteItem } from '../../types/launcher';
import { solarSound } from '../../utils/solarSound';

interface SolarNotesWidgetProps {
  notes: NoteItem[];
  soundEnabled: boolean;
  onOpenNotesApp: () => void;
}

export const SolarNotesWidget: React.FC<SolarNotesWidgetProps> = ({
  notes,
  soundEnabled,
  onOpenNotesApp,
}) => {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({
    'item-0': true,
  });

  const checklist = [
    { id: 'item-0', text: 'Catch Golden Hour at 6:40 PM' },
    { id: 'item-1', text: '15 min direct daylight walk' },
    { id: 'item-2', text: 'Calibrate solar camera lens' },
  ];

  const toggleCheck = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    solarSound.playTap(soundEnabled);
    setCheckedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      onClick={onOpenNotesApp}
      className="group relative glass-widget rounded-[1.6rem] p-4 cursor-pointer transition-all duration-300 hover:shadow-xl overflow-hidden"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-400/30 text-amber-700 flex items-center justify-center">
            <StickyNote className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-xs text-slate-800">
            Daylight Priorities
          </span>
        </div>
        <span className="text-[10px] text-amber-800/80 font-medium">3 items</span>
      </div>

      <div className="space-y-1.5">
        {checklist.map((item) => {
          const isDone = !!checkedIds[item.id];
          return (
            <div
              key={item.id}
              onClick={(e) => toggleCheck(item.id, e)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/40 transition-colors"
            >
              {isDone ? (
                <CheckSquare className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              ) : (
                <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              <span
                className={`text-xs truncate transition-all ${
                  isDone
                    ? 'line-through text-slate-400'
                    : 'text-slate-700 font-medium'
                }`}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
