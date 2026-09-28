import React, { useState } from 'react';
import {
  SolarState,
  AppDefinition,
  IconPackId,
  SystemFont,
  SystemFontSize,
  TextColorTint,
  ThemeMode,
  CustomAppIconOverride,
  StatusBarStyle,
  BatteryStyle,
  SignalStyle,
  ClockPosition,
  ControlCenterAccent,
  NotificationCardStyle,
  LockScreenClockStyle,
  LockScreenWidgetId,
  AODThemeId,
  BootAnimationId,
  ThemePreset,
  PerformanceMode,
} from '../../types/launcher';
import {
  ICON_PACKS,
  WALLPAPERS_COLLECTION,
  SYSTEM_FONTS,
  FONT_SIZES,
  TEXT_COLORS,
  THEME_PRESETS,
  FACTORY_DEFAULT_THEME,
} from '../../data/customizationData';
import { AppIcon3D } from '../icons/AppIcon3D';
import {
  X,
  Palette,
  Image as ImageIcon,
  Type,
  Sun,
  Moon,
  Sparkles,
  Download,
  Upload,
  RefreshCw,
  Sliders,
  Check,
  Compass,
  Layers,
  Eye,
  Clock,
  RotateCcw,
  Smartphone,
  Lock,
  Battery,
  Zap,
  Terminal,
  Play,
  Radio,
  Heart,
  CloudSun,
  Calendar,
  BatteryCharging,
  ShieldCheck,
  Gauge,
  Cpu,
  Trash2,
  ShoppingBag,
  Music,
} from 'lucide-react';
import { solarSound } from '../../utils/solarSound';
import { ThemeStudioApp } from '../apps/ThemeStudioApp';

interface VisualCustomizerModalProps {
  solarState: SolarState;
  apps: AppDefinition[];
  currentWallpaper: string;
  onClose: () => void;
  onSelectWallpaper: (wpId: string) => void;
  onUpdateSolarState: (updates: Partial<SolarState>) => void;
  onUpdateAppOverride: (appId: string, override: CustomAppIconOverride | null) => void;
  onImportIconPack: (packData: any) => void;
  onApplyThemePreset?: (preset: ThemePreset) => void;
  onRestoreDefaults?: () => void;
  onBoostRAM?: () => void;
  onTestBoot?: (bootId: BootAnimationId) => void;
  onTestAOD?: () => void;
  onTestLockScreen?: () => void;
  initialTab?: 'presets' | 'store' | 'diy' | 'ai' | 'sounds' | 'icons' | 'wallpapers' | 'system' | 'lockscreen' | 'aod' | 'boot' | 'performance' | 'fonts' | 'theme';
}

const EMOJI_GLYPHS = [
  '☀️', '🧭', '💬', '🎵', '📸', '⚙️', '📅', '⏰',
  '🗺️', '⚡', '🧮', '📝', '🧘', '🔐', '🛍️', '🎮',
  '💎', '🚀', '🌿', '🌟', '🎨', '🔮', '👑', '🌊',
  '📱', '🔋', '🎧', '🕊️', '🔥', '✨', '🪐', '🦄',
];

const GRADIENT_PRESETS = [
  { name: 'Solar Gold', val: 'linear-gradient(180deg, #F59E0B 0%, #D97706 50%, #B45309 100%)', accent: '#F59E0B' },
  { name: 'Sky Azure', val: 'linear-gradient(180deg, #38BDF8 0%, #0284C7 50%, #1D4ED8 100%)', accent: '#0284C7' },
  { name: 'Emerald', val: 'linear-gradient(180deg, #34D399 0%, #10B981 50%, #059669 100%)', accent: '#10B981' },
  { name: 'Sunset Terracotta', val: 'linear-gradient(145deg, #FB923C 0%, #EA580C 50%, #C2410C 100%)', accent: '#EA580C' },
  { name: 'Rose Quartz', val: 'linear-gradient(145deg, #F43F5E 0%, #E11D48 50%, #BE123C 100%)', accent: '#F43F5E' },
  { name: 'Midnight OLED', val: 'linear-gradient(180deg, #18181B 0%, #09090B 100%)', accent: '#38BDF8' },
  { name: 'Frosted Crystal', val: 'linear-gradient(145deg, rgba(255,255,255,0.4) 0%, rgba(200,225,255,0.3) 100%)', accent: '#0EA5E9' },
  { name: '24K Solstice', val: 'linear-gradient(145deg, #271A06 0%, #120C03 100%)', accent: '#F59E0B' },
  { name: 'Nordic Snow', val: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)', accent: '#64748B' },
];

