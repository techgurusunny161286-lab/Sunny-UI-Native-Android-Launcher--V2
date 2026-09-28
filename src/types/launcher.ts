export type AppId = 
  | 'suntrack'
  | 'solarcam'
  | 'solarbeam'
  | 'solarpulse'
  | 'solarbrowser'
  | 'solarcore'
  | 'solarvault'
  | 'solarcal'
  | 'solartime'
  | 'solarnav'
  | 'solarenergy'
  | 'solarcalc'
  | 'solarnotes'
  | 'solwellness'
  | 'solararcade'
  | 'solarstudio';

export type AppCategory = 'All' | 'Solar' | 'Media' | 'Utilities' | 'Life';

export interface AppDefinition {
  id: AppId;
  name: string;
  category: AppCategory;
  description: string;
  badge?: number;
  dockEligible?: boolean;
  accentColor: string;
  iconBgGradient: string;
}

export type GlassTheme = 'golden' | 'sunset' | 'azure' | 'emerald';

export type TimeOfDay = 'dawn' | 'morning' | 'noon' | 'golden_hour' | 'sunset' | 'dusk';

export type ThemeMode = 'light' | 'dark' | 'auto';

export type IconPackId = 'ios-glass' | 'neon-cyber' | 'frost-crystal' | 'golden-solstice' | 'retro-clay' | 'custom';

export type SystemFont = 'sf-pro' | 'jakarta' | 'outfit' | 'playfair' | 'jetbrains' | 'orbitron';

export type SystemFontSize = 'compact' | 'standard' | 'large' | 'xlarge';

export type TextColorTint = 'adaptive' | 'amber' | 'white' | 'mint' | 'rose' | 'azure';

export interface CustomAppIconOverride {
  name?: string;
  glyphEmoji?: string;
  customIconUrl?: string;
  customGradient?: string;
  accentColor?: string;
}

export interface WallpaperItem {
  id: string;
  name: string;
  category: 'live' | 'parallax' | 'circadian' | 'minimal';
  badge?: string;
  description: string;
  previewGradient: string;
}

export type StatusBarStyle = 'ios-classic' | 'android-minimal' | 'cyber-neon' | 'pill-compact';
export type BatteryStyle = 'capsule-outside' | 'capsule-inside' | 'circle-meter' | 'bar-only' | 'percentage-only';
export type SignalStyle = 'bars' | 'dots' | 'cyber';
export type ClockPosition = 'left' | 'center' | 'right';
export type ControlCenterAccent = 'amber' | 'emerald' | 'blue' | 'purple' | 'coral';
export type NotificationCardStyle = 'glass-blur' | 'solid-dark' | 'minimal-outline';

export type LockScreenClockStyle = 'ios-depth' | 'minimal-serif' | 'solar-sundial' | 'retro-flip' | 'cyber-hud';
export type LockScreenWidgetId = 'weather' | 'battery' | 'golden-hour' | 'mindfulness' | 'events';

export type AODThemeId = 'eclipse-ring' | 'minimal-digital' | 'analog-sundial' | 'bioluminescent-wave' | 'star-map';

export type BootAnimationId = 'solar-flare' | 'liquid-apple' | 'cyber-matrix' | 'retro-mac' | 'nebula-ignition';

export type SoundPackId = 
  | 'solar-harmonix' 
  | 'cyber-neon' 
  | 'zen-bamboo' 
  | '8bit-arcade' 
  | 'mechanical-typewriter' 
  | 'ethereal-crystal';

export interface SoundPackDefinition {
  id: SoundPackId;
  name: string;
  tagline: string;
  badge: string;
  category: string;
  description: string;
  accentColor: string;
  icon: string;
}

export type CommunityThemeCategory = 'All' | 'Minimal' | 'Anime' | 'Tech' | 'Nature' | 'Cyberpunk' | 'Luxury';

export interface CommunityTheme {
  id: string;
  name: string;
  creator: {
    name: string;
    handle: string;
    avatar: string;
    verified?: boolean;
  };
  category: 'Minimal' | 'Anime' | 'Tech' | 'Nature' | 'Cyberpunk' | 'Luxury';
  description: string;
  downloads: number;
  likes: number;
  isLiked?: boolean;
  rating: number;
  dateAdded: string;
  tags: string[];
  preset: ThemePreset;
  soundPack?: SoundPackId;
}

