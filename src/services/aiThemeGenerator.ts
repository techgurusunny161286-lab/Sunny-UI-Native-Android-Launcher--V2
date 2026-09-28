import {
  ThemePreset,
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
  SoundPackId,
} from '../types/launcher';
import { WALLPAPERS_COLLECTION } from '../data/customizationData';

export interface AIThemeGenerationResult {
  preset: ThemePreset;
  rationale: string;
  moodTags: string[];
  dominantHex: string;
  secondaryHex: string;
  soundPack: SoundPackId;
}

export const MOOD_INSPIRATION_PRESETS = [
  { label: '⚡ Cyberpunk Neon', mood: 'High energy electric cyan and neon magenta cyberpunk matrix in Tokyo rain' },
  { label: '🌸 Sakura Anime', mood: 'Gentle pastel cherry blossoms, nostalgic Japanese anime sunrise and soft warmth' },
  { label: '☕ Cozy Autumn Lo-Fi', mood: 'Cozy autumn coffee shop, warm amber fireplace, fallen leaves and lo-fi comfort' },
  { label: '🌌 Deep Cosmic Odyssey', mood: 'Deep ultraviolet nebula starfields, mysterious black holes and cosmic dust' },
  { label: '🎋 Serene Zen Sanctuary', mood: 'Peaceful bamboo rain forest, morning dew on moss, singing bowls and zen quiet' },
  { label: '👑 24K Obsidian Luxury', mood: 'Pure black obsidian luxury timepiece electroplated with 24K liquid gold' },
  { label: '❄️ Glacial Nordic Minimal', mood: 'Clean Scandinavian arctic ice, pure white fog, architectural minimalism' },
  { label: '🕹️ 1980s Retro Synthwave', mood: 'Neon grid sunset, 8-bit chiptune arcade nostalgia, outrun synthwave aesthetic' },
  { label: '🌿 Botanical Emerald', mood: 'Lush tropical rainforest greenhouse, deep emerald leaves and warm morning sunbeams' },
];

/**
 * Intelligent procedural generator fallback that always produces
 * vibrant, aesthetically coherent themes based on mood keywords or wallpaper.
 */
