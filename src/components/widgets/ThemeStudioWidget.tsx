import React, { useState } from 'react';
import { SolarState, SoundPackId } from '../../types/launcher';
import { solarSound, SOUND_PACKS } from '../../utils/solarSound';
import {
  Palette,
  ShoppingBag,
  Sparkles,
  Music,
  Volume2,
  Wand2,
  ChevronRight,
  Flame,
} from 'lucide-react';

interface ThemeStudioWidgetProps {
  solarState: SolarState;
  currentWallpaper: string;
  onOpenStore: () => void;
  onOpenDIY: () => void;
  onOpenAI: () => void;
  onOpenSounds: () => void;
  onUpdateSoundPack?: (packId: SoundPackId) => void;
}

export const ThemeStudioWidget: React.FC<ThemeStudioWidgetProps> = ({
  solarState,
  currentWallpaper,
  onOpenStore,
  onOpenDIY,
  onOpenAI,
  onOpenSounds,
  onUpdateSoundPack,
}) => {
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const activePackDef =
    SOUND_PACKS.find((p) => p.id === solarState.activeSoundPack) || SOUND_PACKS[0];

  const handleTestSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingPreview(true);
    solarSound.playNotification(true, solarState.activeSoundPack);
    setTimeout(() => {
      setIsPlayingPreview(false);
    }, 1200);
  };

  const handleCycleSoundPack = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = SOUND_PACKS.findIndex((p) => p.id === solarState.activeSoundPack);
    const nextIndex = (currentIndex + 1) % SOUND_PACKS.length;
    const nextPack = SOUND_PACKS[nextIndex];
    if (onUpdateSoundPack) {
      onUpdateSoundPack(nextPack.id);
    }
    solarSound.playTap(true, nextPack.id);
    solarSound.playNotification(true, nextPack.id);
  };

  return (
    <div className="group relative glass-widget rounded-[28px] p-3.5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl overflow-hidden border border-white/70 dark:border-white/10 shadow-lg">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-white/40 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-purple-600 flex items-center justify-center text-white shadow-sm font-bold text-xs shrink-0">
            ✨
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4
                className="font-bold text-xs text-slate-900 dark:text-white tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Theme Studio & Creator
              </h4>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-semibold uppercase tracking-wider">
                Smart
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Community Store · DIY Maker · AI Stylist · Sound Packs
            </p>
          </div>
        </div>

        {/* Current Active Sound Pack Pill with quick play */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleCycleSoundPack}
            className="flex items-center gap-1 px-2 py-0.8 rounded-full bg-white/60 dark:bg-zinc-800/80 hover:bg-white active:scale-95 text-[10px] font-semibold text-slate-700 dark:text-slate-200 border border-white/70 dark:border-white/10 shadow-2xs transition-all"
            title="Click to cycle sound packs"
          >
            <span>{activePackDef.icon}</span>
            <span className="max-w-[70px] truncate">{activePackDef.name.split(' ')[0]}</span>
          </button>

          <button
            onClick={handleTestSound}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
              isPlayingPreview
                ? 'bg-amber-500 text-white animate-pulse'
                : 'bg-white/60 dark:bg-zinc-800/80 text-slate-600 dark:text-slate-300 hover:bg-white'
            } border border-white/70 dark:border-white/10 shadow-2xs`}
            title="Test notification tone"
          >
            <Volume2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Four 1-Touch Smart Feature Action Tiles */}
      <div className="grid grid-cols-4 gap-2 pt-2.5">
        {/* 1. Community Store */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
            onOpenStore();
          }}
          className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-b from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 active:scale-95 border border-purple-500/20 transition-all group/btn"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-xs group-hover/btn:scale-110 transition-transform">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-1.5 leading-none">
            Store
          </span>
          <span className="text-[8px] text-purple-600 dark:text-purple-400 font-medium">
            5 Categories
          </span>
        </button>

        {/* 2. DIY Theme Creator */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
            onOpenDIY();
          }}
          className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-b from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 active:scale-95 border border-amber-500/20 transition-all group/btn"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-xs group-hover/btn:scale-110 transition-transform">
            <Palette className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-1.5 leading-none">
            DIY Maker
          </span>
          <span className="text-[8px] text-amber-600 dark:text-amber-400 font-medium">
            Mix & Match
          </span>
        </button>

        {/* 3. AI Theme Generator */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
            onOpenAI();
          }}
          className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-b from-rose-500/10 to-pink-500/10 hover:from-rose-500/20 hover:to-pink-500/20 active:scale-95 border border-rose-500/20 transition-all group/btn"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-xs group-hover/btn:scale-110 transition-transform">
            <Wand2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-1.5 leading-none">
            AI Stylist
          </span>
          <span className="text-[8px] text-rose-600 dark:text-rose-400 font-medium">
            Mood & Auto
          </span>
        </button>

        {/* 4. Sound Packs */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
            onOpenSounds();
          }}
          className="flex flex-col items-center justify-center p-2 rounded-2xl bg-gradient-to-b from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 active:scale-95 border border-emerald-500/20 transition-all group/btn"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-xs group-hover/btn:scale-110 transition-transform">
            <Music className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-1.5 leading-none">
            Sounds
          </span>
          <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-medium">
            6 Synthesizers
          </span>
        </button>
      </div>

      {/* Bottom Category Banner Quick Taps */}
      <div className="mt-2.5 pt-2 border-t border-white/40 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-amber-600 dark:text-amber-400">Categories:</span>
          {['Minimal', 'Anime', 'Tech', 'Nature', 'Cyberpunk'].map((cat) => (
            <button
              key={cat}
              onClick={(e) => {
                e.stopPropagation();
                solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
                onOpenStore();
              }}
              className="px-1.5 py-0.5 rounded-md bg-white/40 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 text-[9px] font-medium transition-all"
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
            onOpenStore();
          }}
          className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 active:scale-95"
        >
          <span>Explore</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
