import React, { useState, useMemo } from 'react';
import { AppDefinition, AppCategory, SolarState } from '../../types/launcher';
import { AppIcon3D } from '../icons/AppIcon3D';
import {
  Search,
  X,
  Sparkles,
  LayoutGrid,
  List,
  Sliders,
  ChevronRight,
  ArrowUpDown,
  Compass,
  Zap,
  Palette,
} from 'lucide-react';
import { solarSound } from '../../utils/solarSound';

interface AppDrawerProps {
  apps: AppDefinition[];
  solarState: SolarState;
  onClose: () => void;
  onLaunchApp: (app: AppDefinition) => void;
  onOpenIconResizer?: () => void;
  onOpenVisualCustomizer?: (tab?: 'store' | 'diy' | 'ai' | 'sounds' | 'icons' | 'wallpapers' | 'system' | 'lockscreen' | 'aod' | 'boot' | 'fonts' | 'theme') => void;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({
  apps,
  solarState,
  onClose,
  onLaunchApp,
  onOpenIconResizer,
  onOpenVisualCustomizer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<AppCategory>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'name-asc' | 'name-desc' | 'category'>('name-asc');

  const isDarkMode =
    solarState.themeMode === 'dark' ||
    (solarState.themeMode === 'auto' &&
      (solarState.sunPosition > 82 || solarState.sunPosition < 15));

  const categories: AppCategory[] = ['All', 'Solar', 'Media', 'Utilities', 'Life'];

  // Frequently used / Solar top picks
  const quickPicks = useMemo(() => {
    return apps.filter((a) => ['suntrack', 'solarcam', 'solarpulse', 'solarcalc'].includes(a.id));
  }, [apps]);

  // Filter and sort apps
  const filteredApps = useMemo(() => {
    let result = apps.filter((app) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        app.name.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === 'All' || app.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    return result.sort((a, b) => {
      if (sortOrder === 'name-asc') return a.name.localeCompare(b.name);
      if (sortOrder === 'name-desc') return b.name.localeCompare(a.name);
      if (sortOrder === 'category') return a.category.localeCompare(b.category);
      return 0;
    });
  }, [apps, searchQuery, activeCategory, sortOrder]);

  const handleCategorySelect = (cat: AppCategory) => {
    solarSound.playTap(solarState.soundEnabled);
    setActiveCategory(cat);
  };

  const handleToggleViewMode = () => {
    solarSound.playTap(solarState.soundEnabled);
    setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'));
  };

  const handleCycleSort = () => {
    solarSound.playTap(solarState.soundEnabled);
    setSortOrder((prev) => {
      if (prev === 'name-asc') return 'name-desc';
      if (prev === 'name-desc') return 'category';
      return 'name-asc';
    });
  };

  return (
    <div
      onClick={onClose}
      className="absolute inset-0 z-40 bg-slate-950/60 backdrop-blur-2xl flex flex-col justify-end animate-in fade-in duration-200 select-none"
    >
      {/* Slide-up Glass Sheet Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-h-[92%] h-[92%] bg-white/85 backdrop-blur-3xl rounded-t-[34px] border-t border-x border-white/90 p-4.5 shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden"
      >
        {/* Grab Handle */}
        <div
          onClick={onClose}
          className="w-12 h-1.5 bg-slate-300 hover:bg-slate-400 active:scale-95 rounded-full mx-auto mb-3 cursor-pointer transition-all shrink-0"
          title="Dismiss Drawer"
        />

        {/* Drawer Header with Title & Action Controls */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-md font-bold text-sm">
              ☀️
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-slate-900 leading-tight">
                App Drawer & Library
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">
                {apps.length} Built-in Solar Apps
              </p>
            </div>
          </div>

          {/* Header Action Tools */}
          <div className="flex items-center gap-1.5">
            {/* Quick Visual Customizer Studio Button */}
            {onOpenVisualCustomizer && (
              <button
                onClick={() => {
                  solarSound.playTap(solarState.soundEnabled);
                  onOpenVisualCustomizer();
                }}
                className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white active:scale-95 transition-all text-xs font-semibold flex items-center gap-1 shadow-xs"
                title="Open Icon Packs & Visual Studio"
              >
                <Palette className="w-3.5 h-3.5" />
                <span className="text-[10px]">Styles</span>
              </button>
            )}

            {/* Quick Icon Resizer Trigger */}
            {onOpenIconResizer && (
              <button
                onClick={() => {
                  solarSound.playTap(solarState.soundEnabled);
                  onOpenIconResizer();
                }}
                className="px-2.5 py-1 rounded-xl bg-amber-100/80 hover:bg-amber-200/80 active:scale-95 text-amber-900 border border-amber-300/80 transition-all text-xs font-semibold flex items-center gap-1 shadow-xs"
                title="Open Icon Resizer"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-[10px]">Resize</span>
              </button>
            )}

            {/* Sort Toggle */}
            <button
              onClick={handleCycleSort}
              className="p-1.5 rounded-xl bg-white/70 hover:bg-white active:scale-95 text-slate-700 border border-white/80 transition-all text-xs"
              title={`Sorted by: ${sortOrder}`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>

            {/* View Mode Toggle (Grid / List) */}
            <button
              onClick={handleToggleViewMode}
              className="p-1.5 rounded-xl bg-white/70 hover:bg-white active:scale-95 text-slate-700 border border-white/80 transition-all text-xs"
              title={`Switch to ${viewMode === 'grid' ? 'List View' : 'Grid View'}`}
            >
              {viewMode === 'grid' ? (
                <List className="w-3.5 h-3.5" />
              ) : (
                <LayoutGrid className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Close Drawer Button */}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-200/80 hover:bg-slate-300 active:scale-95 flex items-center justify-center text-slate-600 transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Search Bar with Sound Pack Keystroke Synthesizer */}
        <div className="relative mb-2 shrink-0">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search apps by name, utility, or tag..."
              value={searchQuery}
              onKeyDown={(e) => {
                solarSound.playTypingSound(
                  solarState.soundEnabled && (solarState.typingSoundsEnabled ?? true),
                  solarState.activeSoundPack,
                  e.key
                );
              }}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-white/80 border border-white/90 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Theme Studio Quick Banner */}
        <div className="flex items-center justify-between p-2 mb-2 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-purple-500/15 border border-amber-500/30 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-xs">
              ✨
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-900 leading-none">Theme Studio & DIY Maker</div>
              <div className="text-[9px] text-slate-500">Community Store · AI Stylist · Sound Packs</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
                onClose();
                if (onOpenVisualCustomizer) onOpenVisualCustomizer('diy' as any);
              }}
              className="px-2 py-0.8 rounded-lg bg-amber-500 text-white text-[10px] font-bold active:scale-95 shadow-xs"
            >
              DIY Maker
            </button>
            <button
              onClick={() => {
                solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
                onClose();
                if (onOpenVisualCustomizer) onOpenVisualCustomizer('store' as any);
              }}
              className="px-2 py-0.8 rounded-lg bg-purple-600 text-white text-[10px] font-bold active:scale-95 shadow-xs"
            >
              Store
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2.5 shrink-0">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const count =
              cat === 'All'
                ? apps.length
                : apps.filter((a) => a.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                    : 'bg-white/60 hover:bg-white text-slate-600 border border-white/60'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-black/20 text-white' : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Suggestions Row (shown when not searching) */}
        {!searchQuery && activeCategory === 'All' && (
          <div className="mb-3 p-2.5 rounded-2xl bg-amber-50/60 border border-amber-200/50 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-amber-800 flex items-center gap-1 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Frequently Used
              </span>
              <span className="text-[9px] text-amber-700/80 font-medium">Quick Launch</span>
            </div>
            <div className="grid grid-cols-4 gap-2 place-items-center">
              {quickPicks.map((app) => (
                <div
                  key={app.id}
                  onClick={() => {
                    onLaunchApp(app);
                    onClose();
                  }}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <AppIcon3D
                    app={app}
                    size="sm"
                    showLabel={false}
                    tiltEnabled={solarState.iconTilt3D}
                    soundEnabled={solarState.soundEnabled}
                    iconPack={solarState.activeIconPack}
                    customOverride={solarState.customAppIcons[app.id]}
                    isDark={isDarkMode}
                  />
                  <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 mt-1 truncate max-w-[55px] text-center">
                    {solarState.customAppIcons[app.id]?.name || app.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* App Content Container (Grid or List View) */}
        <div className="flex-1 overflow-y-auto no-scrollbar pr-0.5 pb-2">
          {filteredApps.length === 0 ? (
            <div className="py-14 text-center text-slate-400">
              <Sparkles className="w-9 h-9 mx-auto mb-2 text-amber-400 opacity-60" />
              <p className="text-xs font-semibold text-slate-600">
                No apps found matching "{searchQuery}"
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="mt-3 px-3 py-1 rounded-xl bg-amber-500 text-white text-xs font-semibold"
              >
                Clear Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* 3D App Icons Grid View (Respects iconScale & showIconLabels) */
            <div className="grid grid-cols-4 gap-y-4 gap-x-2 justify-items-center pt-1 pb-4">
              {filteredApps.map((app) => (
                <div key={app.id} className="flex flex-col items-center">
                  <AppIcon3D
                    app={app}
                    customScale={solarState.iconScale}
                    showLabel={solarState.showIconLabels}
                    tiltEnabled={solarState.iconTilt3D}
                    soundEnabled={solarState.soundEnabled}
                    iconPack={solarState.activeIconPack}
                    customOverride={solarState.customAppIcons[app.id]}
                    isDark={isDarkMode}
                    onClick={() => {
                      onLaunchApp(app);
                      onClose();
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Detailed Alphabetical List View */
            <div className="space-y-2 pt-1 pb-4">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => {
                    onLaunchApp(app);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-white/60 dark:bg-zinc-800/60 hover:bg-white/95 dark:hover:bg-zinc-800 border border-white/80 dark:border-white/10 transition-all cursor-pointer group shadow-xs hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <AppIcon3D
                      app={app}
                      size="sm"
                      showLabel={false}
                      tiltEnabled={false}
                      soundEnabled={false}
                      iconPack={solarState.activeIconPack}
                      customOverride={solarState.customAppIcons[app.id]}
                      isDark={isDarkMode}
                    />
                    <div className="text-left">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-amber-800 dark:group-hover:text-amber-300 transition-colors">
                          {solarState.customAppIcons[app.id]?.name || app.name}
                        </h4>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-200/80 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-medium">
                          {app.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1 max-w-[200px]">
                        {app.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-700 text-[10px] font-bold group-hover:bg-amber-500 group-hover:text-white transition-all flex items-center gap-1"
                    >
                      <span>Open</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Drawer Footer */}
        <div className="pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium shrink-0">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{filteredApps.length} Apps Ready</span>
            <span className="text-slate-300">·</span>
            <span className="text-[10px] text-slate-400 font-mono">
              Scale {solarState.iconScale}%
            </span>
          </span>
          <button
            onClick={onClose}
            className="text-amber-700 font-bold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