export interface DIYTheme {
  id: string;
  name: string;
  author: string;
  category: CommunityThemeCategory;
  description: string;
  createdAt: string;
  preset: ThemePreset;
  soundPack: SoundPackId;
  isPublished?: boolean;
}

export type PerformanceMode = 'ultra' | 'balanced' | 'eco';

export interface ThemePreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  previewBg: string;
  wallpaper: string;
  iconPack: IconPackId;
  themeMode: ThemeMode;
  systemFont: SystemFont;
  systemFontSize: SystemFontSize;
  systemTextColor: TextColorTint;
  statusBarStyle: StatusBarStyle;
  batteryStyle: BatteryStyle;
  signalStyle: SignalStyle;
  clockPosition: ClockPosition;
  controlCenterAccent: ControlCenterAccent;
  notificationCardStyle: NotificationCardStyle;
  lockClockStyle: LockScreenClockStyle;
  lockWidgets: LockScreenWidgetId[];
  aodTheme: AODThemeId;
  bootAnimation: BootAnimationId;
  soundPack?: SoundPackId;
}

export interface SolarState {
  timeHours: number; // 0 - 24
  sunPosition: number; // 0 (sunrise) to 100 (sunset)
  timeOfDay: TimeOfDay;
  weatherCondition: 'Sunny' | 'Golden Glow' | 'Solar Flare' | 'Clear Sky' | 'Sun Shower';
  temperature: number; // e.g. 26°C / 79°F
  uvIndex: number;
  solarWattage: number; // e.g. 840 W/m²
  solarCharging: boolean;
  batteryLevel: number; // 0 - 100%
  brightness: number; // 0 - 100%
  volume: number; // 0 - 100%
  glassTheme: GlassTheme;
  glassBlur: number; // px blur
  iconTilt3D: boolean;
  iconScale: number; // 75 to 130 (%)
  iconSizePreset: 'sm' | 'md' | 'lg' | 'xl';
  showIconLabels: boolean;
  soundEnabled: boolean;
  wifiEnabled: boolean;
  bluetoothEnabled: boolean;
  flashlightEnabled: boolean;
  solarBeamMode: boolean; // extra warm glow

  // UI & Visual Customization State
  themeMode: ThemeMode; // 'light' | 'dark' | 'auto'
  systemFont: SystemFont;
  systemFontSize: SystemFontSize;
  systemTextColor: TextColorTint;
  activeIconPack: IconPackId;
  customAppIcons: Record<string, CustomAppIconOverride>;
  parallaxEnabled: boolean;
  parallaxIntensity: number; // 1 to 3
  wallpaperAutoCycle: boolean;
  wallpaperCycleIntervalSec: number;

  // Deep System Integration State
  statusBarStyle: StatusBarStyle;
  batteryStyle: BatteryStyle;
  signalStyle: SignalStyle;
  clockPosition: ClockPosition;
  controlCenterAccent: ControlCenterAccent;
  notificationCardStyle: NotificationCardStyle;

  // Lock Screen & AOD
  lockClockStyle: LockScreenClockStyle;
  lockWidgets: LockScreenWidgetId[];
  aodEnabled: boolean;
  aodTheme: AODThemeId;
  aodCustomText: string;

  // Boot Animation
  bootAnimation: BootAnimationId;

  // Lightweight Performance, Battery & Ad-Free UX
  performanceMode: PerformanceMode;
  batterySaver: boolean; // Eco low-power mode, pauses heavy animations & blur
  reduceMotion: boolean; // Smooth transitions without 3D tilt overhead
  ramUsageMb: number; // e.g. 1180 MB
  maxRamMb: number; // e.g. 6144 MB
  adFreeVerified: boolean; // 100% Ad-Free SolOS verification

  // Sound Packs & Audio Customization
  activeSoundPack: SoundPackId;
  typingSoundsEnabled: boolean;
}

export interface NotificationItem {
  id: string;
  appId: AppId;
  appName: string;
  title: string;
  message: string;
  timeAgo: string;
  iconEmoji: string;
  unread: boolean;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  date: string;
  color: string;
}
