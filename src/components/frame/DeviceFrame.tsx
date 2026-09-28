import React, { useState } from 'react';
import {
  Smartphone,
  Monitor,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Sliders,
  Bell,
  Grid,
  Sparkles,
  Palette,
  RefreshCw,
  Layers,
  Lock,
  RotateCcw,
  Power,
  Eye,
} from 'lucide-react';
import { SolarState } from '../../types/launcher';
import { WALLPAPERS_COLLECTION, SYSTEM_FONTS, FONT_SIZES, TEXT_COLORS } from '../../data/customizationData';
import { solarSound } from '../../utils/solarSound';

interface DeviceFrameProps {
  children: React.ReactNode;
  solarState: SolarState;
  wallpaper: string;
  isLocked?: boolean;
  isAOD?: boolean;
  onSelectWallpaper: (wp: string) => void;
  onUpdateSunPosition: (pos: number) => void;
  onToggleSound: () => void;
  onTriggerNotifications: () => void;
  onTriggerControlCenter: () => void;
  onTriggerAppDrawer: () => void;
  onTriggerIconResizer?: () => void;
  onTriggerVisualCustomizer?: (tab?: 'icons' | 'wallpapers' | 'system' | 'lockscreen' | 'aod' | 'boot' | 'fonts' | 'theme') => void;
  onToggleThemeMode?: () => void;
  onLockPhone?: () => void;
  onUnlockPhone?: () => void;
  onRebootPhone?: () => void;
  onEnterAOD?: () => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  solarState,
  wallpaper,
  isLocked = false,
  isAOD = false,
  onSelectWallpaper,
  onUpdateSunPosition,
  onToggleSound,
  onTriggerNotifications,
  onTriggerControlCenter,
  onTriggerAppDrawer,
  onTriggerIconResizer,
  onTriggerVisualCustomizer,
  onToggleThemeMode,
  onLockPhone,
  onUnlockPhone,
  onRebootPhone,
  onEnterAOD,
}) => {
  const [deviceBezelEnabled, setDeviceBezelEnabled] = useState(true);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  // Calculate is Dark Mode active
  const isDarkMode =
    solarState.themeMode === 'dark' ||
    (solarState.themeMode === 'auto' &&
      (solarState.sunPosition > 82 || solarState.sunPosition < 15));

  // Active Font & Styling Variables
  const activeFont = SYSTEM_FONTS.find((f) => f.id === solarState.systemFont) || SYSTEM_FONTS[0];
  const activeScale = FONT_SIZES.find((s) => s.id === solarState.systemFontSize)?.scale || 1.0;
  const activeColorObj = TEXT_COLORS.find((c) => c.id === solarState.systemTextColor);
  const activeTextColor = activeColorObj?.hex !== 'currentColor' ? activeColorObj?.hex : undefined;

  // Track cursor for 3D parallax tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!solarState.parallaxEnabled || solarState.batterySaver || solarState.reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;
    setParallaxOffset({
      x: xRatio * 25 * solarState.parallaxIntensity,
      y: yRatio * 25 * solarState.parallaxIntensity,
    });
  };

  const handleMouseLeave = () => {
    setParallaxOffset({ x: 0, y: 0 });
  };

  // Render rich dynamic wallpapers with Live motion, 3D Parallax, and Circadian shifts
  const renderWallpaperLayers = () => {
    const sunRatio = solarState.sunPosition / 100;

    switch (wallpaper) {
      // 1. Live Solar Flare Waves
      case 'live-solar-flare':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-amber-600 via-orange-600 to-amber-950">
            <div
              className="absolute -top-10 -left-10 w-[140%] h-[140%] rounded-full bg-radial from-yellow-300/40 via-amber-500/30 to-transparent blur-3xl animate-live-wave pointer-events-none"
              style={{
                transform: `translate(${parallaxOffset.x * 0.8}px, ${parallaxOffset.y * 0.8}px)`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-amber-300/20" />
          </div>
        );

      // 2. Live Bioluminescent Aurora
      case 'live-aurora':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-[#021814] via-[#042f2c] to-[#011411]">
            <div
              className="absolute inset-x-0 -top-10 h-3/4 rounded-full bg-gradient-to-r from-emerald-400/35 via-cyan-400/40 to-teal-300/25 blur-2xl animate-live-aurora"
              style={{
                transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`,
              }}
            />
            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        );

      // 3. Live Prismatic Glass Caustics
      case 'live-caustics':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-br from-sky-200 via-indigo-100 to-rose-200 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-950">
            <div
              className="absolute inset-0 opacity-40 animate-live-caustics pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(254,215,170,0.5) 45%, rgba(186,230,253,0.3) 70%, transparent 100%)',
              }}
            />
          </div>
        );

      // 4. Live Cosmic Solar Dust
      case 'live-starfield':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-[#09090b] via-[#1c1917] to-[#291707]">
            {/* Drifting warm dust particles */}
            <div className="absolute bottom-10 left-12 w-2 h-2 rounded-full bg-amber-400/80 blur-[1px] animate-dust-1" />
            <div className="absolute bottom-20 right-14 w-3 h-3 rounded-full bg-yellow-300/70 blur-[1.5px] animate-dust-2" />
            <div className="absolute bottom-32 left-28 w-2 h-2 rounded-full bg-orange-400/80 blur-[1px] animate-dust-3" />
            <div className="absolute top-1/3 right-10 w-2.5 h-2.5 rounded-full bg-amber-300/75 blur-[1px] animate-dust-1" />
          </div>
        );

      // 5. 3D Parallax Amber Dunes
      case 'parallax-dunes':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-[#fed7aa] via-[#fdba74] to-[#c2410c]">
            {/* Background Sun Layer */}
            <div
              className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-white shadow-[0_0_60px_rgba(251,191,36,0.8)]"
              style={{
                top: `${12 + (1 - sunRatio) * 15}%`,
                left: `${20 + sunRatio * 40}%`,
                transform: `translate(${parallaxOffset.x * 0.3}px, ${parallaxOffset.y * 0.3}px)`,
                transition: 'transform 0.1s ease-out',
              }}
            />
            {/* Midground Ridge */}
            <div
              className="absolute -bottom-10 -inset-x-10 h-72 rounded-[100%] bg-gradient-to-t from-[#9a3412] to-[#ea580c] opacity-80"
              style={{
                transform: `translate(${parallaxOffset.x * 0.7}px, ${parallaxOffset.y * 0.7}px) scaleX(1.3)`,
              }}
            />
            {/* Foreground Dunes */}
            <div
              className="absolute -bottom-24 -inset-x-14 h-64 rounded-[100%] bg-gradient-to-t from-[#431407] to-[#7c2d12]"
              style={{
                transform: `translate(${parallaxOffset.x * 1.2}px, ${parallaxOffset.y * 1.2}px) scaleX(1.4)`,
              }}
            />
          </div>
        );

      // 6. 3D Parallax Cosmic Nebula
      case 'parallax-nebula':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#311042]">
            <div
              className="absolute top-10 left-8 w-60 h-60 rounded-full bg-indigo-500/25 blur-3xl"
              style={{
                transform: `translate(${parallaxOffset.x * 0.5}px, ${parallaxOffset.y * 0.5}px)`,
              }}
            />
            <div
              className="absolute top-1/3 right-4 w-52 h-52 rounded-full bg-rose-500/30 blur-3xl"
              style={{
                transform: `translate(${parallaxOffset.x * 0.9}px, ${parallaxOffset.y * 0.9}px)`,
              }}
            />
          </div>
        );

      // 7. 3D Parallax Prisms
      case 'parallax-prisms':
        return (
          <div className="absolute inset-0 overflow-hidden pointer-events-none bg-gradient-to-br from-slate-200 via-sky-100 to-indigo-200 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
            <div
              className="absolute top-24 left-10 w-40 h-40 border border-white/60 dark:border-white/10 rounded-3xl bg-white/20 dark:bg-white/5 backdrop-blur-md rotate-12 shadow-xl"
              style={{
                transform: `translate(${parallaxOffset.x * 0.6}px, ${parallaxOffset.y * 0.6}px) rotate(14deg)`,
              }}
            />
            <div
              className="absolute bottom-28 right-8 w-36 h-36 border border-white/60 dark:border-white/10 rounded-3xl bg-white/20 dark:bg-white/5 backdrop-blur-md -rotate-6 shadow-xl"
              style={{
                transform: `translate(${parallaxOffset.x * 1.1}px, ${parallaxOffset.y * 1.1}px) rotate(-8deg)`,
              }}
            />
          </div>
        );

      // 8. AMOLED Obsidian
      case 'amoled-obsidian':
        return (
          <div className="absolute inset-0 pointer-events-none bg-black flex flex-col justify-end">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_20px_#f59e0b] mb-28" />
          </div>
        );

      // 9. Minimal Silk
      case 'minimal-silk':
        return (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950">
            <div className="absolute inset-0 bg-radial from-white/10 to-transparent blur-2xl" />
          </div>
        );

      // 10. Botanical Emerald
      case 'botanical-emerald':
        return (
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#022c22] via-[#064e3b] to-[#011a14]">
            <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-emerald-400/20 blur-3xl" />
          </div>
        );

      // 11. Circadian Sun Engine
      case 'circadian-dynamic':
      case 'golden':
      default:
        if (sunRatio < 0.2) {
          // Dawn
          return (
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#bae6fd] via-[#fed7aa] to-[#fb923c]" />
          );
        } else if (sunRatio < 0.65) {
          // High Noon / Daylight
          return (
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#fffbeb] via-[#fde68a] to-[#f59e0b]" />
          );
        } else if (sunRatio < 0.85) {
          // Golden Hour
          return (
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#ffedd5] via-[#fb923c] to-[#c2410c]" />
          );
        } else {
          // Twilight / Dusk
          return (
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#fed7aa] via-[#ea580c] to-[#1e1b4b]" />
          );
        }
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-between p-2 sm:p-4 relative overflow-hidden transition-colors duration-300 font-sans ${
        isDarkMode
          ? 'bg-gradient-to-br from-zinc-950 via-zinc-900 to-stone-950 text-slate-100 dark'
          : 'bg-gradient-to-br from-amber-100/90 via-orange-50 to-amber-200/80 text-slate-800'
      }`}
    >
      {/* Ambient background decorative light spots */}
      <div
        className={`absolute top-10 left-10 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
          isDarkMode ? 'bg-indigo-900/20' : 'bg-amber-300/30'
        }`}
      />
      <div
        className={`absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
          isDarkMode ? 'bg-purple-900/15' : 'bg-orange-300/25'
        }`}
      />

      {/* Top Test Bench Controls Header */}
      <div className="w-full max-w-4xl z-30 mb-2 glass-panel rounded-2xl px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2.5 shadow-sm border border-white/80 dark:border-white/10">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-white shadow-sm font-bold text-xs">
            ☀️
          </div>
          <div>
            <h1 className="font-display font-bold text-xs text-slate-900 dark:text-white leading-none">
              Sunny ☀️ UI Mobile Launcher
            </h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              3D Refractive Glassmorphism & Visual Studio
            </p>
          </div>
        </div>

        {/* Center: Live Sun Arc Scrubber & Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Sun Hour Slider */}
          <div className="flex items-center gap-1.5 bg-white/60 dark:bg-zinc-800/80 px-2.5 py-1 rounded-xl border border-white/80 dark:border-white/10 text-xs">
            <Sun
              className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-spin"
              style={{ animationDuration: '24s' }}
            />
            <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px] hidden sm:inline">
              Sun:
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={solarState.sunPosition}
              onChange={(e) => onUpdateSunPosition(Number(e.target.value))}
              className="w-16 sm:w-24 h-1.5 bg-amber-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="font-mono text-[10px] font-bold text-amber-900 dark:text-amber-300 w-7">
              {Math.round(solarState.sunPosition)}%
            </span>
          </div>

          {/* 1-Click Universal Dark / Light Mode Switcher */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              if (onToggleThemeMode) {
                onToggleThemeMode();
              }
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-xs font-semibold shadow-2xs active:scale-95 transition-all ${
              isDarkMode
                ? 'bg-zinc-800 text-amber-400 border-zinc-700 hover:bg-zinc-700'
                : 'bg-white text-slate-800 border-slate-200 hover:bg-amber-50'
            }`}
            title="Toggle Universal Dark / Light / Auto Mode"
          >
            {isDarkMode ? <Moon className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
            <span className="text-[11px] hidden md:inline">
              {solarState.themeMode === 'auto' ? 'Auto Theme' : isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>

          {/* Master Visual Customizer (Icon Packs, Wallpapers, Fonts Studio) */}
          {onTriggerVisualCustomizer && (
            <button
              onClick={() => onTriggerVisualCustomizer('icons')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 active:scale-95 transition-all text-xs font-semibold shadow-xs"
              title="Open UI & Visual Customizer (Icon Packs, Wallpapers, Fonts)"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden sm:inline">Customize UI</span>
            </button>
          )}

          {/* Quick iOS Control Center Header Pill */}
          <button
            onClick={onTriggerControlCenter}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 active:scale-95 transition-all text-xs font-semibold shadow-sm"
            title="Open iOS Control Center"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 dark:text-amber-500" />
            <span className="text-[11px] hidden sm:inline">Control Center</span>
          </button>

          {/* Quick Lock Screen Toggle Button */}
          {onLockPhone && (
            <button
              onClick={() => {
                solarSound.playTap(solarState.soundEnabled);
                if (isLocked) {
                  if (onUnlockPhone) onUnlockPhone();
                } else {
                  onLockPhone();
                }
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition-all text-xs font-semibold shadow-sm active:scale-95 ${
                isLocked
                  ? 'bg-amber-500 text-white'
                  : 'bg-white/70 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border border-white/80 dark:border-white/10 hover:bg-white'
              }`}
              title={isLocked ? 'Phone is Locked (Click to Unlock)' : 'Lock Device Screen'}
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden md:inline">{isLocked ? 'Locked' : 'Lock'}</span>
            </button>
          )}

          {/* Quick AOD Mode Button */}
          {onEnterAOD && (
            <button
              onClick={() => {
                solarSound.playTap(solarState.soundEnabled);
                onEnterAOD();
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded-xl transition-all text-xs font-semibold shadow-sm active:scale-95 ${
                isAOD
                  ? 'bg-zinc-950 text-amber-400 border border-amber-400/50'
                  : 'bg-white/70 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border border-white/80 dark:border-white/10 hover:bg-white'
              }`}
              title="Enter AMOLED Always-On Display"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[11px] hidden lg:inline">AOD</span>
            </button>
          )}

          {/* Cold Reboot Button */}
          {onRebootPhone && (
            <button
              onClick={() => {
                solarSound.playTap(solarState.soundEnabled);
                onRebootPhone();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white/70 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border border-white/80 dark:border-white/10 hover:bg-white active:scale-95 transition-all text-xs font-semibold shadow-sm"
              title="Simulate Cold Reboot (Boot Animation)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-[11px] hidden lg:inline">Reboot</span>
            </button>
          )}
        </div>

        {/* Right Controls: Wallpaper & Frame Toggle */}
        <div className="flex items-center gap-1.5">
          {/* Wallpaper Select */}
          <select
            value={wallpaper}
            onChange={(e) => onSelectWallpaper(e.target.value)}
            className="px-2 py-1 bg-white/70 dark:bg-zinc-800/80 border border-white/80 dark:border-white/10 rounded-xl text-[11px] font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            {WALLPAPERS_COLLECTION.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          {/* Device Frame Toggle */}
          <button
            onClick={() => setDeviceBezelEnabled(!deviceBezelEnabled)}
            className={`p-1.5 rounded-xl border transition-all ${
              deviceBezelEnabled
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-white/70 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border-white/80 dark:border-white/10'
            }`}
            title="Toggle Smartphone Bezel Frame"
          >
            {deviceBezelEnabled ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => onToggleSound()}
            className={`p-1.5 rounded-xl border transition-all ${
              solarState.soundEnabled
                ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                : 'bg-white/70 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border-white/80 dark:border-white/10'
            }`}
            title="Toggle Solar Sound Synthesizer"
          >
            {solarState.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Device Canvas Wrapper */}
      <div className="flex-1 flex items-center justify-center w-full z-10 py-1">
        {deviceBezelEnabled ? (
          /* Realistic Titanium Gold Smartphone Bezel */
          <div
            className={`relative w-full max-w-[395px] h-[810px] max-h-[92vh] rounded-[3.2rem] p-3 shadow-[0_25px_70px_-15px_rgba(180,83,9,0.35),0_15px_30px_-10px_rgba(0,0,0,0.3)] border-2 flex flex-col transition-all duration-300 ${
              isDarkMode
                ? 'bg-gradient-to-b from-[#27272a] via-[#18181b] to-[#09090b] border-[#3f3f46]'
                : 'bg-gradient-to-b from-[#e5d5be] via-[#cbb191] to-[#a38662] border-[#fff3e0]'
            }`}
          >
            {/* Side Hardware Buttons: Volume Up/Down & Power */}
            <div
              className={`absolute -left-[5px] top-28 w-[3px] h-11 rounded-l-sm ${
                isDarkMode ? 'bg-zinc-700' : 'bg-[#b99873]'
              }`}
            />
            <div
              className={`absolute -left-[5px] top-42 w-[3px] h-11 rounded-l-sm ${
                isDarkMode ? 'bg-zinc-700' : 'bg-[#b99873]'
              }`}
            />
            {/* Interactive Physical Power / Lock Button */}
            <button
              onClick={() => {
                solarSound.playTap(solarState.soundEnabled);
                if (isLocked) {
                  if (onUnlockPhone) onUnlockPhone();
                } else {
                  if (onLockPhone) onLockPhone();
                }
              }}
              className={`absolute -right-[6px] top-32 w-[5px] hover:w-[7px] h-16 rounded-r-sm cursor-pointer transition-all active:scale-95 shadow-sm ${
                isLocked
                  ? 'bg-amber-400 animate-pulse'
                  : isDarkMode
                  ? 'bg-zinc-600 hover:bg-amber-400'
                  : 'bg-[#b99873] hover:bg-amber-600'
              }`}
              title={isLocked ? 'Phone is Locked (Click power button to unlock)' : 'Power Button (Click to lock screen)'}
            />

            {/* Inner Glass Display Viewport with custom fonts and parallax tracker */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className={`relative w-full h-full rounded-[2.6rem] overflow-hidden flex flex-col justify-between border shadow-inner ${
                isDarkMode ? 'border-white/10 dark' : 'border-white/30'
              } ${solarState.batterySaver ? 'battery-saver' : ''} ${
                solarState.reduceMotion ? 'reduce-motion' : ''
              }`}
              style={{
                fontFamily: activeFont.fontFamily,
                zoom: activeScale !== 1.0 ? activeScale : undefined,
                color: activeTextColor,
              }}
            >
              {/* Dynamic Wallpaper Layers */}
              {renderWallpaperLayers()}

              {/* Dynamic Sunlight Caustic Highlight layer */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                style={{
                  background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%, rgba(245,158,11,0.06) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 40%, transparent 60%, rgba(245,158,11,0.12) 100%)',
                  opacity: 0.6 + (solarState.brightness / 100) * 0.4,
                }}
              />

              {/* Application Content */}
              {children}
            </div>
          </div>
        ) : (
          /* Full Viewport Canvas Mode */
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`w-full max-w-md h-[90vh] rounded-3xl overflow-hidden flex flex-col justify-between border shadow-2xl relative ${
              isDarkMode ? 'border-white/10 dark' : 'border-white/60'
            }`}
            style={{
              fontFamily: activeFont.fontFamily,
              color: activeTextColor,
            }}
          >
            {renderWallpaperLayers()}
            {children}
          </div>
        )}
      </div>

      {/* Bottom Quick Trigger Hints for Desktop Evaluators */}
      <div className="w-full max-w-lg mt-2 text-center text-[11px] text-slate-600 dark:text-slate-400 font-medium flex items-center justify-center gap-3 sm:gap-4 z-20">
        <button
          onClick={onTriggerNotifications}
          className="flex items-center gap-1 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
        >
          <Bell className="w-3 h-3 text-amber-600" />
          <span>Notifications</span>
        </button>
        <span>·</span>
        <button
          onClick={onTriggerControlCenter}
          className="flex items-center gap-1 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
        >
          <Sliders className="w-3 h-3 text-amber-600" />
          <span>Control Center</span>
        </button>
        <span>·</span>
        <button
          onClick={onTriggerAppDrawer}
          className="flex items-center gap-1 hover:text-amber-800 dark:hover:text-amber-300 transition-colors"
        >
          <Grid className="w-3 h-3 text-amber-600" />
          <span>App Drawer</span>
        </button>
        {onTriggerVisualCustomizer && (
          <>
            <span>·</span>
            <button
              onClick={() => onTriggerVisualCustomizer('icons')}
              className="flex items-center gap-1 hover:text-amber-800 dark:hover:text-amber-300 transition-colors font-bold text-amber-700 dark:text-amber-400"
            >
              <Palette className="w-3 h-3 text-amber-600" />
              <span>Icon Packs & Styles</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

