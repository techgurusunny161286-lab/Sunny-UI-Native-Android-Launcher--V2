import React from 'react';
import { AppDefinition, SolarState, NoteItem, ThemePreset } from '../../types/launcher';
import { WeatherApp } from './WeatherApp';
import { CameraApp } from './CameraApp';
import { MessagesApp } from './MessagesApp';
import { MusicApp } from './MusicApp';
import { CalculatorApp } from './CalculatorApp';
import { NotesApp } from './NotesApp';
import { SettingsApp } from './SettingsApp';
import { SolWellnessApp } from './SolWellnessApp';
import { ArcadeApp } from './ArcadeApp';
import { ThemeStudioApp } from './ThemeStudioApp';
import { GestureBar } from '../launcher/GestureBar';
import { X, ArrowLeft, Sparkles } from 'lucide-react';
import { solarSound } from '../../utils/solarSound';

interface AppWindowProps {
  app: AppDefinition;
  solarState: SolarState;
  notes: NoteItem[];
  currentWallpaper?: string;
  onClose: () => void;
  onUpdateSunPosition: (pos: number) => void;
  onUpdateState: (updates: Partial<SolarState>) => void;
  onAddNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
  onTriggerVisualCustomizer?: (tab?: 'icons' | 'wallpapers' | 'system' | 'lockscreen' | 'aod' | 'boot' | 'fonts' | 'theme') => void;
  onApplyThemePreset?: (preset: ThemePreset) => void;
  onRestoreDefaults?: () => void;
  onLockPhone?: () => void;
  onEnterAOD?: () => void;
  onRebootPhone?: () => void;
}

export const AppWindow: React.FC<AppWindowProps> = ({
  app,
  solarState,
  notes,
  currentWallpaper = 'golden',
  onClose,
  onUpdateSunPosition,
  onUpdateState,
  onAddNote,
  onDeleteNote,
  onTriggerVisualCustomizer,
  onApplyThemePreset,
  onRestoreDefaults,
  onLockPhone,
  onEnterAOD,
  onRebootPhone,
}) => {
  const handleClose = () => {
    solarSound.playTap(solarState.soundEnabled);
    onClose();
  };

  const renderAppContent = () => {
    switch (app.id) {
      case 'suntrack':
        return (
          <WeatherApp
            solarState={solarState}
            onUpdateSunPosition={onUpdateSunPosition}
          />
        );

      case 'solarcam':
        return <CameraApp soundEnabled={solarState.soundEnabled} />;

      case 'solarbeam':
        return <MessagesApp soundEnabled={solarState.soundEnabled} />;

      case 'solarpulse':
        return <MusicApp soundEnabled={solarState.soundEnabled} />;

      case 'solarcalc':
        return (
          <CalculatorApp
            soundEnabled={solarState.soundEnabled}
            soundPack={solarState.activeSoundPack}
          />
        );

      case 'solarnotes':
        return (
          <NotesApp
            notes={notes}
            onAddNote={onAddNote}
            onDeleteNote={onDeleteNote}
            soundEnabled={solarState.soundEnabled}
            soundPack={solarState.activeSoundPack}
          />
        );

      case 'solarcore':
        return (
          <SettingsApp
            solarState={solarState}
            onUpdateState={onUpdateState}
            onTriggerVisualCustomizer={onTriggerVisualCustomizer}
            onLockPhone={onLockPhone}
            onEnterAOD={onEnterAOD}
            onRebootPhone={onRebootPhone}
          />
        );

      case 'solwellness':
        return <SolWellnessApp soundEnabled={solarState.soundEnabled} />;

      case 'solararcade':
        return <ArcadeApp soundEnabled={solarState.soundEnabled} />;

      case 'solarstudio':
        return (
          <ThemeStudioApp
            solarState={solarState}
            currentWallpaper={currentWallpaper}
            onApplyThemePreset={onApplyThemePreset || (() => {})}
            onRestoreDefaults={onRestoreDefaults || (() => {})}
            onUpdateSolarState={onUpdateState}
          />
        );

      default:
        // Default generic solar app screen for remaining apps (Files, Maps, Browser, etc.)
        return (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-white text-3xl shadow-xl border-2 border-white/80"
              style={{ background: app.iconBgGradient }}
            >
              ☀️
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900">
                {app.name}
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-[260px]">
                {app.description}
              </p>
            </div>
            <div className="p-4 rounded-2xl glass-panel max-w-[280px] w-full text-left space-y-2">
              <div className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">
                App Properties
              </div>
              <div className="flex justify-between text-xs text-slate-700">
                <span>Category</span>
                <span className="font-semibold">{app.category}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-700">
                <span>Refraction Level</span>
                <span className="font-semibold">98.4%</span>
              </div>
              <div className="flex justify-between text-xs text-slate-700">
                <span>Solar Mode</span>
                <span className="font-semibold text-emerald-600">Active</span>
              </div>
            </div>
          </div>
        );
    }
  };

  const isDarkModeApp = app.id === 'solarcam' || app.id === 'solararcade';

  return (
    <div
      className={`absolute inset-0 z-40 flex flex-col justify-between animate-in zoom-in-95 duration-200 ${
        isDarkModeApp ? 'bg-black text-white' : 'bg-white/80 backdrop-blur-2xl text-slate-900'
      }`}
    >
      {/* Top App Header Bar */}
      <header
        className={`px-4 pt-3 pb-2 flex items-center justify-between border-b ${
          isDarkModeApp
            ? 'border-white/10 bg-black/60'
            : 'border-amber-200/50 bg-white/40'
        } backdrop-blur-md select-none`}
      >
        <button
          onClick={handleClose}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold active:scale-95 transition-all ${
            isDarkModeApp ? 'hover:bg-white/15 text-white' : 'hover:bg-black/5 text-slate-800'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <div className="flex items-center gap-1.5">
          <span className="font-display font-bold text-sm tracking-tight">
            {app.name}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 text-[10px] font-semibold">
            {app.category}
          </span>
        </div>

        <button
          onClick={handleClose}
          className={`w-8 h-8 rounded-full flex items-center justify-center active:scale-95 transition-all ${
            isDarkModeApp ? 'hover:bg-white/15 text-white' : 'hover:bg-black/5 text-slate-800'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Main App Content Viewport */}
      {renderAppContent()}

      {/* Bottom Gesture Bar */}
      <GestureBar
        onGoHome={handleClose}
        soundEnabled={solarState.soundEnabled}
        isInsideApp={true}
      />
    </div>
  );
};