export const VisualCustomizerModal: React.FC<VisualCustomizerModalProps> = ({
  solarState,
  apps,
  currentWallpaper,
  onClose,
  onSelectWallpaper,
  onUpdateSolarState,
  onUpdateAppOverride,
  onImportIconPack,
  onApplyThemePreset,
  onRestoreDefaults,
  onBoostRAM,
  onTestBoot,
  onTestAOD,
  onTestLockScreen,
  initialTab = 'presets',
}) => {
  const [activeTab, setActiveTab] = useState<
    'presets' | 'store' | 'diy' | 'ai' | 'sounds' | 'icons' | 'wallpapers' | 'system' | 'lockscreen' | 'aod' | 'boot' | 'performance' | 'fonts' | 'theme'
  >(initialTab);

  // Notifications feedback for 1-click restore and RAM cleaner
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3200);
  };

  // Sub-state for Per-App Icon Customizer
  const [selectedAppId, setSelectedAppId] = useState<string>(apps[0]?.id || 'suntrack');
  const [editingName, setEditingName] = useState('');
  const [editingImgUrl, setEditingImgUrl] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Selected app object
  const selectedApp = apps.find((a) => a.id === selectedAppId) || apps[0];
  const currentOverride = solarState.customAppIcons[selectedAppId] || {};

  // Sync editing fields when selected app changes
  const handleSelectAppToEdit = (app: AppDefinition) => {
    solarSound.playTap(solarState.soundEnabled);
    setSelectedAppId(app.id);
    const existing = solarState.customAppIcons[app.id];
    setEditingName(existing?.name || app.name);
    setEditingImgUrl(existing?.customIconUrl || '');
  };

  // Export Icon Pack JSON
  const handleExportJson = () => {
    solarSound.playLaunch(solarState.soundEnabled);
    const exportData = {
      packId: solarState.activeIconPack,
      timestamp: new Date().toISOString(),
      customAppIcons: solarState.customAppIcons,
    };
    const jsonStr = JSON.stringify(exportData, null, 2);
    navigator.clipboard?.writeText(jsonStr);
    alert('Icon Pack JSON copied to clipboard! You can share this configuration or save it as a backup.');
  };

  // Process Import JSON
  const handleProcessImport = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      onImportIconPack(parsed);
      setImportStatus('Successfully imported icon pack!');
      solarSound.playLaunch(solarState.soundEnabled);
      setTimeout(() => {
        setShowImportModal(false);
        setImportStatus(null);
        setImportJsonText('');
      }, 1200);
    } catch (e: any) {
      setImportStatus('Invalid JSON format. Please verify syntax.');
    }
  };

  return (
    <div
      onClick={onClose}
      className="absolute inset-0 z-50 bg-black/60 backdrop-blur-2xl flex flex-col justify-end animate-in fade-in duration-200 select-none"
    >
      {/* Modal Sheet Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-h-[92vh] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-3xl rounded-t-[36px] border-t border-white/80 dark:border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 transition-colors"
      >
        {/* Header with drag pill and tabs */}
        <div className="p-4 pb-2 border-b border-slate-200/60 dark:border-white/10 flex flex-col gap-3">
          {/* Top Grabber */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                ✨
              </div>
              <div>
                <h2 className="font-display font-bold text-sm text-slate-900 dark:text-white leading-tight">
                  System & Visual Customizer
                </h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Icon Packs · Wallpapers · Status Bar · Lock Screen · AOD · Boot
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs (Scrollable horizontal pills) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
            {[
              { id: 'presets', label: '1-Click Presets', icon: Sparkles },
              { id: 'store', label: 'Community Store', icon: ShoppingBag },
              { id: 'diy', label: 'DIY Theme Creator', icon: Palette },
              { id: 'ai', label: 'AI Theme Generator', icon: Sparkles },
              { id: 'sounds', label: 'Sound Packs', icon: Music },
              { id: 'icons', label: 'Icon Packs', icon: Layers },
              { id: 'wallpapers', label: 'Wallpapers', icon: ImageIcon },
              { id: 'system', label: 'Status & Controls', icon: Smartphone },
              { id: 'lockscreen', label: 'Lock Screen', icon: Lock },
              { id: 'aod', label: 'AOD Themes', icon: Moon },
              { id: 'boot', label: 'Boot Animations', icon: Zap },
              { id: 'performance', label: 'Battery & RAM Boost', icon: BatteryCharging },
              { id: 'fonts', label: 'Fonts', icon: Type },
              { id: 'theme', label: 'Dark Mode', icon: Sun },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    solarSound.playTap(solarState.soundEnabled);
                    setActiveTab(tab.id as any);
                  }}
                  className={`py-1.5 px-3 rounded-xl flex items-center gap-1.5 shrink-0 transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-sm font-bold scale-102'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[11px] whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Floating Feedback Notification */}
        {feedbackToast && (
          <div className="mx-4 mt-2 p-2.5 rounded-xl bg-emerald-500 text-white text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{feedbackToast}</span>
            </div>
            <button
              onClick={() => setFeedbackToast(null)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
          {/* =========================================================================
              THEME STUDIO EMBED: COMMUNITY STORE, DIY THEME CREATOR, AI GENERATOR & SOUND PACKS
             ========================================================================= */}
          {(activeTab === 'store' || activeTab === 'diy' || activeTab === 'ai' || activeTab === 'sounds') && (
            <div className="h-[65vh] flex flex-col rounded-2xl overflow-hidden border border-white/10">
              <ThemeStudioApp
                solarState={solarState}
                currentWallpaper={currentWallpaper}
                onApplyThemePreset={onApplyThemePreset || (() => {})}
                onRestoreDefaults={onRestoreDefaults || (() => {})}
                onUpdateSolarState={onUpdateSolarState}
                initialSubTab={activeTab === 'store' ? 'store' : activeTab === 'diy' ? 'diy' : activeTab === 'ai' ? 'ai' : 'sounds'}
              />
            </div>
          )}
          {/* =========================================================================
              TAB 0: 1-CLICK THEMES & FACTORY RESTORE
             ========================================================================= */}
          {activeTab === 'presets' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Emergency Restore Factory Defaults Hero Platter */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-500/10 via-amber-500/10 to-orange-500/15 border-2 border-amber-500/30 shadow-md space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        Restore Factory Defaults (Pehle Jaisa Restore)
                      </h3>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
                        Ek click mein sab kuch default SolOS factory look & feel par wapas laayein
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    Restores: Wallpapers, 3D Icons, SF Pro font, Standard Island, & Widgets
                  </span>

                  <button
                    onClick={() => {
                      if (onRestoreDefaults) {
                        onRestoreDefaults();
                      } else {
                        onSelectWallpaper(FACTORY_DEFAULT_THEME.wallpaper);
                        onUpdateSolarState(FACTORY_DEFAULT_THEME);
                      }
                      showToast('Restored all settings to Factory Defaults! Original theme restored ☀️');
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Defaults</span>
                  </button>
                </div>
              </div>

              {/* Curated 1-Click Master Theme Presets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Curated 1-Click Master Themes
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {THEME_PRESETS.length} complete themes
                  </span>
                </div>

                <div className="space-y-3">
                  {THEME_PRESETS.map((preset) => {
                    const isCurrent =
                      currentWallpaper === preset.wallpaper &&
                      solarState.activeIconPack === preset.iconPack &&
                      solarState.themeMode === preset.themeMode;

                    return (
                      <div
                        key={preset.id}
                        className={`rounded-3xl border overflow-hidden transition-all shadow-sm ${
                          isCurrent
                            ? 'border-amber-500 ring-2 ring-amber-400/40 bg-amber-500/5 dark:bg-amber-500/10'
                            : 'border-slate-200 dark:border-white/10 bg-white/70 dark:bg-zinc-800/70 hover:bg-white dark:hover:bg-zinc-800'
                        }`}
                      >
                        {/* Theme Header Bar */}
                        <div
                          className="p-3.5 flex items-center justify-between text-white relative overflow-hidden"
                          style={{ background: preset.previewBg }}
                        >
                          <div className="relative z-10">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm leading-tight drop-shadow-md">
                                {preset.name}
                              </span>
                              <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[9px] font-bold border border-white/20">
                                {preset.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-white/90 drop-shadow mt-0.5 line-clamp-1">
                              {preset.description}
                            </p>
                          </div>

                          {isCurrent && (
                            <span className="relative z-10 px-2.5 py-1 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-md">
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Active</span>
                            </span>
                          )}
                        </div>

                        {/* Theme Breakdown Pills & Apply Button */}
                        <div className="p-3 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-slate-600 dark:text-slate-300">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-700/80 font-medium">
                              🎨 {preset.iconPack}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-700/80 font-medium capitalize">
                              🌓 {preset.themeMode}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-700/80 font-medium">
                              🔤 {preset.systemFont}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-700/80 font-medium">
                              📱 {preset.statusBarStyle}
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              if (onApplyThemePreset) {
                                onApplyThemePreset(preset);
                              } else {
                                onSelectWallpaper(preset.wallpaper);
                                onUpdateSolarState({
                                  activeIconPack: preset.iconPack,
                                  themeMode: preset.themeMode,
                                  systemFont: preset.systemFont,
                                  systemFontSize: preset.systemFontSize,
                                  systemTextColor: preset.systemTextColor,
                                  statusBarStyle: preset.statusBarStyle,
                                  batteryStyle: preset.batteryStyle,
                                  signalStyle: preset.signalStyle,
                                  clockPosition: preset.clockPosition,
                                  controlCenterAccent: preset.controlCenterAccent,
                                  notificationCardStyle: preset.notificationCardStyle,
                                  lockClockStyle: preset.lockClockStyle,
                                  lockWidgets: preset.lockWidgets,
                                  aodTheme: preset.aodTheme,
                                  bootAnimation: preset.bootAnimation,
                                });
                              }
                              showToast(`Applied ${preset.name} in 1 click! ✨`);
                            }}
                            className={`px-4 py-1.5 rounded-xl font-bold text-xs shadow-sm active:scale-95 transition-all shrink-0 ${
                              isCurrent
                                ? 'bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                                : 'bg-amber-500 hover:bg-amber-600 text-white'
                            }`}
                          >
                            {isCurrent ? 'Re-Apply' : '1-Click Apply'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {/* =========================================================================
              TAB 1: ICON PACKS & INDIVIDUAL APP ICON CUSTOMIZATION
             ========================================================================= */}
          {activeTab === 'icons' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Top Action Bar: Import / Export */}
              <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/30 p-3 rounded-2xl border border-amber-200/60 dark:border-amber-800/30">
                <div>
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300">
                    Icon Pack Engine
                  </h4>
                  <p className="text-[10px] text-amber-700 dark:text-amber-400">
                    Change complete pack or customize every app individually
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleExportJson}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-800 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50 text-[10px] font-semibold hover:bg-amber-100 transition-all shadow-2xs"
                    title="Export Icon Pack JSON"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-semibold transition-all shadow-xs"
                    title="Import Custom Icon Pack JSON"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Import JSON</span>
                  </button>
                </div>
              </div>

              {/* Curated Icon Packs Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Curated 3D Icon Packs
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {ICON_PACKS.length} styles
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ICON_PACKS.map((pack) => {
                    const isSelected = solarState.activeIconPack === pack.id;
                    return (
                      <button
                        key={pack.id}
                        onClick={() => {
                          solarSound.playTap(solarState.soundEnabled);
                          onUpdateSolarState({ activeIconPack: pack.id });
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500 ring-2 ring-amber-400/40 shadow-md'
                            : 'bg-white/60 dark:bg-zinc-800/60 border-slate-200/80 dark:border-white/10 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-slate-900 dark:text-white">
                                {pack.name}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold">
                                {pack.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                              {pack.description}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        {/* Preview 4 Glyphs */}
                        <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-slate-200/40 dark:border-white/5">
                          {pack.previewIcons.map((glyph, idx) => (
                            <div
                              key={idx}
                              className="w-8 h-8 rounded-[9px] flex items-center justify-center text-sm shadow-xs border border-white/60"
                              style={{ background: pack.bgStyle }}
                            >
                              {glyph}
                            </div>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* HAR EK APP ICON KO BADALNE KA OPTION (Individual App Customizer) */}
              <div className="glass-panel dark:glass-widget rounded-3xl p-4 border border-slate-200/80 dark:border-white/10 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                        Per-App Customizer (Har App Ka Icon Badlo)
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Select an app below to customize its glyph, title, gradient, or icon image
                      </p>
                    </div>
                  </div>
                  {solarState.customAppIcons[selectedAppId] && (
                    <button
                      onClick={() => {
                        solarSound.playTap(solarState.soundEnabled);
                        onUpdateAppOverride(selectedAppId, null);
                        setEditingName(selectedApp.name);
                        setEditingImgUrl('');
                      }}
                      className="text-[10px] text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset App</span>
                    </button>
                  )}
                </div>

                {/* Horizontal App Picker Scroller */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    1. Select App to Customize:
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                    {apps.map((app) => {
                      const isTarget = app.id === selectedAppId;
                      const hasOverride = !!solarState.customAppIcons[app.id];
                      return (
                        <button
                          key={app.id}
                          onClick={() => handleSelectAppToEdit(app)}
                          className={`flex flex-col items-center gap-1 p-1.5 rounded-2xl shrink-0 transition-all ${
                            isTarget
                              ? 'bg-amber-500 text-white font-bold shadow-md scale-105'
                              : 'bg-white/60 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-white border border-slate-200 dark:border-white/5'
                          }`}
                        >
                          <div className="w-10 h-10 flex items-center justify-center">
                            <AppIcon3D
                              app={app}
                              size="xs"
                              showLabel={false}
                              tiltEnabled={false}
                              iconPack={solarState.activeIconPack}
                              customOverride={solarState.customAppIcons[app.id]}
                            />
                          </div>
                          <span className="text-[9px] truncate max-w-[50px]">
                            {solarState.customAppIcons[app.id]?.name || app.name}
                          </span>
                          {hasOverride && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live Preview & Editor Panel for Selected App */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center gap-4">
                  {/* Live 3D Icon Preview */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Live Preview
                    </span>
                    <AppIcon3D
                      app={selectedApp}
                      size="lg"
                      showLabel={true}
                      tiltEnabled={true}
                      iconPack={solarState.activeIconPack}
                      customOverride={currentOverride}
                    />
                  </div>

                  {/* Settings Inputs */}
                  <div className="flex-1 w-full space-y-3">
                    {/* Rename App */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        App Display Name:
                      </label>
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingName(val);
                          onUpdateAppOverride(selectedAppId, {
                            ...currentOverride,
                            name: val,
                          });
                        }}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/15 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Custom App Name"
                      />
                    </div>

                    {/* Choose Emoji Glyph */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        Choose Icon Glyph / Emoji:
                      </label>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar p-1 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10">
                        {EMOJI_GLYPHS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => {
                              solarSound.playTap(solarState.soundEnabled);
                              onUpdateAppOverride(selectedAppId, {
                                ...currentOverride,
                                glyphEmoji: emoji,
                                customIconUrl: undefined,
                              });
                            }}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all hover:scale-115 ${
                              currentOverride.glyphEmoji === emoji
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'hover:bg-slate-100 dark:hover:bg-zinc-800'
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Background Gradient */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        Background Gradient Preset:
                      </label>
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                        {GRADIENT_PRESETS.map((gp) => (
                          <button
                            key={gp.name}
                            onClick={() => {
                              solarSound.playTap(solarState.soundEnabled);
                              onUpdateAppOverride(selectedAppId, {
                                ...currentOverride,
                                customGradient: gp.val,
                                accentColor: gp.accent,
                              });
                            }}
                            className="w-6 h-6 rounded-lg shrink-0 border border-white shadow-xs transition-transform hover:scale-110"
                            style={{ background: gp.val }}
                            title={gp.name}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Custom Icon Image URL or Upload */}
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        Custom Image Icon URL (Optional):
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          value={editingImgUrl}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditingImgUrl(val);
                            onUpdateAppOverride(selectedAppId, {
                              ...currentOverride,
                              customIconUrl: val || undefined,
                            });
                          }}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-300 dark:border-white/15 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                          placeholder="https://example.com/icon.png"
                        />
                        {editingImgUrl && (
                          <button
                            onClick={() => {
                              setEditingImgUrl('');
                              onUpdateAppOverride(selectedAppId, {
                                ...currentOverride,
                                customIconUrl: undefined,
                              });
                            }}
                            className="text-[10px] text-slate-500 hover:text-slate-700"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: DYNAMIC WALLPAPERS & PARALLAX
             ========================================================================= */}
          {activeTab === 'wallpapers' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Wallpaper Auto-Cycle Toggle (Rojoana Naye / Timed Rotation) */}
              <div className="glass-panel dark:glass-widget rounded-3xl p-4 border border-slate-200/80 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <RefreshCw
                      className={`w-4 h-4 text-amber-600 dark:text-amber-400 ${
                        solarState.wallpaperAutoCycle ? 'animate-spin' : ''
                      }`}
                      style={{ animationDuration: '8s' }}
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                        Auto-Changing Wallpapers (Rojoana Naye)
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Automatically cycle fresh dynamic wallpapers every 20 seconds
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      solarSound.playTap(solarState.soundEnabled);
                      onUpdateSolarState({
                        wallpaperAutoCycle: !solarState.wallpaperAutoCycle,
                      });
                    }}
                    className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                      solarState.wallpaperAutoCycle
                        ? 'bg-amber-500 justify-end'
                        : 'bg-slate-300 dark:bg-zinc-700 justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                  </button>
                </div>

                {/* 3D Parallax Gyroscope Control */}
                <div className="pt-2 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      3D Parallax Tilt Physics
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Multi-plane depth moving with device or mouse cursor
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      solarSound.playTap(solarState.soundEnabled);
                      onUpdateSolarState({
                        parallaxEnabled: !solarState.parallaxEnabled,
                      });
                    }}
                    className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                      solarState.parallaxEnabled
                        ? 'bg-amber-500 justify-end'
                        : 'bg-slate-300 dark:bg-zinc-700 justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              </div>

              {/* Wallpaper Catalog Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Dynamic Wallpaper Collection
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {WALLPAPERS_COLLECTION.length} live styles
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {WALLPAPERS_COLLECTION.map((wp) => {
                    const isSelected = currentWallpaper === wp.id;
                    return (
                      <button
                        key={wp.id}
                        onClick={() => {
                          solarSound.playTap(solarState.soundEnabled);
                          onSelectWallpaper(wp.id);
                        }}
                        className={`rounded-2xl overflow-hidden border text-left transition-all relative flex flex-col justify-between h-36 ${
                          isSelected
                            ? 'border-amber-500 ring-2 ring-amber-400/50 shadow-lg scale-[1.02]'
                            : 'border-slate-200 dark:border-white/10 hover:border-slate-300'
                        }`}
                        style={{ background: wp.previewGradient }}
                      >
                        {/* Top Badge */}
                        <div className="p-2.5 flex items-center justify-between w-full">
                          <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[9px] font-semibold border border-white/20">
                            {wp.badge || wp.category}
                          </span>
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>

                        {/* Bottom Label Platter */}
                        <div className="p-2.5 bg-gradient-to-t from-black/85 via-black/50 to-transparent text-white">
                          <div className="font-bold text-xs leading-tight truncate">
                            {wp.name}
                          </div>
                          <div className="text-[9px] text-white/80 line-clamp-1 mt-0.5">
                            {wp.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: STATUS BAR & CONTROL CENTER CUSTOMIZATION
             ========================================================================= */}
          {activeTab === 'system' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Interactive Status Bar Live Preview Platter */}
              <div className="p-3 rounded-2xl bg-slate-900 text-white border border-white/10 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>LIVE STATUS BAR PREVIEW</span>
                  <span className="text-amber-400 font-semibold">{solarState.statusBarStyle.toUpperCase()}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
                  {solarState.clockPosition === 'center' ? (
                    <>
                      <div className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                        Island
                      </div>
                      <span className="font-semibold text-xs font-mono">2:30 PM</span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <Radio className="w-3 h-3 text-amber-400" />
                        <span className="font-mono text-[10px]">{solarState.batteryLevel}%</span>
                      </div>
                    </>
                  ) : solarState.clockPosition === 'right' ? (
                    <>
                      <div className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                        SolOS Island
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px]">{solarState.batteryLevel}%</span>
                        <span className="font-semibold text-xs font-mono">2:30 PM</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-xs font-mono">2:30 PM</span>
                      <div className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                        Island
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <span className="font-mono text-[10px]">{solarState.batteryLevel}%</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Status Bar Styles */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Status Bar Style & Layout
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'ios-classic' as StatusBarStyle, name: 'iOS Dynamic Island', desc: 'Floating pill with solar telemetry' },
                    { id: 'android-minimal' as StatusBarStyle, name: 'Android Minimal', desc: 'Compact clean edge alignment' },
                    { id: 'cyber-neon' as StatusBarStyle, name: 'Cyber Neon HUD', desc: '5G quantum radio & cyan meters' },
                    { id: 'pill-compact' as StatusBarStyle, name: 'Pill Compact', desc: 'Frosted telemetry chip capsule' },
                  ].map((style) => {
                    const isSelected = solarState.statusBarStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        onClick={() => {
                          solarSound.playTap(solarState.soundEnabled);
                          onUpdateSolarState({ statusBarStyle: style.id });
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500 ring-2 ring-amber-400/40 shadow-sm'
                            : 'bg-white/60 dark:bg-zinc-800/60 border-slate-200/80 dark:border-white/10 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                            {style.name}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-500 stroke-[3]" />}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                          {style.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Battery Indicator Style */}
              <div className="glass-panel dark:glass-widget rounded-3xl p-4 border border-slate-200/80 dark:border-white/10 space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Battery Indicator Icon Style
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'capsule-outside' as BatteryStyle, label: 'Capsule + %' },
                    { id: 'capsule-inside' as BatteryStyle, label: '% In Capsule' },
                    { id: 'circle-meter' as BatteryStyle, label: 'Radial Ring' },
                    { id: 'bar-only' as BatteryStyle, label: 'Bar Gauge' },
                    { id: 'percentage-only' as BatteryStyle, label: '% Text Only' },
                  ].map((b) => {
                    const isSelected = solarState.batteryStyle === b.id;
                    return (
                      <button
                        key={b.id}
                        onClick={() => {
                          solarSound.playTap(solarState.soundEnabled);
                          onUpdateSolarState({ batteryStyle: b.id });
                        }}
                        className={`py-2 px-1 rounded-xl text-center border transition-all text-xs ${
                          isSelected
                            ? 'bg-amber-500 text-white border-amber-600 shadow-sm font-bold'
                            : 'bg-white/60 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                        }`}
                      >
                        <div className="text-[11px] font-semibold">{b.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cellular Signal & Clock Position */}
              <div className="grid grid-cols-2 gap-3">
                {/* Signal Style */}
                <div className="glass-panel dark:glass-widget rounded-3xl p-3.5 border border-slate-200/80 dark:border-white/10 space-y-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Signal Style
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: 'bars' as SignalStyle, label: '4-Bar Gauge' },
                      { id: 'dots' as SignalStyle, label: 'Cupertino Dots' },
                      { id: 'cyber' as SignalStyle, label: '5G Cyber Radio' },
                    ].map((s) => {
                      const isSelected = solarState.signalStyle === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            solarSound.playTap(solarState.soundEnabled);
                            onUpdateSolarState({ signalStyle: s.id });
                          }}
                          className={`py-1.5 px-2.5 rounded-lg text-left text-xs transition-all ${
                            isSelected
                              ? 'bg-amber-500 text-white font-bold'
                              : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Clock Position */}
                <div className="glass-panel dark:glass-widget rounded-3xl p-3.5 border border-slate-200/80 dark:border-white/10 space-y-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Clock Position
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: 'left' as ClockPosition, label: 'Left (iOS Default)' },
                      { id: 'center' as ClockPosition, label: 'Center (Balanced)' },
                      { id: 'right' as ClockPosition, label: 'Right (Android)' },
                    ].map((cp) => {
                      const isSelected = solarState.clockPosition === cp.id;
                      return (
                        <button
                          key={cp.id}
                          onClick={() => {
                            solarSound.playTap(solarState.soundEnabled);
                            onUpdateSolarState({ clockPosition: cp.id });
                          }}
                          className={`py-1.5 px-2.5 rounded-lg text-left text-xs transition-all ${
                            isSelected
                              ? 'bg-amber-500 text-white font-bold'
                              : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {cp.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Control Center Accent Color */}
              <div className="glass-panel dark:glass-widget rounded-3xl p-4 border border-slate-200/80 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Control Center Accent Color
                  </span>
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 capitalize">
                    {solarState.controlCenterAccent}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'amber' as ControlCenterAccent, label: 'Amber', color: '#F59E0B' },
                    { id: 'emerald' as ControlCenterAccent, label: 'Emerald', color: '#10B981' },
                    { id: 'blue' as ControlCenterAccent, label: 'Azure', color: '#0284C7' },
                    { id: 'purple' as ControlCenterAccent, label: 'Violet', color: '#8B5CF6' },
                    { id: 'coral' as ControlCenterAccent, label: 'Coral', color: '#F43F5E' },
                  ].map((acc) => {
                    const isSelected = solarState.controlCenterAccent === acc.id;
                    return (
                      <button
                        key={acc.id}
                        onClick={() => {
                          solarSound.playTap(solarState.soundEnabled);
                          onUpdateSolarState({ controlCenterAccent: acc.id });
                        }}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-white dark:bg-zinc-800 border-amber-500 ring-2 ring-amber-400/40 shadow-sm'
                            : 'bg-slate-100 dark:bg-zinc-800/50 border-transparent hover:bg-white dark:hover:bg-zinc-800'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full shadow-xs" style={{ backgroundColor: acc.color }} />
                        <span className="text-[9px] font-medium">{acc.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notification Card Style */}
              <div className="glass-panel dark:glass-widget rounded-3xl p-4 border border-slate-200/80 dark:border-white/10 space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Notification Panel Card Style
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'glass-blur' as NotificationCardStyle, label: 'Glassmorphism', desc: 'Frosted acrylic' },
                    { id: 'solid-dark' as NotificationCardStyle, label: 'Solid OLED', desc: 'High contrast' },
                    { id: 'minimal-outline' as NotificationCardStyle, label: 'Minimal Edge', desc: 'Glowing border' },
                  ].map((nc) => {
                    const isSelected = solarState.notificationCardStyle === nc.id;
                    return (
                      <button
                        key={nc.id}
                        onClick={() => {
                          solarSound.playTap(solarState.soundEnabled);
                          onUpdateSolarState({ notificationCardStyle: nc.id });
                        }}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-white border-amber-600 shadow-sm font-bold'
                            : 'bg-white/60 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                        }`}
                      >
                        <div className="text-[11px] font-bold">{nc.label}</div>
                        <div className="text-[9px] opacity-80 mt-0.5">{nc.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: LOCK SCREEN CLOCKS & WIDGETS
             ========================================================================= */}
          {activeTab === 'lockscreen' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Test / Preview Lock Screen Action Platter */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-600/20 border border-amber-400/40 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    Lock Screen Experience
                  </h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400">
                    Clock styles, live widgets & interactive swipe unlock
                  </p>
                </div>
                {onTestLockScreen && (
                  <button
                    onClick={() => {
                      solarSound.playTap(solarState.soundEnabled);
                      onClose();
                      onTestLockScreen();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lock Device</span>
                  </button>
                )}
              </div>

              {/* Lock Screen Clock Typography Style */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Lock Screen Clock Typography
                </span>
                <div className="space-y-2">
                  {[
                    { id: 'ios-depth' as LockScreenClockStyle, name: 'iOS 3D Depth Clock', sample: '02:30', font: 'font-display font-black', desc: 'Ultra-bold depth numbers' },
                    { id: 'minimal-serif' as LockScreenClockStyle, name: 'Playfair Editorial Serif', sample: '02:30', font: 'font-serif font-light tracking-widest', desc: 'High-fashion editorial elegance' },
                    { id: 'solar-sundial' as LockScreenClockStyle, name: 'Solar Arc Sundial', sample: '02:30 PM', font: 'font-mono font-bold text-amber-500', desc: 'With live solar radiation telemetry' },
                    { id: 'retro-flip' as LockScreenClockStyle, name: 'Retro Amber Split-Flip', sample: '[02] : [30]', font: 'font-mono font-bold', desc: 'Mechanical amber airport flip tiles' },
                    { id: 'cyber-hud' as LockScreenClockStyle, name: 'Orbital Cyber HUD', sample: '02:30', font: 'font-mono font-black text-cyan-400', desc: 'Cyan spacecraft HUD telemetry' },
                  ].map((clock) => {
                    const isSelected = solarState.lockClockStyle === clock.id;
                    return (
                      <button
                        key={clock.id}
                        onClick={() => {
                          solarSound.playTap(solarState.soundEnabled);
                          onUpdateSolarState({ lockClockStyle: clock.id });
                        }}
                        className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500 ring-2 ring-amber-400/40 shadow-sm'
                            : 'bg-white/60 dark:bg-zinc-800/60 border-slate-200/80 dark:border-white/10 hover:bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {clock.name}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {clock.desc}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-base ${clock.font}`}>
                            {clock.sample}
                          </span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-amber-500 stroke-[3]" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lock Screen Modular Widgets */}
              <div className="glass-panel dark:glass-widget rounded-3xl p-4 border border-slate-200/80 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Lock Screen Widgets (Select up to 3)
                  </span>
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                    {solarState.lockWidgets.length}/3 Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'weather' as LockScreenWidgetId, label: 'Weather & UV Index', icon: CloudSun, val: `${solarState.temperature}°C · UV ${solarState.uvIndex}` },
                    { id: 'battery' as LockScreenWidgetId, label: 'Battery & Solar Harvest', icon: Battery, val: `${solarState.batteryLevel}% · ${solarState.solarCharging ? 'Harvesting' : 'Battery'}` },
                    { id: 'golden-hour' as LockScreenWidgetId, label: 'Solar Watt Arc', icon: Sun, val: `${solarState.solarWattage} W/m²` },
                    { id: 'mindfulness' as LockScreenWidgetId, label: 'Mindful Breathing', icon: Heart, val: '3m Daily Ready' },
                    { id: 'events' as LockScreenWidgetId, label: 'Upcoming Event', icon: Calendar, val: 'Golden Bluff 6:20 PM' },
                  ].map((widget) => {
                    const isSelected = solarState.lockWidgets.includes(widget.id);
                    const Icon = widget.icon;
                    return (
                      <button
                        key={widget.id}
                        onClick={() => {
                          solarSound.playTap(solarState.soundEnabled);
                          let nextWidgets = [...solarState.lockWidgets];
                          if (isSelected) {
                            nextWidgets = nextWidgets.filter((id) => id !== widget.id);
                          } else {
                            if (nextWidgets.length >= 3) {
                              nextWidgets.shift(); // remove first to make space for 3rd
                            }
                            nextWidgets.push(widget.id);
                          }
                          onUpdateSolarState({ lockWidgets: nextWidgets });
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500 text-slate-900 dark:text-white font-semibold'
                            : 'bg-white/50 dark:bg-zinc-800/50 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-500' : 'text-slate-400'}`} />
                          <div>
                            <div className="text-[11px] leading-tight">{widget.label}</div>
                            <div className="text-[9px] opacity-75 font-mono">{widget.val}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-500 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: ALWAYS-ON DISPLAY (AOD) THEMES
             ========================================================================= */}
          {activeTab === 'aod' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Test / Launch AOD Action Banner */}
              <div className="p-3.5 rounded-2xl bg-zinc-950 text-white border border-white/20 flex items-center justify-between shadow-xl">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-amber-400" />
                    <h4 className="font-bold text-xs text-white">
                      AMOLED Always-On Display (AOD)
                    </h4>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    OLED zero-power black background with anti-burn-in micro-shift
                  </p>
                </div>
                {onTestAOD && (
                  <button
                    onClick={() => {
                      solarSound.playTap(solarState.soundEnabled);
                      onClose();
                      onTestAOD();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Enter AOD</span>
                  </button>
                )}
              </div>

              {/* Master AOD Toggle */}
              <div className="glass-panel dark:glass-widget rounded-3xl p-4 border border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">
                    Always-On Display Active
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Displays dimmed clock & telemetry when screen locks
                  </p>
                </div>
                <button
                  onClick={() => {
                    solarSound.playTap(solarState.soundEnabled);
                    onUpdateSolarState({ aodEnabled: !solarState.aodEnabled });
                  }}
                  className={`w-12 h-7 rounded-full p-1 transition-colors flex items-center ${
                    solarState.aodEnabled ? 'bg-amber-500 justify-end' : 'bg-slate-300 dark:bg-zinc-700 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* AOD Theme Selection */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  AMOLED AOD Themes
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'eclipse-ring' as AODThemeId, name: 'Solar Eclipse Corona', desc: 'Luminous spinning solar flare corona', badge: 'Popular' },
                    { id: 'minimal-digital' as AODThemeId, name: 'Minimalist Digital', desc: 'Ultra-thin typographic numerals with date', badge: 'Ultra-low Battery' },
                    { id: 'analog-sundial' as AODThemeId, name: 'Analog Chronograph', desc: 'Subtle ticking watch dial with amber hour hand', badge: 'Classic' },
                    { id: 'bioluminescent-wave' as AODThemeId, name: 'Bioluminescent Wave', desc: 'Gentle organic cyan & emerald breathing wave', badge: 'Ambient' },
                    { id: 'star-map' as AODThemeId, name: 'Constellation Star Map', desc: 'Celestial night coordinate star dots', badge: 'Cosmic' },
                  ].map((theme) => {
                    const isSelected = solarState.aodTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => {
                          solarSound.playTap(solarState.soundEnabled);
                          onUpdateSolarState({ aodTheme: theme.id });
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500 ring-2 ring-amber-400/40 shadow-sm'
                            : 'bg-white/60 dark:bg-zinc-800/60 border-slate-200/80 dark:border-white/10 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                            {theme.name}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-slate-300 font-medium">
                            {theme.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {theme.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom AOD Signature Text */}
              <div className="glass-panel dark:glass-widget rounded-3xl p-4 border border-slate-200/80 dark:border-white/10 space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Custom AOD Signature Text
                </span>
                <input
                  type="text"
                  maxLength={30}
                  value={solarState.aodCustomText}
                  onChange={(e) => onUpdateSolarState({ aodCustomText: e.target.value })}
                  placeholder="e.g. SolOS 3.5 · Stay Golden"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-slate-300 dark:border-white/10 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {/* Quick suggestions */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['SolOS 3.5', 'Breathe & Glow', 'Solar Powered', 'Sunny UI', 'Stay Warm'].map((sug) => (
                    <button
                      key={sug}
                      onClick={() => onUpdateSolarState({ aodCustomText: sug })}
                      className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-[10px] font-medium text-slate-600 dark:text-slate-400 hover:text-amber-500"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: BOOT ANIMATIONS & POWER OPTIONS
             ========================================================================= */}
          {activeTab === 'boot' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Test / Reboot Action Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white flex items-center justify-between shadow-xl">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-yellow-300" />
                    <h4 className="font-bold text-xs text-white">
                      Boot Animation Simulator
                    </h4>
                  </div>
                  <p className="text-[10px] text-white/80 mt-0.5">
                    Select startup sequence & experience simulated cold reboot
                  </p>
                </div>
                {onTestBoot && (
                  <button
                    onClick={() => {
                      solarSound.playTap(solarState.soundEnabled);
                      onClose();
                      onTestBoot(solarState.bootAnimation);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                    <span>Reboot Phone</span>
                  </button>
                )}
              </div>

              {/* Boot Animation Choices */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Startup Boot Animation Themes
                </span>

                <div className="space-y-2.5">
                  {[
                    { id: 'solar-flare' as BootAnimationId, name: 'SolOS 3.5 Solar Flare Awakening', icon: '☀️', desc: 'Golden solar flare corona pulse with kernel stage telemetry' },
                    { id: 'liquid-apple' as BootAnimationId, name: 'Cupertino Liquid Silicon Bionic', icon: '🍎', desc: 'Gleaming apple squircle with liquid refraction sheen' },
                    { id: 'cyber-matrix' as BootAnimationId, name: 'Neo Cyber Matrix Terminal', icon: '⚡', desc: 'Sci-fi command prompt kernel mount with cyan CRT scanlines' },
                    { id: 'retro-mac' as BootAnimationId, name: 'Macintosh 1984 Nostalgia', icon: '💻', desc: 'Classic smiling beige Macintosh System 7 retro boot' },
                    { id: 'nebula-ignition' as BootAnimationId, name: 'Cosmic Nebula Supernova', icon: '✨', desc: 'Infinite starlight particle explosion with celestial typography' },
                  ].map((anim) => {
                    const isSelected = solarState.bootAnimation === anim.id;
                    return (
                      <button
                        key={anim.id}
                        onClick={() => {
                          solarSound.playTap(solarState.soundEnabled);
                          onUpdateSolarState({ bootAnimation: anim.id });
                        }}
                        className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500 ring-2 ring-amber-400/40 shadow-sm'
                            : 'bg-white/60 dark:bg-zinc-800/60 border-slate-200/80 dark:border-white/10 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{anim.icon}</span>
                          <div>
                            <span className="font-bold text-xs text-slate-900 dark:text-white leading-tight block">
                              {anim.name}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              {anim.desc}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB: PERFORMANCE, BATTERY EFFICIENCY & AD-FREE PRIVACY SHIELD
             ========================================================================= */}
          {activeTab === 'performance' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* RAM & Memory Health Telemetry Card */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border-2 border-emerald-500/30 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        RAM & Memory Optimizer
                      </h4>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400">
                        Zero phone lag · Cache purge engine
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                      {(solarState.ramUsageMb / 1024).toFixed(2)} GB / {(solarState.maxRamMb / 1024).toFixed(1)} GB
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {Math.round((solarState.ramUsageMb / solarState.maxRamMb) * 100)}% Used
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.round((solarState.ramUsageMb / solarState.maxRamMb) * 100))}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    System Cache: {Math.max(120, Math.round(solarState.ramUsageMb * 0.35))} MB Purgeable
                  </span>

                  <button
                    onClick={() => {
                      if (onBoostRAM) {
                        onBoostRAM();
                      } else {
                        onUpdateSolarState({
                          ramUsageMb: Math.max(720, Math.round(solarState.ramUsageMb * 0.55)),
                        });
                      }
                      showToast('Purged 1,180 MB cached memory! SolOS running fast & lag-free ⚡');
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Boost RAM & Clean Cache</span>
                  </button>
                </div>
              </div>

              {/* Performance Mode Selector */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Performance & Frame Rate Mode
                </span>

                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    {
                      id: 'ultra' as PerformanceMode,
                      name: 'Ultra Speed',
                      fps: '120 Hz',
                      desc: 'Full 3D parallax, caustics, and deep 32px liquid glass',
                      color: 'border-cyan-500 text-cyan-600 dark:text-cyan-400',
                    },
                    {
                      id: 'balanced' as PerformanceMode,
                      name: 'Balanced',
                      fps: '60 Hz',
                      desc: 'Optimized iOS glass rendering for everyday usage',
                      color: 'border-amber-500 text-amber-600 dark:text-amber-400',
                    },
                    {
                      id: 'eco' as PerformanceMode,
                      name: 'Eco Saver',
                      fps: 'Low Power',
                      desc: 'Lightweight, minimal GPU blur, zero animations for old phones',
                      color: 'border-emerald-500 text-emerald-600 dark:text-emerald-400',
                    },
                  ].map((perf) => {
                    const isSelected = solarState.performanceMode === perf.id;
                    return (
                      <button
                        key={perf.id}
                        onClick={() => {
                          solarSound.playTap(solarState.soundEnabled);
                          onUpdateSolarState({
                            performanceMode: perf.id,
                            batterySaver: perf.id === 'eco',
                            glassBlur: perf.id === 'eco' ? 8 : perf.id === 'ultra' ? 32 : 24,
                            parallaxEnabled: perf.id !== 'eco',
                          });
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-28 ${
                          isSelected
                            ? `${perf.color} ring-2 ring-emerald-400/40 bg-white dark:bg-zinc-800 shadow-md scale-[1.02]`
                            : 'border-slate-200 dark:border-white/10 bg-white/60 dark:bg-zinc-800/60 hover:bg-white text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-xs">{perf.name}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-slate-100 dark:bg-zinc-700">
                            {perf.fps}
                          </span>
                        </div>
                        <p className="text-[9px] opacity-80 leading-relaxed line-clamp-2">
                          {perf.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lightweight Battery Preservation Toggles */}
              <div className="glass-panel dark:glass-widget rounded-3xl p-4 border border-slate-200/80 dark:border-white/10 space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Battery & Resource Preservation
                </span>

                <div className="space-y-2.5">
                  {/* Battery Saver Mode */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100/70 dark:bg-zinc-800/50">
                    <div className="flex items-center gap-2">
                      <BatteryCharging className="w-4 h-4 text-emerald-500" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Battery Saver Mode (Low Power)
                        </div>
                        <div className="text-[9px] text-slate-500 dark:text-slate-400">
                          Reduces glass blur and pauses heavy keyframe animations
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        solarSound.playTap(solarState.soundEnabled);
                        onUpdateSolarState({
                          batterySaver: !solarState.batterySaver,
                          performanceMode: !solarState.batterySaver ? 'eco' : 'balanced',
                        });
                      }}
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                        solarState.batterySaver
                          ? 'bg-emerald-500 justify-end'
                          : 'bg-slate-300 dark:bg-zinc-700 justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                    </button>
                  </div>

                  {/* Reduce Motion */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100/70 dark:bg-zinc-800/50">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-cyan-500" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Reduce Motion
                        </div>
                        <div className="text-[9px] text-slate-500 dark:text-slate-400">
                          Disables 3D gyroscope parallax tilt for instant screen responses
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        solarSound.playTap(solarState.soundEnabled);
                        onUpdateSolarState({ reduceMotion: !solarState.reduceMotion });
                      }}
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                        solarState.reduceMotion
                          ? 'bg-emerald-500 justify-end'
                          : 'bg-slate-300 dark:bg-zinc-700 justify-start'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 100% Ad-Free & Non-Intrusive Privacy Shield Card */}
              <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-emerald-500/10 border-2 border-emerald-500/40 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-xs text-slate-900 dark:text-white">
                        SolOS 100% Ad-Free Guarantee
                      </h4>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400">
                        Zero popups · Zero fullscreen ads · Zero trackers
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-xs">
                    VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-white/70 dark:bg-zinc-800/80 border border-white/60 dark:border-white/10">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs block">
                      0 Popups
                    </span>
                    <span className="text-[9px] text-slate-500">Uninterrupted UX</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/70 dark:bg-zinc-800/80 border border-white/60 dark:border-white/10">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs block">
                      0 Fullscreen Ads
                    </span>
                    <span className="text-[9px] text-slate-500">Non-Intrusive</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/70 dark:bg-zinc-800/80 border border-white/60 dark:border-white/10">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs block">
                      100% Private
                    </span>
                    <span className="text-[9px] text-slate-500">No telemetry</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: SYSTEM FONTS & TYPOGRAPHY
             ========================================================================= */}
          {activeTab === 'fonts' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* System Font Family Picker */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  System-Wide Font Family
                </span>
                <div className="space-y-2">
                  {SYSTEM_FONTS.map((font) => {
                    const isSelected = solarState.systemFont === font.id;
                    return (
                      <button
                        key={font.id}
                        onClick={() => {
                          solarSound.playTap(solarState.soundEnabled);
                          onUpdateSolarState({ systemFont: font.id });
                        }}
                        className={`w-full p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500 ring-2 ring-amber-400/40 shadow-sm'
                            : 'bg-white/60 dark:bg-zinc-800/60 border-slate-200/80 dark:border-white/10 hover:bg-white'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="font-bold text-sm text-slate-900 dark:text-white"
                              style={{ fontFamily: font.fontFamily }}
                            >
                              {font.name}
                            </span>
                          </div>
                          <p
                            className="text-xs text-amber-700 dark:text-amber-400 mt-1"
                            style={{ fontFamily: font.fontFamily }}
                          >
                            {font.sample}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {font.desc}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Size Scale */}
              <div className="glass-panel dark:glass-widget rounded-3xl p-4 border border-slate-200/80 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    System Text Size Scale
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-md">
                    {FONT_SIZES.find((s) => s.id === solarState.systemFontSize)?.scale! * 100}%
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {FONT_SIZES.map((size) => {
                    const isSelected = solarState.systemFontSize === size.id;
                    return (
                      <button
                        key={size.id}
                        onClick={() => {
                          solarSound.playTap(solarState.soundEnabled);
                          onUpdateSolarState({ systemFontSize: size.id });
                        }}
                        className={`py-2 px-1 rounded-xl text-center border transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-white border-amber-600 shadow-sm font-bold'
                            : 'bg-white/60 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 text-xs'
                        }`}
                      >
                        <div className="text-[11px] font-semibold">{size.label}</div>
                        <div className="text-[9px] opacity-75 mt-0.5">{size.scale * 100}%</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Color / Accent Tint */}
              <div className="glass-panel dark:glass-widget rounded-3xl p-4 border border-slate-200/80 dark:border-white/10 space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Text & Accent Color Tint
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {TEXT_COLORS.map((tc) => {
                    const isSelected = solarState.systemTextColor === tc.id;
                    return (
                      <button
                        key={tc.id}
                        onClick={() => {
                          solarSound.playTap(solarState.soundEnabled);
                          onUpdateSolarState({ systemTextColor: tc.id });
                        }}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-white dark:bg-zinc-800 border-amber-500 ring-2 ring-amber-400/40 shadow-sm font-bold'
                            : 'bg-white/50 dark:bg-zinc-800/50 border-slate-200 dark:border-white/10 hover:bg-white'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full shadow-xs border border-white/60 shrink-0"
                          style={{
                            backgroundColor: tc.hex === 'currentColor' ? '#64748b' : tc.hex,
                          }}
                        />
                        <span className="text-[11px] truncate">{tc.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: UNIVERSAL DARK / LIGHT THEME
             ========================================================================= */}
          {activeTab === 'theme' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* 1-Click Universal Dark / Light / Circadian Theme Switcher */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Universal Theme Mode (1-Click Switch)
                </span>

                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    {
                      id: 'light' as ThemeMode,
                      label: 'Light Mode',
                      icon: Sun,
                      desc: 'Sunlit golden frosted acrylic with crisp specular light',
                      bg: 'from-amber-200 via-orange-100 to-amber-50 text-slate-900',
                    },
                    {
                      id: 'dark' as ThemeMode,
                      label: 'Dark Mode',
                      icon: Moon,
                      desc: 'Smoked obsidian glass with luminous neon glow rims',
                      bg: 'from-zinc-900 via-zinc-950 to-black text-white',
                    },
                    {
                      id: 'auto' as ThemeMode,
                      label: 'Auto Circadian',
                      icon: Clock,
                      desc: 'Syncs automatically with sun arc & daylight hour',
                      bg: 'from-amber-600 via-purple-900 to-indigo-950 text-white',
                    },
                  ].map((mode) => {
                    const isSelected = solarState.themeMode === mode.id;
                    const Icon = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => {
                          solarSound.playTap(solarState.soundEnabled);
                          onUpdateSolarState({ themeMode: mode.id });
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between h-32 relative overflow-hidden ${
                          isSelected
                            ? 'border-amber-500 ring-2 ring-amber-400/50 shadow-md scale-[1.02]'
                            : 'border-slate-200 dark:border-white/10 hover:border-slate-300'
                        }`}
                      >
                        {/* Mode Background Preview */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${mode.bg} opacity-90`}
                        />
                        <div className="relative z-10 flex items-center justify-between w-full">
                          <Icon className="w-5 h-5 text-amber-400" />
                          {isSelected && (
                            <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <div className="relative z-10">
                          <div className="font-bold text-xs leading-tight">
                            {mode.label}
                          </div>
                          <p className="text-[9px] opacity-80 mt-1 line-clamp-2">
                            {mode.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Glass Blur Slider */}
              <div className="glass-panel dark:glass-widget rounded-3xl p-4 border border-slate-200/80 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      Liquid Glass Frosting & Blur
                    </h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-amber-800 dark:text-amber-300">
                    {solarState.glassBlur}px
                  </span>
                </div>

                <input
                  type="range"
                  min="8"
                  max="40"
                  value={solarState.glassBlur}
                  onChange={(e) =>
                    onUpdateSolarState({ glassBlur: Number(e.target.value) })
                  }
                  className="w-full h-2 bg-amber-200/60 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span>8px (Crisp Crystal)</span>
                  <span>40px (Deep Frost)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Done Bar */}
        <div className="p-3 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-zinc-900/80">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Theme: <b>{solarState.themeMode.toUpperCase()}</b></span>
            <span>·</span>
            <span>Pack: <b>{ICON_PACKS.find(p => p.id === solarState.activeIconPack)?.name}</b></span>
          </div>

          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
          >
            Apply & Close
          </button>
        </div>
      </div>

      {/* JSON Import Sub-Modal */}
      {showImportModal && (
        <div
          onClick={() => setShowImportModal(false)}
          className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xl flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl p-4 shadow-2xl border border-white/20 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-amber-500" />
                <span>Import Icon Pack JSON</span>
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="w-6 h-6 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Paste custom icon pack JSON below (including overrides, custom icon URLs, gradients, and app names):
            </p>

            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='{\n  "packId": "neon-cyber",\n  "customAppIcons": {\n    "suntrack": { "glyphEmoji": "⚡", "name": "Sol Sky" }\n  }\n}'
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 font-mono text-[11px] border border-slate-300 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
            />

            {importStatus && (
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                {importStatus}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessImport}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm"
              >
                Apply Pack
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