function generateProceduralAITheme(mood: string, currentWallpaperId?: string): AIThemeGenerationResult {
  const m = mood.toLowerCase();

  // Match based on keywords
  const isCyber = m.includes('cyber') || m.includes('neon') || m.includes('matrix') || m.includes('hacker') || m.includes('electric') || m.includes('future') || m.includes('sci-fi');
  const isAnime = m.includes('anime') || m.includes('sakura') || m.includes('cherry') || m.includes('kawaii') || m.includes('ghibli') || m.includes('manga') || m.includes('pastel') || m.includes('cute');
  const isNature = m.includes('nature') || m.includes('zen') || m.includes('bamboo') || m.includes('forest') || m.includes('green') || m.includes('leaf') || m.includes('rain') || m.includes('botanical');
  const isLuxury = m.includes('luxury') || m.includes('gold') || m.includes('24k') || m.includes('royal') || m.includes('diamond') || m.includes('rich') || m.includes('obsidian') || m.includes('elegance');
  const isRetro = m.includes('retro') || m.includes('80s') || m.includes('synth') || m.includes('arcade') || m.includes('pixel') || m.includes('vintage') || m.includes('lo-fi') || m.includes('macintosh');
  const isCozy = m.includes('cozy') || m.includes('autumn') || m.includes('coffee') || m.includes('warm') || m.includes('sunset') || m.includes('amber');
  const isCosmic = m.includes('cosmic') || m.includes('space') || m.includes('galaxy') || m.includes('star') || m.includes('nebula') || m.includes('universe');

  let name = 'AI Sol Aesthetic';
  let badge = 'AI Generated';
  let rationale = 'AI analyzed your mood prompt and synthesized a balanced color hierarchy, responsive typography, and matching sound effects.';
  let wallpaper = currentWallpaperId || 'golden';
  let iconPack: IconPackId = 'ios-glass';
  let themeMode: 'light' | 'dark' = 'light';
  let systemFont: SystemFont = 'sf-pro';
  let systemFontSize: SystemFontSize = 'standard';
  let systemTextColor: TextColorTint = 'adaptive';
  let statusBarStyle: StatusBarStyle = 'ios-classic';
  let batteryStyle: BatteryStyle = 'capsule-outside';
  let signalStyle: SignalStyle = 'bars';
  let clockPosition: ClockPosition = 'left';
  let controlCenterAccent: ControlCenterAccent = 'amber';
  let lockClockStyle: LockScreenClockStyle = 'ios-depth';
  let aodTheme: AODThemeId = 'eclipse-ring';
  let bootAnimation: BootAnimationId = 'solar-flare';
  let soundPack: SoundPackId = 'solar-harmonix';
  let previewBg = 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 50%, #fde047 100%)';
  let dominantHex = '#F59E0B';
  let secondaryHex = '#D97706';
  let moodTags = ['Harmonious', 'Solar', 'Adaptive'];

  if (isCyber) {
    name = 'AI Cyber Matrix 2099';
    badge = 'AI Neon Cyber';
    rationale = `Matched neon cyberpunk aesthetics: Pitch OLED obsidian background with bioluminescent cyan rim lighting, Orbitron sci-fi typography, and FM synth key clicks.`;
    wallpaper = 'live-aurora';
    iconPack = 'neon-cyber';
    themeMode = 'dark';
    systemFont = 'orbitron';
    systemTextColor = 'mint';
    statusBarStyle = 'cyber-neon';
    batteryStyle = 'circle-meter';
    signalStyle = 'cyber';
    clockPosition = 'center';
    controlCenterAccent = 'blue';
    lockClockStyle = 'cyber-hud';
    aodTheme = 'bioluminescent-wave';
    bootAnimation = 'cyber-matrix';
    soundPack = 'cyber-neon';
    previewBg = 'linear-gradient(135deg, #09090b 0%, #032b30 50%, #0891b2 100%)';
    dominantHex = '#00F0FF';
    secondaryHex = '#10B981';
    moodTags = ['Cyberpunk', 'High-Tech', 'Neon Glow', 'Futuristic'];
  } else if (isAnime) {
    name = 'AI Sakura Dreamscape';
    badge = 'AI Anime Pastel';
    rationale = `Synthesized romantic anime aesthetics: Cherry blossom pink gradient, warm tactile clay squircles, Outfit rounded typography, and nostalgic 8-bit chime sounds.`;
    wallpaper = 'prism';
    iconPack = 'retro-clay';
    themeMode = 'light';
    systemFont = 'outfit';
    systemTextColor = 'rose';
    statusBarStyle = 'pill-compact';
    batteryStyle = 'capsule-inside';
    signalStyle = 'bars';
    clockPosition = 'center';
    controlCenterAccent = 'coral';
    lockClockStyle = 'retro-flip';
    aodTheme = 'star-map';
    bootAnimation = 'nebula-ignition';
    soundPack = '8bit-arcade';
    previewBg = 'linear-gradient(135deg, #fbcfe8 0%, #f472b6 40%, #c084fc 100%)';
    dominantHex = '#F43F5E';
    secondaryHex = '#C084FC';
    moodTags = ['Anime', 'Sakura', 'Pastel Pink', 'Dreamy'];
  } else if (isNature) {
    name = 'AI Zen Rainforest Sanctuary';
    badge = 'AI Eco Nature';
    rationale = `Grounded in organic mindfulness: Deep botanical foliage hues, restorative emerald accents, soothing wooden bamboo water taps, and sun arc sundial clock.`;
    wallpaper = 'botanical-emerald';
    iconPack = 'retro-clay';
    themeMode = 'dark';
    systemFont = 'outfit';
    systemTextColor = 'mint';
    statusBarStyle = 'ios-classic';
    batteryStyle = 'circle-meter';
    signalStyle = 'dots';
    clockPosition = 'left';
    controlCenterAccent = 'emerald';
    lockClockStyle = 'solar-sundial';
    aodTheme = 'analog-sundial';
    bootAnimation = 'solar-flare';
    soundPack = 'zen-bamboo';
    previewBg = 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)';
    dominantHex = '#10B981';
    secondaryHex = '#059669';
    moodTags = ['Zen', 'Bamboo', 'Emerald Forest', 'Mindful'];
  } else if (isLuxury) {
    name = 'AI 24K Sovereign Solstice';
    badge = 'AI 24K Luxury';
    rationale = `Infused with regal horology: Pitch-black obsidian crystals bordered by 24K liquid gold, Playfair luxury serif typography, and tactile mechanical typewriter feedback.`;
    wallpaper = 'parallax-dunes';
    iconPack = 'golden-solstice';
    themeMode = 'dark';
    systemFont = 'playfair';
    systemFontSize = 'large';
    systemTextColor = 'amber';
    statusBarStyle = 'pill-compact';
    batteryStyle = 'capsule-inside';
    signalStyle = 'bars';
    clockPosition = 'center';
    controlCenterAccent = 'amber';
    lockClockStyle = 'solar-sundial';
    aodTheme = 'analog-sundial';
    bootAnimation = 'solar-flare';
    soundPack = 'mechanical-typewriter';
    previewBg = 'linear-gradient(135deg, #1c150c 0%, #78350f 45%, #f59e0b 100%)';
    dominantHex = '#F59E0B';
    secondaryHex = '#D97706';
    moodTags = ['24K Gold', 'Luxury', 'Obsidian', 'Editorial'];
  } else if (isRetro) {
    name = 'AI Synthwave 1984 Arcade';
    badge = 'AI Retro Synth';
    rationale = `Reconstructed 80s arcade nostalgia: Pixel purple and crimson neon gradients, JetBrains monospace metrics, and authentic 8-bit square-wave audio chimes.`;
    wallpaper = 'parallax-nebula';
    iconPack = 'neon-cyber';
    themeMode = 'dark';
    systemFont = 'jetbrains';
    systemTextColor = 'rose';
    statusBarStyle = 'cyber-neon';
    batteryStyle = 'circle-meter';
    signalStyle = 'cyber';
    clockPosition = 'right';
    controlCenterAccent = 'purple';
    lockClockStyle = 'retro-flip';
    aodTheme = 'bioluminescent-wave';
    bootAnimation = 'retro-mac';
    soundPack = '8bit-arcade';
    previewBg = 'linear-gradient(135deg, #312e81 0%, #831843 45%, #f43f5e 100%)';
    dominantHex = '#F43F5E';
    secondaryHex = '#818CF8';
    moodTags = ['Retro 80s', 'Synthwave', 'Pixel', 'Chiptune'];
  } else if (isCozy) {
    name = 'AI Amber Autumn Twilight';
    badge = 'AI Cozy Warm';
    rationale = `Formulated for cozy tranquility: Terracotta sunset hues, warm amber typography, liquid glass squircles, and gentle acoustic solar sound synthesis.`;
    wallpaper = 'sunset';
    iconPack = 'ios-glass';
    themeMode = 'light';
    systemFont = 'jakarta';
    systemTextColor = 'amber';
    statusBarStyle = 'ios-classic';
    batteryStyle = 'capsule-outside';
    signalStyle = 'bars';
    clockPosition = 'left';
    controlCenterAccent = 'coral';
    lockClockStyle = 'ios-depth';
    aodTheme = 'eclipse-ring';
    bootAnimation: 'solar-flare';
    soundPack = 'solar-harmonix';
    previewBg = 'linear-gradient(135deg, #fb923c 0%, #ea580c 45%, #7c2d12 100%)';
    dominantHex = '#EA580C';
    secondaryHex = '#F59E0B';
    moodTags = ['Autumn', 'Warm Amber', 'Sunset Glow', 'Comfort'];
  } else if (isCosmic) {
    name = 'AI Solar Nebula Voyager';
    badge = 'AI Cosmic Deep';
    rationale = `Crafted for celestial exploration: Multi-plane stellar nebula backdrop, crystal frosted refractive squircles, and pure crystalline harmonic tones.`;
    wallpaper = 'live-starfield';
    iconPack = 'frost-crystal';
    themeMode = 'dark';
    systemFont = 'orbitron';
    systemTextColor = 'white';
    statusBarStyle = 'pill-compact';
    batteryStyle = 'circle-meter';
    signalStyle = 'cyber';
    clockPosition = 'center';
    controlCenterAccent = 'blue';
    lockClockStyle = 'cyber-hud';
    aodTheme = 'star-map';
    bootAnimation = 'nebula-ignition';
    soundPack = 'ethereal-crystal';
    previewBg = 'linear-gradient(135deg, #09090b 0%, #1e1b4b 60%, #431407 100%)';
    dominantHex = '#818CF8';
    secondaryHex = '#06B6D4';
    moodTags = ['Cosmic', 'Nebula', 'Deep Space', 'Crystalline'];
  }

  const preset: ThemePreset = {
    id: `ai-gen-${Date.now()}`,
    name,
    badge,
    description: rationale,
    previewBg,
    wallpaper,
    iconPack,
    themeMode,
    systemFont,
    systemFontSize,
    systemTextColor,
    statusBarStyle,
    batteryStyle,
    signalStyle,
    clockPosition,
    controlCenterAccent,
    notificationCardStyle: themeMode === 'dark' ? 'minimal-outline' : 'glass-blur',
    lockClockStyle,
    lockWidgets: ['weather', 'battery', 'golden-hour'],
    aodTheme,
    bootAnimation,
    soundPack,
  };

  return {
    preset,
    rationale,
    moodTags,
    dominantHex,
    secondaryHex,
    soundPack,
  };
}

/**
 * Main AI Theme Generation function:
 * Attempts server-side Gemini API call via `/api/generate-theme`.
 * If unavailable, smoothly falls back to procedural engine.
 */
export async function generateAITheme(
  mood: string,
  currentWallpaperId?: string
): Promise<AIThemeGenerationResult> {
  try {
    const res = await fetch('/api/generate-theme', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, currentWallpaperId }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.preset) {
        return data;
      }
    }
  } catch {
    // Server route offline or not deployed yet, proceed to robust procedural AI generator
  }

  // Fallback to high-fidelity procedural generation
  return generateProceduralAITheme(mood, currentWallpaperId);
}
