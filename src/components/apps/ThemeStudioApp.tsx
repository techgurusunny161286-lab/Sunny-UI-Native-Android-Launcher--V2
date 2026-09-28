import React, { useState, useEffect } from 'react';
import {
  SolarState,
  ThemePreset,
  CommunityTheme,
  CommunityThemeCategory,
  DIYTheme,
  SoundPackId,
  IconPackId,
  SystemFont,
  SystemFontSize,
  TextColorTint,
  StatusBarStyle,
  BatteryStyle,
  SignalStyle,
  ClockPosition,
  ControlCenterAccent,
  LockScreenClockStyle,
  AODThemeId,
  BootAnimationId,
} from '../../types/launcher';
import {
  getCommunityThemes,
  uploadThemeToCommunity,
  getSavedDIYThemes,
  saveDIYTheme,
  deleteDIYTheme,
} from '../../data/communityThemesData';
import {
  ICON_PACKS,
  WALLPAPERS_COLLECTION,
  SYSTEM_FONTS,
  FONT_SIZES,
  TEXT_COLORS,
  FACTORY_DEFAULT_THEME,
} from '../../data/customizationData';
import {
  generateAITheme,
  MOOD_INSPIRATION_PRESETS,
  AIThemeGenerationResult,
} from '../../services/aiThemeGenerator';
import { solarSound, SOUND_PACKS } from '../../utils/solarSound';
import {
  Sparkles,
  Palette,
  Sliders,
  Music,
  ShoppingBag,
  Heart,
  Download,
  Share2,
  Check,
  Play,
  Square,
  Volume2,
  VolumeX,
  Search,
  Filter,
  Plus,
  Trash2,
  UploadCloud,
  CheckCircle2,
  RotateCcw,
  Layers,
  Wand2,
  Flame,
  Star,
  Eye,
  ArrowRight,
  Keyboard,
  Smartphone,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ThemeStudioAppProps {
  solarState: SolarState;
  currentWallpaper: string;
  onApplyThemePreset: (preset: ThemePreset) => void;
  onRestoreDefaults: () => void;
  onUpdateSolarState: (updates: Partial<SolarState>) => void;
  initialSubTab?: 'store' | 'diy' | 'ai' | 'sounds' | 'mythemes';
}

export const ThemeStudioApp: React.FC<ThemeStudioAppProps> = ({
  solarState,
  currentWallpaper,
  onApplyThemePreset,
  onRestoreDefaults,
  onUpdateSolarState,
  initialSubTab = 'store',
}) => {
  const [activeTab, setActiveTab] = useState<'store' | 'diy' | 'ai' | 'sounds' | 'mythemes'>(initialSubTab);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // ----------------------------------------------------
  // 1. COMMUNITY STORE STATE
  // ----------------------------------------------------
  const [communityThemes, setCommunityThemes] = useState<CommunityTheme[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CommunityThemeCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'trending' | 'topRated' | 'newest'>('trending');
  const [likedThemes, setLikedThemes] = useState<Record<string, boolean>>({});
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload modal form
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadAuthor, setUploadAuthor] = useState('@SunnyUser');
  const [uploadCategory, setUploadCategory] = useState<CommunityThemeCategory>('Minimal');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadTags, setUploadTags] = useState('Clean, OLED, Aesthetic');

  useEffect(() => {
    setCommunityThemes(getCommunityThemes());
  }, []);

  const handleToggleLike = (themeId: string) => {
    solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
    setLikedThemes((prev) => {
      const next = !prev[themeId];
      return { ...prev, [themeId]: next };
    });
    setCommunityThemes((prev) =>
      prev.map((t) => {
        if (t.id === themeId) {
          const isCurrentlyLiked = likedThemes[themeId];
          return {
            ...t,
            likes: isCurrentlyLiked ? t.likes - 1 : t.likes + 1,
          };
        }
        return t;
      })
    );
  };

  const handleApplyCommunityTheme = (theme: CommunityTheme) => {
    solarSound.playLaunch(solarState.soundEnabled);
    onApplyThemePreset(theme.preset);
    if (theme.soundPack) {
      onUpdateSolarState({ activeSoundPack: theme.soundPack });
    }
    showToast(`Applied "${theme.name}" theme to SolOS!`);
  };

  const handlePublishUpload = () => {
    if (!uploadTitle.trim()) {
      alert('Please enter a theme name');
      return;
    }

    const newTheme: CommunityTheme = {
      id: `comm-user-${Date.now()}`,
      name: uploadTitle.trim(),
      creator: {
        name: uploadAuthor.replace('@', ''),
        handle: uploadAuthor.startsWith('@') ? uploadAuthor : `@${uploadAuthor}`,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        verified: true,
      },
      category: uploadCategory === 'All' ? 'Minimal' : uploadCategory,
      description: uploadDesc.trim() || 'Custom themed setup crafted with SolOS Theme Studio.',
      downloads: 1,
      likes: 1,
      rating: 5.0,
      dateAdded: 'Just now',
      tags: uploadTags.split(',').map((s) => s.trim()).filter(Boolean),
      soundPack: solarState.activeSoundPack,
      preset: {
        id: `preset-${Date.now()}`,
        name: uploadTitle.trim(),
        badge: 'Community Upload',
        description: uploadDesc.trim() || 'SolOS community creation',
        previewBg: `linear-gradient(135deg, ${solarState.controlCenterAccent === 'amber' ? '#f59e0b' : '#38bdf8'} 0%, #1e1b4b 100%)`,
        wallpaper: currentWallpaper,
        iconPack: solarState.activeIconPack,
        themeMode: solarState.themeMode,
        systemFont: solarState.systemFont,
        systemFontSize: solarState.systemFontSize,
        systemTextColor: solarState.systemTextColor,
        statusBarStyle: solarState.statusBarStyle,
        batteryStyle: solarState.batteryStyle,
        signalStyle: solarState.signalStyle,
        clockPosition: solarState.clockPosition,
        controlCenterAccent: solarState.controlCenterAccent,
        notificationCardStyle: solarState.notificationCardStyle,
        lockClockStyle: solarState.lockClockStyle,
        lockWidgets: solarState.lockWidgets,
        aodTheme: solarState.aodTheme,
        bootAnimation: solarState.bootAnimation,
        soundPack: solarState.activeSoundPack,
      },
    };

    const updated = uploadThemeToCommunity(newTheme);
    setCommunityThemes(updated);
    setShowUploadModal(false);
    solarSound.playNotification(solarState.soundEnabled, solarState.activeSoundPack);
    showToast(`Published "${newTheme.name}" to Community Store!`);
    setUploadTitle('');
    setUploadDesc('');
  };

  // Filtered Community Themes
  const filteredThemes = communityThemes
    .filter((theme) => {
      const matchesCategory = selectedCategory === 'All' || theme.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        theme.name.toLowerCase().includes(q) ||
        theme.creator.name.toLowerCase().includes(q) ||
        theme.creator.handle.toLowerCase().includes(q) ||
        theme.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'topRated') return b.rating - a.rating;
      if (sortBy === 'newest') return b.dateAdded.includes('now') || b.dateAdded.includes('hour') ? -1 : 1;
      return b.downloads - a.downloads;
    });

  // ----------------------------------------------------
  // 2. DIY THEME CREATOR (Custom Theme Maker) STATE
  // ----------------------------------------------------
  const [diyName, setDiyName] = useState('My Custom Sol Theme');
  const [diyAuthor, setDiyAuthor] = useState('Sunny Creator');
  const [diyCategory, setDiyCategory] = useState<CommunityThemeCategory>('Minimal');
  const [diyDesc, setDiyDesc] = useState('Personalized mix of wallpaper, icons, fonts, and sound effects.');

  const [diyWallpaper, setDiyWallpaper] = useState(currentWallpaper || 'golden');
  const [diyIconPack, setDiyIconPack] = useState<IconPackId>(solarState.activeIconPack || 'ios-glass');
  const [diyThemeMode, setDiyThemeMode] = useState<'light' | 'dark'>(solarState.themeMode === 'dark' ? 'dark' : 'light');
  const [diyFont, setDiyFont] = useState<SystemFont>(solarState.systemFont || 'sf-pro');
  const [diyFontSize, setDiyFontSize] = useState<SystemFontSize>(solarState.systemFontSize || 'standard');
  const [diyTextColor, setDiyTextColor] = useState<TextColorTint>(solarState.systemTextColor || 'adaptive');
  const [diyStatusBarStyle, setDiyStatusBarStyle] = useState<StatusBarStyle>(solarState.statusBarStyle || 'ios-classic');
  const [diyBatteryStyle, setDiyBatteryStyle] = useState<BatteryStyle>(solarState.batteryStyle || 'capsule-outside');
  const [diySignalStyle, setDiySignalStyle] = useState<SignalStyle>(solarState.signalStyle || 'bars');
  const [diyClockPosition, setDiyClockPosition] = useState<ClockPosition>(solarState.clockPosition || 'left');
  const [diyAccent, setDiyAccent] = useState<ControlCenterAccent>(solarState.controlCenterAccent || 'amber');
  const [diyLockClock, setDiyLockClock] = useState<LockScreenClockStyle>(solarState.lockClockStyle || 'ios-depth');
  const [diySoundPack, setDiySoundPack] = useState<SoundPackId>(solarState.activeSoundPack || 'solar-harmonix');

  // DIY saved themes list
  const [savedDIYThemes, setSavedDIYThemes] = useState<DIYTheme[]>([]);

  useEffect(() => {
    setSavedDIYThemes(getSavedDIYThemes());
  }, []);

  const handleApplyDIYTheme = () => {
    solarSound.playLaunch(solarState.soundEnabled);
    const preset: ThemePreset = {
      id: `diy-${Date.now()}`,
      name: diyName,
      badge: 'DIY Custom',
      description: diyDesc,
      previewBg: `linear-gradient(135deg, ${diyAccent === 'amber' ? '#f59e0b' : diyAccent === 'blue' ? '#38bdf8' : '#10b981'} 0%, #1e1b4b 100%)`,
      wallpaper: diyWallpaper,
      iconPack: diyIconPack,
      themeMode: diyThemeMode,
      systemFont: diyFont,
      systemFontSize: diyFontSize,
      systemTextColor: diyTextColor,
      statusBarStyle: diyStatusBarStyle,
      batteryStyle: diyBatteryStyle,
      signalStyle: diySignalStyle,
      clockPosition: diyClockPosition,
      controlCenterAccent: diyAccent,
      notificationCardStyle: diyThemeMode === 'dark' ? 'minimal-outline' : 'glass-blur',
      lockClockStyle: diyLockClock,
      lockWidgets: solarState.lockWidgets,
      aodTheme: solarState.aodTheme,
      bootAnimation: solarState.bootAnimation,
      soundPack: diySoundPack,
    };
    onApplyThemePreset(preset);
    onUpdateSolarState({ activeSoundPack: diySoundPack });
    showToast(`DIY Theme "${diyName}" applied to SolOS!`);
  };

  const handleSaveDIYTheme = () => {
    solarSound.playNotification(solarState.soundEnabled, diySoundPack);
    const preset: ThemePreset = {
      id: `diy-${Date.now()}`,
      name: diyName,
      badge: 'DIY Custom',
      description: diyDesc,
      previewBg: `linear-gradient(135deg, ${diyAccent === 'amber' ? '#f59e0b' : '#38bdf8'} 0%, #1e1b4b 100%)`,
      wallpaper: diyWallpaper,
      iconPack: diyIconPack,
      themeMode: diyThemeMode,
      systemFont: diyFont,
      systemFontSize: diyFontSize,
      systemTextColor: diyTextColor,
      statusBarStyle: diyStatusBarStyle,
      batteryStyle: diyBatteryStyle,
      signalStyle: diySignalStyle,
      clockPosition: diyClockPosition,
      controlCenterAccent: diyAccent,
      notificationCardStyle: diyThemeMode === 'dark' ? 'minimal-outline' : 'glass-blur',
      lockClockStyle: diyLockClock,
      lockWidgets: solarState.lockWidgets,
      aodTheme: solarState.aodTheme,
      bootAnimation: solarState.bootAnimation,
      soundPack: diySoundPack,
    };

    const newDIY: DIYTheme = {
      id: `diy-theme-${Date.now()}`,
      name: diyName,
      author: diyAuthor,
      category: diyCategory,
      description: diyDesc,
      createdAt: new Date().toLocaleDateString(),
      preset,
      soundPack: diySoundPack,
    };

    const updated = saveDIYTheme(newDIY);
    setSavedDIYThemes(updated);
    showToast(`Saved "${diyName}" to My Themes!`);
  };

  const handleDeleteSavedDIY = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
    const updated = deleteDIYTheme(id);
    setSavedDIYThemes(updated);
    showToast('Theme deleted from My Themes.');
  };

  // ----------------------------------------------------
  // 3. AI THEME GENERATOR STATE
  // ----------------------------------------------------
  const [moodPrompt, setMoodPrompt] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiResult, setAiResult] = useState<AIThemeGenerationResult | null>(null);

  const handleRunAIGenerator = async (customMood?: string) => {
    const promptToUse = customMood || moodPrompt;
    if (!promptToUse.trim()) {
      alert('Please enter a mood or select an inspiration preset!');
      return;
    }

    solarSound.playLaunch(solarState.soundEnabled);
    setIsGeneratingAI(true);
    setAiResult(null);

    try {
      const result = await generateAITheme(promptToUse, currentWallpaper);
      setAiResult(result);
      solarSound.playNotification(solarState.soundEnabled, result.soundPack);
    } catch {
      showToast('Could not complete generation. Please try again.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleApplyAITheme = () => {
    if (!aiResult) return;
    solarSound.playLaunch(solarState.soundEnabled);
    onApplyThemePreset(aiResult.preset);
    if (aiResult.soundPack) {
      onUpdateSolarState({ activeSoundPack: aiResult.soundPack });
    }
    showToast(`Applied AI Theme "${aiResult.preset.name}"!`);
  };

  const handleTransferAIToDIY = () => {
    if (!aiResult) return;
    solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
    setDiyName(aiResult.preset.name);
    setDiyDesc(aiResult.rationale);
    setDiyWallpaper(aiResult.preset.wallpaper);
    setDiyIconPack(aiResult.preset.iconPack);
    setDiyThemeMode(aiResult.preset.themeMode === 'dark' ? 'dark' : 'light');
    setDiyFont(aiResult.preset.systemFont);
    setDiyFontSize(aiResult.preset.systemFontSize);
    setDiyTextColor(aiResult.preset.systemTextColor);
    setDiyStatusBarStyle(aiResult.preset.statusBarStyle);
    setDiyBatteryStyle(aiResult.preset.batteryStyle);
    setDiySignalStyle(aiResult.preset.signalStyle);
    setDiyClockPosition(aiResult.preset.clockPosition);
    setDiyAccent(aiResult.preset.controlCenterAccent);
    setDiyLockClock(aiResult.preset.lockClockStyle);
    setDiySoundPack(aiResult.soundPack);
    setActiveTab('diy');
    showToast('Loaded AI generated theme into DIY Creator Studio!');
  };

  // ----------------------------------------------------
  // 4. SOUND PACKS STATE & INTERACTIVE TYPING KEYBOARD
  // ----------------------------------------------------
  const [playingRingtonePack, setPlayingRingtonePack] = useState<SoundPackId | null>(null);
  const [typingInputText, setTypingInputText] = useState('');

  const handlePlayRingtone = (packId: SoundPackId) => {
    if (playingRingtonePack === packId) {
      solarSound.stopRingtone();
      setPlayingRingtonePack(null);
    } else {
      solarSound.playRingtone(true, packId);
      setPlayingRingtonePack(packId);
    }
  };

  const handlePlayNotificationSound = (packId: SoundPackId) => {
    solarSound.playNotification(true, packId);
  };

  const handleSetActiveSoundPack = (packId: SoundPackId) => {
    solarSound.playTap(true, packId);
    onUpdateSolarState({ activeSoundPack: packId });
    showToast(`Active sound pack set to: ${SOUND_PACKS.find((p) => p.id === packId)?.name}`);
  };

  // Virtual Keyboard Keys for Typing Sound Testing
  const KEYBOARD_ROWS = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
    ['Space', 'Enter'],
  ];

  const handleVirtualKeyPress = (key: string) => {
    solarSound.playTypingSound(solarState.soundEnabled, solarState.activeSoundPack, key);
    if (key === '⌫') {
      setTypingInputText((prev) => prev.slice(0, -1));
    } else if (key === 'Space') {
      setTypingInputText((prev) => prev + ' ');
    } else if (key === 'Enter') {
      setTypingInputText((prev) => prev + '\n');
    } else {
      setTypingInputText((prev) => prev + key);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white overflow-hidden select-none">
      {/* Toast Banner */}
      {toastMsg && (
        <div className="absolute top-14 left-4 right-4 z-50 p-3 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center justify-between animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-slate-950" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Top Studio Nav Tabs */}
      <div className="px-3 pt-2 pb-2 bg-slate-900/90 border-b border-white/10 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <button
          onClick={() => {
            solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
            setActiveTab('store');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'store'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Community Store</span>
        </button>

        <button
          onClick={() => {
            solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
            setActiveTab('diy');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'diy'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>DIY Theme Creator</span>
        </button>

        <button
          onClick={() => {
            solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
            setActiveTab('ai');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'ai'
              ? 'bg-gradient-to-r from-purple-500 to-amber-500 text-white shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Theme Gen</span>
        </button>

        <button
          onClick={() => {
            solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
            setActiveTab('sounds');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'sounds'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Sound Packs</span>
        </button>

        <button
          onClick={() => {
            solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
            setActiveTab('mythemes');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeTab === 'mythemes'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>My Themes ({savedDIYThemes.length})</span>
        </button>
      </div>

      {/* Main Tab Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* ======================================================== */}
        {/* TAB 1: CATEGORIZED COMMUNITY STORE */}
        {/* ======================================================== */}
        {activeTab === 'store' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Store Header & Upload Action */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  Community Theme Store
                </h2>
                <p className="text-[11px] text-slate-400">
                  Daily curated themes from global SolOS creators
                </p>
              </div>

              <button
                onClick={() => {
                  solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
                  setShowUploadModal(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg active:scale-95 transition-all"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
            </div>

            {/* Search and Sort Bar */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search themes, creators, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2 py-1.5 text-xs rounded-xl bg-slate-900 border border-white/10 text-slate-300 focus:outline-none focus:border-amber-400"
              >
                <option value="trending">🔥 Trending</option>
                <option value="topRated">★ Top Rated</option>
                <option value="newest">⚡ Newest</option>
              </select>
            </div>

            {/* Category Filter Pills (Minimal, Anime, Tech, Nature, Cyberpunk, Luxury) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(['All', 'Minimal', 'Anime', 'Tech', 'Nature', 'Cyberpunk', 'Luxury'] as CommunityThemeCategory[]).map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
                      setSelectedCategory(cat);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900/90 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {cat === 'Minimal' && '⚪ '}
                    {cat === 'Anime' && '🌸 '}
                    {cat === 'Tech' && '⚙️ '}
                    {cat === 'Nature' && '🍃 '}
                    {cat === 'Cyberpunk' && '⚡ '}
                    {cat === 'Luxury' && '👑 '}
                    {cat}
                  </button>
                )
              )}
            </div>

            {/* Themes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredThemes.map((theme) => {
                const isLiked = likedThemes[theme.id];
                return (
                  <div
                    key={theme.id}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between gap-3 shadow-lg"
                  >
                    {/* Visual Banner Preview */}
                    <div
                      className="h-28 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden shadow-inner border border-white/10"
                      style={{ background: theme.preset.previewBg }}
                    >
                      <div className="flex items-center justify-between z-10">
                        <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-white/10">
                          {theme.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleLike(theme.id)}
                            className={`p-1.5 rounded-full backdrop-blur-md transition-all active:scale-90 ${
                              isLiked
                                ? 'bg-rose-500 text-white'
                                : 'bg-black/40 text-slate-300 hover:text-rose-400'
                            }`}
                          >
                            <Heart className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>
                      </div>

                      {/* Mock Mini Icon Squircles */}
                      <div className="flex items-center gap-2 z-10">
                        <div className="w-7 h-7 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-xs">
                          ☀️
                        </div>
                        <div className="w-7 h-7 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-xs">
                          💬
                        </div>
                        <div className="w-7 h-7 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-xs">
                          🎵
                        </div>
                        <div className="w-7 h-7 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-xs">
                          📸
                        </div>
                      </div>
                    </div>

                    {/* Metadata & Creator */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-white">{theme.name}</h3>
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{theme.rating}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {theme.description}
                      </p>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={theme.creator.avatar}
                            alt={theme.creator.name}
                            className="w-4 h-4 rounded-full object-cover border border-white/20"
                          />
                          <span className="text-[11px] text-slate-300 font-medium">
                            {theme.creator.handle}
                          </span>
                          {theme.creator.verified && (
                            <ShieldCheck className="w-3 h-3 text-amber-400" />
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[10px] text-slate-400">
                          <span>{theme.downloads.toLocaleString()} downloads</span>
                          <span>{theme.likes} likes</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {theme.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 rounded-md bg-white/5 text-[9px] text-slate-400"
                          >
                            #{tag}
                          </span>
                        ))}
                        {theme.soundPack && (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[9px] font-semibold flex items-center gap-0.5">
                            <Music className="w-2.5 h-2.5" />
                            {theme.soundPack}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 1-Click Apply Button */}
                    <button
                      onClick={() => handleApplyCommunityTheme(theme)}
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>One-Click Apply Theme</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: DIY THEME CREATOR (Custom Theme Maker) */}
        {/* ======================================================== */}
        {activeTab === 'diy' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-amber-400" />
                DIY Theme Creator (Custom Theme Maker)
              </h2>
              <p className="text-[11px] text-slate-400">
                Mix wallpaper, icons, typography, status bars & sounds to craft your unique theme
              </p>
            </div>

            {/* Live Device Preview Pill */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 flex flex-col gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Live Theme Preview
              </span>
              <div
                className="h-32 rounded-xl p-3 flex flex-col justify-between border border-white/10 shadow-lg relative overflow-hidden"
                style={{
                  background:
                    diyWallpaper === 'golden'
                      ? 'linear-gradient(135deg, #fffbeb 0%, #fde68a 35%, #f59e0b 100%)'
                      : diyWallpaper === 'sunset'
                      ? 'linear-gradient(135deg, #fb923c 0%, #ea580c 45%, #311006 100%)'
                      : diyWallpaper === 'amoled-obsidian'
                      ? '#000000'
                      : 'linear-gradient(135deg, #09090b 0%, #1e1b4b 60%, #431407 100%)',
                }}
              >
                {/* Mock Status Bar */}
                <div className="flex items-center justify-between text-[10px] text-slate-800 font-bold px-1">
                  <span>{diyClockPosition === 'left' ? '12:45' : ''}</span>
                  <span>{diyClockPosition === 'center' ? '12:45' : ''}</span>
                  <div className="flex items-center gap-1">
                    <span>{diySignalStyle === 'bars' ? '●●●●' : '▲'}</span>
                    <span>86%</span>
                  </div>
                </div>

                {/* Mock Icons & Font Specimen */}
                <div className="flex items-center justify-around">
                  {['☀️ Weather', '🧭 Browser', '💬 Message', '🎵 Music'].map((item) => (
                    <div key={item} className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-xl bg-white/40 backdrop-blur-md shadow-md border border-white/40 flex items-center justify-center text-xs">
                        {item.split(' ')[0]}
                      </div>
                      <span className="text-[8px] font-semibold text-slate-900">
                        {item.split(' ')[1]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Theme Meta Info Inputs */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Theme Name</label>
                <input
                  type="text"
                  value={diyName}
                  onChange={(e) => setDiyName(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Creator Handle</label>
                <input
                  type="text"
                  value={diyAuthor}
                  onChange={(e) => setDiyAuthor(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Section 1: Wallpaper Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span>1. Choose Wallpaper</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {WALLPAPERS_COLLECTION.slice(0, 6).map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => {
                      solarSound.playTap(solarState.soundEnabled, diySoundPack);
                      setDiyWallpaper(wp.id);
                    }}
                    className={`h-16 rounded-xl p-2 flex flex-col justify-end text-left relative overflow-hidden border transition-all ${
                      diyWallpaper === wp.id
                        ? 'border-amber-400 ring-2 ring-amber-400/50 scale-[1.02]'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                    style={{ background: wp.previewGradient }}
                  >
                    <span className="text-[10px] font-bold text-white drop-shadow bg-black/30 px-1 rounded truncate">
                      {wp.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 2: Icon Pack Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span>2. Choose Icon Pack</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ICON_PACKS.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => {
                      solarSound.playTap(solarState.soundEnabled, diySoundPack);
                      setDiyIconPack(pack.id);
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      diyIconPack === pack.id
                        ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400'
                        : 'border-white/10 bg-slate-900 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{pack.name}</div>
                      <div className="text-[10px] text-slate-400">{pack.badge}</div>
                    </div>
                    <div className="flex gap-1 text-xs">
                      {pack.previewIcons.slice(0, 2).map((i) => (
                        <span key={i}>{i}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 3: Typography & Fonts */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span>3. System Font & Typography</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {SYSTEM_FONTS.map((font) => (
                  <button
                    key={font.id}
                    onClick={() => {
                      solarSound.playTap(solarState.soundEnabled, diySoundPack);
                      setDiyFont(font.id);
                    }}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      diyFont === font.id
                        ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-bold'
                        : 'border-white/10 bg-slate-900 text-slate-300'
                    }`}
                  >
                    <div className="text-xs truncate">{font.name.split(' ')[0]}</div>
                    <div className="text-[9px] text-slate-400 truncate">12:45</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 4: Sound Pack Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-amber-400" />
                <span>4. Sound Pack (Ringtone, Notifications & Typing)</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SOUND_PACKS.map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() => {
                      solarSound.playTap(solarState.soundEnabled, sp.id);
                      setDiySoundPack(sp.id);
                    }}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      diySoundPack === sp.id
                        ? 'border-amber-400 bg-amber-500/10 ring-1 ring-amber-400'
                        : 'border-white/10 bg-slate-900 hover:border-white/20'
                    }`}
                  >
                    <span className="text-lg">{sp.icon}</span>
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white truncate">{sp.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{sp.badge}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 5: Status Bar & Clock Style */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                5. Status Bar & Battery Layout
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400">Status Bar Style</span>
                  <select
                    value={diyStatusBarStyle}
                    onChange={(e) => setDiyStatusBarStyle(e.target.value as any)}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white"
                  >
                    <option value="ios-classic">iOS Classic</option>
                    <option value="android-minimal">Android Minimal</option>
                    <option value="cyber-neon">Cyber Neon</option>
                    <option value="pill-compact">Pill Compact</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400">Battery Meter</span>
                  <select
                    value={diyBatteryStyle}
                    onChange={(e) => setDiyBatteryStyle(e.target.value as any)}
                    className="w-full mt-1 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white"
                  >
                    <option value="capsule-outside">Capsule (Outside %)</option>
                    <option value="capsule-inside">Capsule (Inside %)</option>
                    <option value="circle-meter">Circle Radial Meter</option>
                    <option value="bar-only">Bar Only</option>
                    <option value="percentage-only">Percentage Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons: Apply Now, Save to My Themes, Publish */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleApplyDIYTheme}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all"
              >
                <Check className="w-4 h-4" />
                <span>One-Click Apply DIY Theme to Phone</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveDIYTheme}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-semibold text-xs flex items-center justify-center gap-1.5 border border-white/10 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save to My Themes</span>
                </button>

                <button
                  onClick={() => {
                    handleSaveDIYTheme();
                    setUploadTitle(diyName);
                    setUploadDesc(diyDesc);
                    setShowUploadModal(true);
                  }}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Publish to Store</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: AI THEME GENERATOR */}
        {/* ======================================================== */}
        {activeTab === 'ai' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                AI Theme Generator
              </h2>
              <p className="text-[11px] text-slate-400">
                Describe your mood or let AI inspect your current wallpaper to generate matching colors, icons, and sounds
              </p>
            </div>

            {/* Quick Inspiration Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Instant Mood Inspiration
              </span>
              <div className="flex flex-wrap gap-1.5">
                {MOOD_INSPIRATION_PRESETS.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
                      setMoodPrompt(item.mood);
                      handleRunAIGenerator(item.mood);
                    }}
                    className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-white/10 text-[11px] text-slate-200 transition-all active:scale-95"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input Box */}
            <div className="space-y-2">
              <textarea
                rows={2}
                placeholder="E.g. High energy cyber neon matrix with midnight blue, or calm pastel cherry blossoms..."
                value={moodPrompt}
                onChange={(e) => setMoodPrompt(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition-all"
              />

              <div className="flex gap-2">
                <button
                  disabled={isGeneratingAI}
                  onClick={() => handleRunAIGenerator()}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
                >
                  {isGeneratingAI ? (
                    <>
                      <Wand2 className="w-4 h-4 animate-spin text-white" />
                      <span>Synthesizing Colors & Icons...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate AI Theme</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    const wpObj = WALLPAPERS_COLLECTION.find((w) => w.id === currentWallpaper);
                    const prompt = `Harmonious theme strictly attuned to wallpaper ${wpObj?.name || 'golden'}: ${wpObj?.description || 'golden hour rays'}`;
                    setMoodPrompt(prompt);
                    handleRunAIGenerator(prompt);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold border border-white/10 whitespace-nowrap transition-all"
                >
                  <span>Match Current Wallpaper</span>
                </button>
              </div>
            </div>

            {/* Generated AI Result Card */}
            {aiResult && (
              <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-purple-500/30 space-y-3.5 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="font-bold text-sm text-white">{aiResult.preset.name}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                    {aiResult.preset.badge}
                  </span>
                </div>

                {/* AI Rationale */}
                <p className="text-xs text-slate-300 leading-relaxed bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <span className="text-purple-400 font-semibold">AI Match Rationale: </span>
                  {aiResult.rationale}
                </p>

                {/* Color Swatches and Matching Specs */}
                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded-xl bg-slate-900 border border-white/10 flex flex-col items-center gap-1">
                    <span
                      className="w-5 h-5 rounded-full border border-white/20"
                      style={{ background: aiResult.dominantHex }}
                    />
                    <span className="text-slate-400">Accent</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-white/10 flex flex-col items-center gap-1">
                    <span className="font-bold text-amber-400">
                      {aiResult.preset.iconPack.split('-')[0]}
                    </span>
                    <span className="text-slate-400">Icons</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-white/10 flex flex-col items-center gap-1">
                    <span className="font-bold text-sky-400 truncate">
                      {aiResult.preset.systemFont}
                    </span>
                    <span className="text-slate-400">Font</span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-white/10 flex flex-col items-center gap-1">
                    <span className="font-bold text-emerald-400 truncate">
                      {aiResult.soundPack.split('-')[0]}
                    </span>
                    <span className="text-slate-400">Sounds</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={handleApplyAITheme}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply AI Theme Now</span>
                  </button>

                  <button
                    onClick={handleTransferAIToDIY}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-white/10 active:scale-95 transition-all"
                  >
                    <span>Tweak in DIY Studio</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: SOUND PACKS & INTERACTIVE TYPING KEYBOARD */}
        {/* ======================================================== */}
        {activeTab === 'sounds' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                <Music className="w-4 h-4 text-amber-400" />
                Sound Packs Studio
              </h2>
              <p className="text-[11px] text-slate-400">
                Change Ringtone, Notification Chimes, and Key Typing Sounds with real synthesized Web Audio
              </p>
            </div>

            {/* Sound Packs List */}
            <div className="space-y-2.5">
              {SOUND_PACKS.map((pack) => {
                const isActive = solarState.activeSoundPack === pack.id;
                const isRingtonePlayingThis = playingRingtonePack === pack.id;

                return (
                  <div
                    key={pack.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col gap-2.5 ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-400/80 shadow-lg ring-1 ring-amber-400/30'
                        : 'bg-slate-900 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{pack.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-xs text-white">{pack.name}</h3>
                            <span className="px-1.5 py-0.2 rounded-md bg-white/10 text-[9px] text-amber-300 font-semibold">
                              {pack.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{pack.tagline}</p>
                        </div>
                      </div>

                      {isActive ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetActiveSoundPack(pack.id)}
                          className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold border border-white/10 active:scale-95 transition-all"
                        >
                          Select
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {pack.description}
                    </p>

                    {/* Preview Buttons */}
                    <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                      {/* Play Ringtone Button */}
                      <button
                        onClick={() => handlePlayRingtone(pack.id)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          isRingtonePlayingThis
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-white/5 hover:bg-white/10 text-slate-200'
                        }`}
                      >
                        {isRingtonePlayingThis ? (
                          <>
                            <Square className="w-3 h-3 fill-current" />
                            <span>Stop Ringtone</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>Preview Ringtone</span>
                          </>
                        )}
                      </button>

                      {/* Play Notification Button */}
                      <button
                        onClick={() => handlePlayNotificationSound(pack.id)}
                        className="flex-1 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Preview Notification</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Keyboard Typing Sound Testing Pad */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Keyboard className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Interactive Typing Sound Pad</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  Active: {SOUND_PACKS.find((p) => p.id === solarState.activeSoundPack)?.name}
                </span>
              </div>

              {/* Text Output Box */}
              <div className="p-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-mono min-h-12 text-slate-200 break-all flex items-center justify-between">
                <span>{typingInputText || 'Tap keys below to hear real typing clicks...'}</span>
                {typingInputText && (
                  <button
                    onClick={() => setTypingInputText('')}
                    className="text-[10px] text-slate-500 hover:text-slate-300 ml-2"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Virtual Key Buttons */}
              <div className="space-y-1">
                {KEYBOARD_ROWS.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex justify-center gap-1">
                    {row.map((k) => (
                      <button
                        key={k}
                        onClick={() => handleVirtualKeyPress(k)}
                        className={`h-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-white font-medium text-xs flex items-center justify-center transition-all ${
                          k === 'Space'
                            ? 'w-36'
                            : k === 'Enter' || k === '⌫'
                            ? 'w-14 bg-slate-700 font-bold'
                            : 'w-7'
                        }`}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: MY THEMES */}
        {/* ======================================================== */}
        {activeTab === 'mythemes' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-400" />
                  My Created & Saved Themes
                </h2>
                <p className="text-[11px] text-slate-400">
                  Custom themes saved on this device
                </p>
              </div>

              <button
                onClick={onRestoreDefaults}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-semibold border border-rose-500/30 active:scale-95 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore Factory</span>
              </button>
            </div>

            {savedDIYThemes.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-white/10 text-center space-y-3">
                <Palette className="w-8 h-8 text-amber-400 mx-auto" />
                <h3 className="text-sm font-bold text-white">No Custom Themes Yet</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Mix your own wallpaper, icons, typography, and sound effects in the DIY Creator!
                </p>
                <button
                  onClick={() => {
                    solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
                    setActiveTab('diy');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-md"
                >
                  Create a DIY Theme
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {savedDIYThemes.map((saved) => (
                  <div
                    key={saved.id}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-white/10 flex flex-col justify-between gap-3 shadow-lg"
                  >
                    <div
                      className="h-20 rounded-xl p-2.5 flex items-end justify-between border border-white/10"
                      style={{ background: saved.preset.previewBg }}
                    >
                      <span className="px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md text-[10px] font-bold text-white">
                        {saved.category}
                      </span>
                      <span className="text-[10px] text-white/80 drop-shadow">
                        {saved.createdAt}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-white">{saved.name}</h4>
                        <span className="text-[10px] text-slate-400">{saved.author}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {saved.description}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          solarSound.playLaunch(solarState.soundEnabled);
                          onApplyThemePreset(saved.preset);
                          onUpdateSolarState({ activeSoundPack: saved.soundPack });
                          showToast(`Applied "${saved.name}"!`);
                        }}
                        className="flex-1 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Apply</span>
                      </button>

                      <button
                        onClick={(e) => handleDeleteSavedDIY(saved.id, e)}
                        className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* CREATOR STUDIO UPLOAD THEME MODAL */}
      {/* ======================================================== */}
      {showUploadModal && (
        <div
          onClick={() => setShowUploadModal(false)}
          className="absolute inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end justify-center p-3 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-slate-900 border border-white/20 rounded-3xl p-5 space-y-4 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Publish Theme to Community Store</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-400">Theme Title</label>
                <input
                  type="text"
                  placeholder="E.g. Velvet Obsidian Minimal"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 text-xs rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400">Creator Handle</label>
                  <input
                    type="text"
                    value={uploadAuthor}
                    onChange={(e) => setUploadAuthor(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-xs rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400">Category</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as any)}
                    className="w-full mt-1 px-2.5 py-1.5 text-xs rounded-xl bg-slate-950 border border-white/10 text-white"
                  >
                    <option value="Minimal">⚪ Minimal</option>
                    <option value="Anime">🌸 Anime</option>
                    <option value="Tech">⚙️ Tech</option>
                    <option value="Nature">🍃 Nature</option>
                    <option value="Cyberpunk">⚡ Cyberpunk</option>
                    <option value="Luxury">👑 Luxury</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400">Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the aesthetic inspiration, color palette, and vibe..."
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 text-xs rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-400">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="OLED, Clean, 24K, Cyberpunk"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 text-xs rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <button
              onClick={handlePublishUpload}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Publish Theme to Store</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
