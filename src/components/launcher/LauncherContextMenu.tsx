import React from 'react';
import {
  Palette,
  ShoppingBag,
  Sparkles,
  Music,
  ImageIcon,
  Sliders,
  X,
  RotateCcw,
} from 'lucide-react';
import { solarSound } from '../../utils/solarSound';
import { SolarState } from '../../types/launcher';

interface LauncherContextMenuProps {
  solarState: SolarState;
  onClose: () => void;
  onOpenStore: () => void;
  onOpenDIY: () => void;
  onOpenAI: () => void;
  onOpenSounds: () => void;
  onOpenWallpapers: () => void;
  onOpenIconResizer: () => void;
  onRestoreDefaults: () => void;
}

export const LauncherContextMenu: React.FC<LauncherContextMenuProps> = ({
  solarState,
  onClose,
  onOpenStore,
  onOpenDIY,
  onOpenAI,
  onOpenSounds,
  onOpenWallpapers,
  onOpenIconResizer,
  onRestoreDefaults,
}) => {
  return (
    <div
      onClick={onClose}
      className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex flex-col justify-end p-4 animate-in fade-in duration-200 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl rounded-[32px] p-5 border border-white/80 dark:border-white/10 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-6 duration-300"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-xs font-bold text-xs">
              ☀️
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white" style={{ fontFamily: 'var(--font-display)' }}>
                Home Screen & Theme Studio
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Desktop customization & smart theme controls
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Core Advanced & Smart Features */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* 1. DIY Theme Creator */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
              onClose();
              onOpenDIY();
            }}
            className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent hover:from-amber-500/25 active:scale-95 border border-amber-500/30 flex items-center gap-3 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">DIY Theme Creator</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Mix wallpaper, icons & fonts</p>
            </div>
          </button>

          {/* 2. AI Theme Generator */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
              onClose();
              onOpenAI();
            }}
            className="p-3 rounded-2xl bg-gradient-to-br from-rose-500/15 via-pink-500/10 to-transparent hover:from-rose-500/25 active:scale-95 border border-rose-500/30 flex items-center gap-3 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">AI Theme Generator</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Mood & wallpaper matching</p>
            </div>
          </button>

          {/* 3. Categorized Community Store */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
              onClose();
              onOpenStore();
            }}
            className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/15 via-indigo-500/10 to-transparent hover:from-purple-500/25 active:scale-95 border border-purple-500/30 flex items-center gap-3 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Community Store</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Minimal, Anime, Cyberpunk</p>
            </div>
          </button>

          {/* 4. Sound Packs */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
              onClose();
              onOpenSounds();
            }}
            className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent hover:from-emerald-500/25 active:scale-95 border border-emerald-500/30 flex items-center gap-3 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Sound Packs</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Ringtones & key typing sounds</p>
            </div>
          </button>
        </div>

        {/* Secondary Quick Controls */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
                onClose();
                onOpenWallpapers();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
              <span>Wallpapers</span>
            </button>

            <button
              onClick={() => {
                solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
                onClose();
                onOpenIconResizer();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-500" />
              <span>Icon Resizer</span>
            </button>
          </div>

          <button
            onClick={() => {
              solarSound.playLaunch(solarState.soundEnabled);
              onClose();
              onRestoreDefaults();
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1.5 transition-colors"
            title="Reset to Factory SolOS Look"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
