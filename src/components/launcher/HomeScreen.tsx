import React, { useState, useRef } from 'react';
import { AppDefinition, SolarState, NoteItem, SoundPackId } from '../../types/launcher';
import { AppIcon3D } from '../icons/AppIcon3D';
import { SolarWeatherWidget } from '../widgets/SolarWeatherWidget';
import { SolarMusicWidget } from '../widgets/SolarMusicWidget';
import { SolarBatteryWidget } from '../widgets/SolarBatteryWidget';
import { SolarNotesWidget } from '../widgets/SolarNotesWidget';
import { ThemeStudioWidget } from '../widgets/ThemeStudioWidget';
import { LauncherContextMenu } from './LauncherContextMenu';
import { Calendar, ChevronRight, Sparkles, Compass, Shield, Heart, Palette } from 'lucide-react';
import { solarSound } from '../../utils/solarSound';

interface HomeScreenProps {
  apps: AppDefinition[];
  solarState: SolarState;
  notes: NoteItem[];
  currentWallpaper?: string;
  onLaunchApp: (app: AppDefinition) => void;
  onUpdateSunPosition: (pos: number) => void;
  onToggleSolarCharge: () => void;
  onOpenAppById: (appId: string) => void;
  onOpenAppDrawer?: () => void;
  onOpenIconResizer?: () => void;
  onOpenVisualCustomizer?: (tab?: 'store' | 'diy' | 'ai' | 'sounds' | 'icons' | 'wallpapers' | 'system' | 'lockscreen' | 'aod' | 'boot' | 'fonts' | 'theme') => void;
  onOpenThemeStudioTab?: (tab: 'store' | 'diy' | 'ai' | 'sounds') => void;
  onUpdateSoundPack?: (packId: SoundPackId) => void;
  onRestoreDefaults?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  apps,
  solarState,
  notes,
  currentWallpaper = 'golden',
  onLaunchApp,
  onUpdateSunPosition,
  onToggleSolarCharge,
  onOpenAppById,
  onOpenAppDrawer,
  onOpenIconResizer,
  onOpenVisualCustomizer,
  onOpenThemeStudioTab,
  onUpdateSoundPack,
  onRestoreDefaults,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showDesktopMenu, setShowDesktopMenu] = useState(false);
  const longPressTimerRef = useRef<any>(null);

  const isDarkMode =
    solarState.themeMode === 'dark' ||
    (solarState.themeMode === 'auto' &&
      (solarState.sunPosition > 82 || solarState.sunPosition < 15));

  // Split apps for pages
  const page0Apps = apps.slice(0, 8); // Top 8 apps on home screen
  const page1Apps = apps.slice(8, 16); // Next 8 apps on page 2

  const switchPage = (pageIdx: number) => {
    solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
    setCurrentPage(pageIdx);
  };

  // Long press handler on desktop background
  const handleTouchStartBg = () => {
    longPressTimerRef.current = setTimeout(() => {
      solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
      setShowDesktopMenu(true);
    }, 550);
  };

  const handleTouchEndBg = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleOpenStudio = (tab: 'store' | 'diy' | 'ai' | 'sounds') => {
    if (onOpenThemeStudioTab) {
      onOpenThemeStudioTab(tab);
    } else if (onOpenVisualCustomizer) {
      onOpenVisualCustomizer(tab as any);
    } else {
      onOpenAppById('solarstudio');
    }
  };

  return (
    <div
      onTouchStart={handleTouchStartBg}
      onTouchEnd={handleTouchEndBg}
      onMouseDown={handleTouchStartBg}
      onMouseUp={handleTouchEndBg}
      onContextMenu={(e) => {
        e.preventDefault();
        setShowDesktopMenu(true);
      }}
      className="flex-1 w-full overflow-y-auto no-scrollbar px-4 pt-1 pb-3 flex flex-col justify-between"
    >
      {/* Page Carousel Container */}
      <div className="flex-1 w-full transition-all duration-300">
        {currentPage === 0 && (
          <div className="space-y-3.5 animate-in fade-in zoom-in-95 duration-200">
            {/* Hero Solar Weather Sky Arc Widget */}
            <SolarWeatherWidget
              solarState={solarState}
              onUpdateSunPosition={onUpdateSunPosition}
              onOpenWeatherApp={() => onOpenAppById('suntrack')}
            />

            {/* Smart Theme Studio & Creator Widget (Community · DIY · AI · Sounds) */}
            <ThemeStudioWidget
              solarState={solarState}
              currentWallpaper={currentWallpaper}
              onOpenStore={() => handleOpenStudio('store')}
              onOpenDIY={() => handleOpenStudio('diy')}
              onOpenAI={() => handleOpenStudio('ai')}
              onOpenSounds={() => handleOpenStudio('sounds')}
              onUpdateSoundPack={onUpdateSoundPack}
            />

            {/* Twin Glass Widgets: Music & Battery */}
            <div className="grid grid-cols-2 gap-3">
              <SolarMusicWidget
                soundEnabled={solarState.soundEnabled}
                onOpenApp={() => onOpenAppById('solarpulse')}
              />
              <SolarBatteryWidget
                solarState={solarState}
                onToggleSolarCharge={onToggleSolarCharge}
                onOpenApp={() => onOpenAppById('solarenergy')}
              />
            </div>

            {/* iOS 3D App Grid: 4 columns directly on wallpaper */}
            <div className="pt-1 px-1">
              <div className="grid grid-cols-4 gap-y-4 gap-x-2 justify-items-center">
                {page0Apps.map((app) => (
                  <AppIcon3D
                    key={app.id}
                    app={app}
                    customScale={solarState.iconScale}
                    showLabel={solarState.showIconLabels}
                    tiltEnabled={solarState.iconTilt3D}
                    soundEnabled={solarState.soundEnabled}
                    iconPack={solarState.activeIconPack}
                    customOverride={solarState.customAppIcons[app.id]}
                    isDark={isDarkMode}
                    onClick={() => onLaunchApp(app)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPage === 1 && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Daily Solar Schedule & Calendar Card */}
            <div
              onClick={() => onOpenAppById('solarcal')}
              className="glass-widget rounded-[28px] p-4 cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[10px] bg-red-500 text-white flex items-center justify-center font-bold shadow-xs">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
                      Solar Circadian Schedule
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Sunday, Sep 27 · Sunny & Clear
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/40 border border-white/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="font-medium text-slate-800">Golden Hour Photography</span>
                  </div>
                  <span className="font-mono text-[11px] text-amber-800 font-bold">06:20 PM</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/40 border border-white/60 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400" />
                    <span className="font-medium text-slate-800">Sunset Breathwork</span>
                  </div>
                  <span className="font-mono text-[11px] text-orange-800 font-bold">07:45 PM</span>
                </div>
              </div>
            </div>

            {/* Second Batch of 3D Apps directly on wallpaper */}
            <div className="pt-2 px-1">
              <div className="grid grid-cols-4 gap-y-4 gap-x-2 justify-items-center">
                {page1Apps.map((app) => (
                  <AppIcon3D
                    key={app.id}
                    app={app}
                    customScale={solarState.iconScale}
                    showLabel={solarState.showIconLabels}
                    tiltEnabled={solarState.iconTilt3D}
                    soundEnabled={solarState.soundEnabled}
                    iconPack={solarState.activeIconPack}
                    customOverride={solarState.customAppIcons[app.id]}
                    isDark={isDarkMode}
                    onClick={() => onLaunchApp(app)}
                  />
                ))}
              </div>
            </div>

            {/* Quick Sticky Notes Widget */}
            <SolarNotesWidget
              notes={notes}
              soundEnabled={solarState.soundEnabled}
              onOpenNotesApp={() => onOpenAppById('solarnotes')}
            />
          </div>
        )}

        {currentPage === 2 && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Solar Wellness & Breathing Quick Card */}
            <div
              onClick={() => onOpenAppById('solwellness')}
              className="glass-widget rounded-[28px] p-4 cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[10px] bg-pink-500 text-white flex items-center justify-center shadow-xs">
                    <Heart className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
                      Mindfulness & Breath
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Harmonize your pulse with solar daylight
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-semibold">
                  Start 3m
                </span>
              </div>

              {/* Animated breathing ring preview */}
              <div className="w-full h-24 rounded-2xl bg-gradient-to-tr from-pink-100/60 via-amber-100/60 to-white/60 flex items-center justify-center relative overflow-hidden border border-white/60">
                <div className="w-16 h-16 rounded-full bg-pink-300/40 animate-ping absolute" style={{ animationDuration: '4s' }} />
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-400 to-amber-300 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  Inhale
                </div>
              </div>
            </div>

            {/* SunMap & Solar Shade Navigation Preview */}
            <div
              onClick={() => onOpenAppById('solarnav')}
              className="glass-widget rounded-[28px] p-4 cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[10px] bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
                      Maps Navigation
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Walking in 78% tree shade · 24 min to Bluff
                    </p>
                  </div>
                </div>
              </div>

              {/* Topo map graphic simulation */}
              <div className="h-20 w-full rounded-2xl bg-gradient-to-br from-emerald-100 via-teal-50 to-amber-100 p-3 border border-white/60 flex items-center justify-between relative overflow-hidden">
                <div className="text-xs font-medium text-emerald-900">
                  <span className="font-bold">Next Waypoint:</span> Solar Vista Point
                  <div className="text-[10px] text-emerald-700 font-mono mt-0.5">340m · Direct Sunlight Ahead</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Solar Arcade Quick Launch */}
            <div
              onClick={() => onOpenAppById('solararcade')}
              className="glass-widget rounded-[28px] p-4 flex items-center justify-between cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-xs">
                  🎮
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-900" style={{ fontFamily: 'var(--font-display)' }}>
                    Apple Arcade · Solar Flares
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium">
                    High score: 4,820 pts
                  </p>
                </div>
              </div>
              <button className="px-3.5 py-1.5 rounded-full bg-amber-500 text-white text-xs font-semibold shadow-xs">
                Play
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Dots & Quick Access Bar */}
      <div className="flex items-center justify-between px-2 py-1 mt-1">
        {/* Quick App Drawer Trigger */}
        <button
          onClick={() => {
            solarSound.playTap(solarState.soundEnabled);
            if (onOpenAppDrawer) onOpenAppDrawer();
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/40 dark:bg-zinc-800/60 hover:bg-white/70 active:scale-95 text-slate-700 dark:text-slate-200 backdrop-blur-md border border-white/60 dark:border-white/10 transition-all text-[11px] font-semibold shadow-2xs group"
          title="Open App Drawer"
        >
          <span className="text-[10px] transform group-hover:-translate-y-0.5 transition-transform">▲</span>
          <span>Drawer</span>
        </button>

        {/* Pagination Dots Indicator */}
        <div className="flex items-center justify-center gap-1.5">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => switchPage(idx)}
              className={`transition-all duration-300 rounded-full focus:outline-none ${
                currentPage === idx
                  ? 'w-5 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500 shadow-xs'
                  : 'w-1.5 h-1.5 bg-slate-400/50 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {/* Right Action Pills: Themes, Styles & Resizer */}
        <div className="flex items-center gap-1.5">
          {/* Quick Theme Studio & Community Store Trigger */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
              setShowDesktopMenu(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 active:scale-95 text-amber-900 dark:text-amber-200 backdrop-blur-md border border-amber-400/50 transition-all text-[11px] font-bold shadow-2xs"
            title="Theme Studio: DIY, AI & Community Store"
          >
            <span className="text-[10px]">✨</span>
            <span className="text-[10px]">Themes</span>
          </button>

          {onOpenVisualCustomizer && (
            <button
              onClick={() => {
                solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
                onOpenVisualCustomizer();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/40 dark:bg-zinc-800/60 hover:bg-white/70 active:scale-95 text-slate-700 dark:text-slate-200 backdrop-blur-md border border-white/60 dark:border-white/10 transition-all text-[11px] font-semibold shadow-2xs"
              title="Open UI & Visual Customizer"
            >
              <span className="text-[10px]">🎨</span>
              <span className="text-[10px] font-semibold">Styles</span>
            </button>
          )}

          {/* Quick Icon Resizer Trigger */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
              if (onOpenIconResizer) onOpenIconResizer();
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/40 dark:bg-zinc-800/60 hover:bg-white/70 active:scale-95 text-slate-700 dark:text-slate-200 backdrop-blur-md border border-white/60 dark:border-white/10 transition-all text-[11px] font-semibold shadow-2xs"
            title="Open Icon Resizer"
          >
            <span className="text-[10px]">🎚️</span>
            <span className="font-mono text-[10px] text-amber-900 dark:text-amber-300 font-bold">{solarState.iconScale}%</span>
          </button>
        </div>
      </div>

      {/* Desktop Long-Press Context Menu */}
      {showDesktopMenu && (
        <LauncherContextMenu
          solarState={solarState}
          onClose={() => setShowDesktopMenu(false)}
          onOpenStore={() => handleOpenStudio('store')}
          onOpenDIY={() => handleOpenStudio('diy')}
          onOpenAI={() => handleOpenStudio('ai')}
          onOpenSounds={() => handleOpenStudio('sounds')}
          onOpenWallpapers={() => {
            if (onOpenVisualCustomizer) onOpenVisualCustomizer('wallpapers');
          }}
          onOpenIconResizer={() => {
            if (onOpenIconResizer) onOpenIconResizer();
          }}
          onRestoreDefaults={() => {
            if (onRestoreDefaults) onRestoreDefaults();
          }}
        />
      )}
    </div>
  );
};
