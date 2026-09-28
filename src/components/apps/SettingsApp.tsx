import React from 'react';
import { SolarState, GlassTheme, ThemeMode } from '../../types/launcher';
import {
  Sliders,
  Sun,
  Moon,
  Volume2,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Palette,
  Image as ImageIcon,
  Type,
  Check,
  ChevronRight,
  Layers,
  Smartphone,
  Lock,
  Eye,
  Zap,
  RotateCcw,
  ShoppingBag,
  Music,
} from 'lucide-react';
import { ICON_PACKS, SYSTEM_FONTS } from '../../data/customizationData';
import { solarSound, SOUND_PACKS } from '../../utils/solarSound';

interface SettingsAppProps {
  solarState: SolarState;
  onUpdateState: (updates: Partial<SolarState>) => void;
  onTriggerVisualCustomizer?: (tab?: 'icons' | 'wallpapers' | 'system' | 'lockscreen' | 'aod' | 'boot' | 'fonts' | 'theme') => void;
  onLockPhone?: () => void;
  onEnterAOD?: () => void;
  onRebootPhone?: () => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  solarState,
  onUpdateState,
  onTriggerVisualCustomizer,
  onLockPhone,
  onEnterAOD,
  onRebootPhone,
}) => {
  const themes: { id: GlassTheme; label: string; color: string; desc: string }[] = [
    { id: 'golden', label: 'Sunbeam Gold', color: '#F59E0B', desc: 'Warm amber noon radiance' },
    { id: 'sunset', label: 'Sunset Terracotta', color: '#EA580C', desc: 'Golden hour twilight' },
    { id: 'azure', label: 'Solar Azure', color: '#0284C7', desc: 'Clear high sky daylight' },
    { id: 'emerald', label: 'Emerald Solstice', color: '#059669', desc: 'Botanical dapple sun' },
  ];

  const activePack = ICON_PACKS.find((p) => p.id === solarState.activeIconPack) || ICON_PACKS[0];
  const activeFont = SYSTEM_FONTS.find((f) => f.id === solarState.systemFont) || SYSTEM_FONTS[0];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
      {/* Universal Dark / Light Mode Switcher Card */}
      <div className="glass-panel dark:glass-widget rounded-3xl p-4 border border-white/70 dark:border-white/10 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {solarState.themeMode === 'dark' ? (
              <Moon className="w-4 h-4 text-amber-500 fill-amber-500" />
            ) : (
              <Sun className="w-4 h-4 text-amber-600" />
            )}
            <h3 className="font-display font-bold text-xs text-slate-800 dark:text-white">
              Universal Dark / Light Theme
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-lg">
            1-Click Switch
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'light' as ThemeMode, label: 'Light', icon: Sun },
            { id: 'dark' as ThemeMode, label: 'Dark', icon: Moon },
            { id: 'auto' as ThemeMode, label: 'Auto Circadian', icon: Sparkles },
          ].map((mode) => {
            const isSelected = solarState.themeMode === mode.id;
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  solarSound.playTap(solarState.soundEnabled);
                  onUpdateState({ themeMode: mode.id });
                }}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm font-bold'
                    : 'bg-white/60 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border-white/80 dark:border-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-semibold">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Customization Studio Hub Card */}
      <div className="glass-panel dark:glass-widget rounded-3xl p-4 border border-white/70 dark:border-white/10 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h3 className="font-display font-bold text-xs text-slate-800 dark:text-white">
              UI & Visual Customization Studio
            </h3>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold">
            PRO
          </span>
        </div>

        <div className="space-y-2">
          {/* Community Store Setting */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              if (onTriggerVisualCustomizer) onTriggerVisualCustomizer('store' as any);
            }}
            className="w-full p-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Community Theme Store
                </div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  Minimal, Anime, Tech, Nature, Cyberpunk & Luxe
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* DIY Theme Creator Setting */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              if (onTriggerVisualCustomizer) onTriggerVisualCustomizer('diy' as any);
            }}
            className="w-full p-2.5 rounded-2xl bg-white/60 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-white/70 dark:border-white/10 flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-orange-600 dark:text-orange-400">
                <Palette className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  DIY Theme Creator (Custom Theme Maker)
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Mix Wallpaper, Icons, Fonts, Status Bar & Sounds
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* AI Theme Generator Setting */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              if (onTriggerVisualCustomizer) onTriggerVisualCustomizer('ai' as any);
            }}
            className="w-full p-2.5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  AI Theme Generator
                </div>
                <div className="text-[10px] text-purple-600 dark:text-purple-400 font-medium">
                  Auto-match colors & icons from mood or wallpaper
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Sound Packs Setting */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              if (onTriggerVisualCustomizer) onTriggerVisualCustomizer('sounds' as any);
            }}
            className="w-full p-2.5 rounded-2xl bg-white/60 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-white/70 dark:border-white/10 flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Music className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Sound Packs & Typing Audio
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Active: {SOUND_PACKS.find((p) => p.id === solarState.activeSoundPack)?.name || 'Solar Harmonix'}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Icon Pack Setting */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              if (onTriggerVisualCustomizer) onTriggerVisualCustomizer('icons');
            }}
            className="w-full p-2.5 rounded-2xl bg-white/60 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-white/70 dark:border-white/10 flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Palette className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Icon Pack & Per-App Styling
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Active: {activePack.name} ({activePack.badge})
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Dynamic Wallpapers Setting */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              if (onTriggerVisualCustomizer) onTriggerVisualCustomizer('wallpapers');
            }}
            className="w-full p-2.5 rounded-2xl bg-white/60 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-white/70 dark:border-white/10 flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <ImageIcon className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Dynamic Wallpapers & 3D Parallax
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  14 Live, 3D & Auto-Changing Wallpapers
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* System Fonts & Typography Setting */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              if (onTriggerVisualCustomizer) onTriggerVisualCustomizer('fonts');
            }}
            className="w-full p-2.5 rounded-2xl bg-white/60 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-white/70 dark:border-white/10 flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Type className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  System Fonts & Text Styles
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Active: {activeFont.name} · {solarState.systemFontSize}
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Status Bar & Control Center Setting */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              if (onTriggerVisualCustomizer) onTriggerVisualCustomizer('system');
            }}
            className="w-full p-2.5 rounded-2xl bg-white/60 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-white/70 dark:border-white/10 flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Status Bar & Control Center
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Battery · Signal · Clock · Accents
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Lock Screen & Modular Widgets Setting */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              if (onTriggerVisualCustomizer) onTriggerVisualCustomizer('lockscreen');
            }}
            className="w-full p-2.5 rounded-2xl bg-white/60 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-white/70 dark:border-white/10 flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Lock Screen Clocks & Widgets
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Depth Clocks · Weather · Battery Animations
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Always-On Display (AOD) Setting */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              if (onTriggerVisualCustomizer) onTriggerVisualCustomizer('aod');
            }}
            className="w-full p-2.5 rounded-2xl bg-white/60 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-white/70 dark:border-white/10 flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Eye className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Always-On Display (AOD) Themes
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  AMOLED Corona · Star Map · Custom Signature
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          {/* Boot Animations Setting */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              if (onTriggerVisualCustomizer) onTriggerVisualCustomizer('boot');
            }}
            className="w-full p-2.5 rounded-2xl bg-white/60 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border border-white/70 dark:border-white/10 flex items-center justify-between text-left transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Startup Boot Sequences
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Sol Flare · Apple Silicon · Cyber Matrix · 1984 Mac
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Quick Power & Screen Actions */}
      <div className="glass-panel dark:glass-widget rounded-3xl p-4 border border-white/70 dark:border-white/10 shadow-md space-y-2.5">
        <h3 className="font-display font-bold text-xs text-slate-800 dark:text-white">
          System State Quick Triggers
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {onLockPhone && (
            <button
              onClick={() => {
                solarSound.playTap(solarState.soundEnabled);
                onLockPhone();
              }}
              className="p-2.5 rounded-xl bg-white/70 dark:bg-zinc-800 border border-white/80 dark:border-white/10 flex flex-col items-center gap-1 active:scale-95 transition-all text-center"
            >
              <Lock className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-semibold text-slate-800 dark:text-slate-200">
                Lock Device
              </span>
            </button>
          )}

          {onEnterAOD && (
            <button
              onClick={() => {
                solarSound.playTap(solarState.soundEnabled);
                onEnterAOD();
              }}
              className="p-2.5 rounded-xl bg-white/70 dark:bg-zinc-800 border border-white/80 dark:border-white/10 flex flex-col items-center gap-1 active:scale-95 transition-all text-center"
            >
              <Eye className="w-4 h-4 text-indigo-500" />
              <span className="text-[10px] font-semibold text-slate-800 dark:text-slate-200">
                AOD Mode
              </span>
            </button>
          )}

          {onRebootPhone && (
            <button
              onClick={() => {
                solarSound.playTap(solarState.soundEnabled);
                onRebootPhone();
              }}
              className="p-2.5 rounded-xl bg-white/70 dark:bg-zinc-800 border border-white/80 dark:border-white/10 flex flex-col items-center gap-1 active:scale-95 transition-all text-center"
            >
              <RotateCcw className="w-4 h-4 text-rose-500" />
              <span className="text-[10px] font-semibold text-slate-800 dark:text-slate-200">
                Reboot
              </span>
            </button>
          )}
        </div>
      </div>
      {/* Theme Palette Selector */}
      <div className="glass-panel rounded-3xl p-4 border border-white/70 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-amber-600" />
          <h3 className="font-display font-bold text-xs text-slate-800">
            Sunny Glass Tint
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {themes.map((t) => {
            const isSelected = solarState.glassTheme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  solarSound.playTap(solarState.soundEnabled);
                  onUpdateState({ glassTheme: t.id });
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-400/40'
                    : 'bg-white/40 border-white/60 hover:bg-white/70'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full shadow-sm"
                    style={{ backgroundColor: t.color }}
                  />
                  <span className="font-display font-bold text-xs text-slate-900">
                    {t.label}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">{t.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Glass Frosting & Blur Customizer */}
      <div className="glass-widget rounded-3xl p-4 border border-white/70 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-600" />
            <h3 className="font-display font-bold text-xs text-slate-800">
              Frosted Glass Blur
            </h3>
          </div>
          <span className="font-mono text-xs font-bold text-amber-800">
            {solarState.glassBlur}px
          </span>
        </div>

        <input
          type="range"
          min="8"
          max="40"
          value={solarState.glassBlur}
          onChange={(e) => onUpdateState({ glassBlur: Number(e.target.value) })}
          className="w-full h-2 bg-amber-200/60 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-medium">
          <span>Crisp Acrylic (8px)</span>
          <span>Ultra Frosted (40px)</span>
        </div>
      </div>

      {/* Icon Resizer & Display Customizer */}
      <div className="glass-panel rounded-3xl p-4 border border-white/70 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-600" />
            <h3 className="font-display font-bold text-xs text-slate-800">
              Icon Resizer & Scale
            </h3>
          </div>
          <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-lg border border-amber-200">
            {solarState.iconScale}% ({Math.round(62 * (solarState.iconScale / 100))}px)
          </span>
        </div>

        {/* 4 Presets */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'sm', label: 'Compact', scale: 82, px: 51 },
            { id: 'md', label: 'Standard', scale: 100, px: 62 },
            { id: 'lg', label: 'Large', scale: 114, px: 71 },
            { id: 'xl', label: 'Jumbo', scale: 126, px: 78 },
          ].map((p) => {
            const isSelected = solarState.iconSizePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  solarSound.playTap(solarState.soundEnabled);
                  onUpdateState({
                    iconScale: p.scale,
                    iconSizePreset: p.id as any,
                  });
                }}
                className={`py-2 px-1 rounded-xl text-center border transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm font-bold'
                    : 'bg-white/60 hover:bg-white text-slate-700 border-white/70 text-xs font-medium'
                }`}
              >
                <div className="text-[11px] leading-tight">{p.label}</div>
                <div className={`text-[9px] font-mono mt-0.5 ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                  {p.px}px
                </div>
              </button>
            );
          })}
        </div>

        {/* Continuous Slider */}
        <div className="space-y-1 pt-1">
          <input
            type="range"
            min="75"
            max="130"
            step="1"
            value={solarState.iconScale}
            onChange={(e) => {
              const val = Number(e.target.value);
              let preset: 'sm' | 'md' | 'lg' | 'xl' = 'md';
              if (val < 90) preset = 'sm';
              else if (val <= 106) preset = 'md';
              else if (val <= 120) preset = 'lg';
              else preset = 'xl';
              onUpdateState({
                iconScale: val,
                iconSizePreset: preset,
              });
            }}
            className="w-full h-2 bg-amber-200/60 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-medium">
            <span>75% (46px)</span>
            <span>100% Default</span>
            <span>130% (80px)</span>
          </div>
        </div>

        {/* Toggle App Name Labels */}
        <div className="flex items-center justify-between py-2 border-t border-slate-200/50">
          <div>
            <div className="text-xs font-semibold text-slate-800">
              Display App Labels
            </div>
            <div className="text-[10px] text-slate-500">
              Show text names below squircle icons
            </div>
          </div>
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              onUpdateState({ showIconLabels: !solarState.showIconLabels });
            }}
            className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
              solarState.showIconLabels ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-md" />
          </button>
        </div>
      </div>

      {/* 3D Tactile & Audio Toggles */}
      <div className="glass-panel rounded-3xl p-4 border border-white/70 shadow-md space-y-3">
        <h3 className="font-display font-bold text-xs text-slate-800 mb-1">
          Tactile 3D Physics
        </h3>

        {/* 3D Icon Tilt */}
        <div className="flex items-center justify-between py-1">
          <div>
            <div className="text-xs font-semibold text-slate-800">
              3D Gyroscope Icon Tilt
            </div>
            <div className="text-[10px] text-slate-500">
              Interactive perspective & specular sheen
            </div>
          </div>
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              onUpdateState({ iconTilt3D: !solarState.iconTilt3D });
            }}
            className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
              solarState.iconTilt3D ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* Audio feedback */}
        <div className="flex items-center justify-between py-1 border-t border-slate-200/50">
          <div>
            <div className="text-xs font-semibold text-slate-800">
              Solar Audio Synthesizer
            </div>
            <div className="text-[10px] text-slate-500">
              Tactile glass clicks & launch chimes
            </div>
          </div>
          <button
            onClick={() => {
              const next = !solarState.soundEnabled;
              solarSound.playTap(next);
              onUpdateState({ soundEnabled: next });
            }}
            className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
              solarState.soundEnabled ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-md" />
          </button>
        </div>
      </div>

      {/* About Sunny UI */}
      <div className="text-center py-2 text-[11px] text-slate-500">
        <p className="font-bold text-slate-700">Sunny ☀️ UI v3.2</p>
        <p>Integrated Liquid Glass · 3D Tactile Refractive Engine</p>
      </div>
    </div>
  );
};
