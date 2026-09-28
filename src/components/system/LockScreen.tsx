import React, { useState } from 'react';
import {
  SolarState,
  LockScreenClockStyle,
  LockScreenWidgetId,
} from '../../types/launcher';
import {
  Lock,
  Unlock,
  Flashlight,
  Camera,
  Sun,
  Battery,
  BatteryCharging,
  Sparkles,
  Heart,
  Calendar,
  CloudSun,
  Moon,
  ChevronUp,
} from 'lucide-react';
import { solarSound } from '../../utils/solarSound';

interface LockScreenProps {
  solarState: SolarState;
  wallpaper: string;
  onUnlock: () => void;
  onEnterAOD: () => void;
  onLaunchCamera: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  solarState,
  wallpaper,
  onUnlock,
  onEnterAOD,
  onLaunchCamera,
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [torchActive, setTorchActive] = useState(solarState.flashlightEnabled);

  // Time format
  const hours = Math.floor(solarState.timeHours);
  const minutes = Math.floor((solarState.timeHours % 1) * 60);
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const timeString = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes}`;
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Days of week
  const dateStr = 'Sunday, September 27';

  const handleUnlockClick = () => {
    solarSound.playTap(solarState.soundEnabled);
    setIsUnlocked(true);
    setTimeout(() => {
      onUnlock();
    }, 280);
  };

  const handleToggleTorch = (e: React.MouseEvent) => {
    e.stopPropagation();
    solarSound.playTap(solarState.soundEnabled);
    setTorchActive(!torchActive);
  };

  // Render modular Lock Screen Widgets
  const renderWidget = (wId: LockScreenWidgetId) => {
    switch (wId) {
      case 'weather':
        return (
          <div
            key="weather"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 text-white shadow-xs"
          >
            <CloudSun className="w-4 h-4 text-amber-300" />
            <div className="text-left">
              <span className="font-bold text-[11px] leading-none block">
                {solarState.temperature}°C
              </span>
              <span className="text-[9px] opacity-75 font-medium">UV {solarState.uvIndex}</span>
            </div>
          </div>
        );

      case 'battery':
        return (
          <div
            key="battery"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 text-white shadow-xs"
          >
            {solarState.solarCharging ? (
              <BatteryCharging className="w-4 h-4 text-emerald-400 animate-pulse" />
            ) : (
              <Battery className="w-4 h-4 text-white" />
            )}
            <div className="text-left">
              <span className="font-bold text-[11px] leading-none block font-mono">
                {solarState.batteryLevel}%
              </span>
              <span className="text-[9px] opacity-75 font-medium">
                {solarState.solarCharging ? 'Harvesting' : 'Battery'}
              </span>
            </div>
          </div>
        );

      case 'golden-hour':
        return (
          <div
            key="golden-hour"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 text-white shadow-xs"
          >
            <Sun className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '20s' }} />
            <div className="text-left">
              <span className="font-bold text-[11px] leading-none block font-mono">
                {solarState.solarWattage} W
              </span>
              <span className="text-[9px] opacity-75 font-medium">Solar Arc</span>
            </div>
          </div>
        );

      case 'mindfulness':
        return (
          <div
            key="mindfulness"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 text-white shadow-xs"
          >
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400/60" />
            <div className="text-left">
              <span className="font-bold text-[11px] leading-none block">Breathe</span>
              <span className="text-[9px] opacity-75 font-medium">3m Ready</span>
            </div>
          </div>
        );

      case 'events':
      default:
        return (
          <div
            key="events"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 text-white shadow-xs"
          >
            <Calendar className="w-4 h-4 text-rose-400" />
            <div className="text-left">
              <span className="font-bold text-[11px] leading-none block">Golden Bluff</span>
              <span className="text-[9px] opacity-75 font-medium">6:20 PM</span>
            </div>
          </div>
        );
    }
  };

  // Render chosen Clock Style
  const renderClock = () => {
    switch (solarState.lockClockStyle) {
      case 'minimal-serif':
        return (
          <div className="flex flex-col items-center">
            <h1
              className="text-6xl sm:text-7xl font-light text-white tracking-widest drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              {timeString}
            </h1>
            <span className="text-xs uppercase tracking-[0.25em] text-white/80 font-medium mt-1">
              {solarState.timeOfDay.replace('_', ' ')}
            </span>
          </div>
        );

      case 'solar-sundial':
        return (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <Sun className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '30s' }} />
              <span className="text-xs font-mono text-amber-300 font-bold tracking-wider">
                SUN ARC {Math.round(solarState.sunPosition)}%
              </span>
            </div>
            <h1 className="text-6xl sm:text-7xl font-black text-white font-mono tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              {timeString}
            </h1>
          </div>
        );

      case 'retro-flip':
        return (
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-2xl bg-black/60 border border-white/20 backdrop-blur-xl shadow-2xl">
              <span className="text-5xl font-mono font-bold text-amber-400">
                {formattedHours < 10 ? `0${formattedHours}` : formattedHours}
              </span>
            </div>
            <span className="text-4xl font-bold text-white">:</span>
            <div className="px-4 py-2 rounded-2xl bg-black/60 border border-white/20 backdrop-blur-xl shadow-2xl">
              <span className="text-5xl font-mono font-bold text-amber-400">
                {minutes < 10 ? `0${minutes}` : minutes}
              </span>
            </div>
          </div>
        );

      case 'cyber-hud':
        return (
          <div className="flex flex-col items-center p-3 rounded-3xl bg-black/40 border border-cyan-400/40 backdrop-blur-xl shadow-[0_0_25px_rgba(6,182,212,0.3)]">
            <div className="flex items-center justify-between w-full text-[9px] font-mono text-cyan-400 font-bold px-1 mb-1">
              <span>SOLOS // SEC-01</span>
              <span>840 W/M²</span>
            </div>
            <h1
              className="text-6xl font-black text-white tracking-wider font-mono drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]"
              style={{ fontFamily: '"Orbitron", monospace' }}
            >
              {timeString}
            </h1>
          </div>
        );

      case 'ios-depth':
      default:
        return (
          <div className="flex flex-col items-center">
            <h1
              className="text-7xl sm:text-8xl font-black text-white/95 tracking-tighter drop-shadow-[0_6px_24px_rgba(0,0,0,0.55)] leading-none select-none"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
              }}
            >
              {timeString}
            </h1>
          </div>
        );
    }
  };

  return (
    <div
      onClick={handleUnlockClick}
      className={`absolute inset-0 z-50 flex flex-col justify-between p-6 select-none cursor-pointer transition-all duration-300 ${
        isUnlocked ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
      style={{
        background: 'transparent',
      }}
    >
      {/* Top Padlock & Date Section */}
      <div className="w-full flex flex-col items-center pt-8 space-y-2">
        <div className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xs">
          {isUnlocked ? (
            <Unlock className="w-4 h-4 text-emerald-400 animate-bounce" />
          ) : (
            <Lock className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Date Platter */}
        <span className="text-xs font-semibold text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] tracking-wide">
          {dateStr}
        </span>

        {/* Hero Clock */}
        {renderClock()}

        {/* Modular Lock Screen Widgets (Max 3) */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {solarState.lockWidgets.slice(0, 3).map((wId) => renderWidget(wId))}
        </div>
      </div>

      {/* Center Ambient Floating Space */}
      <div className="flex-1 flex items-center justify-center pointer-events-none">
        {solarState.solarCharging && (
          <div className="px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-xl border border-emerald-500/40 text-emerald-300 flex items-center gap-2 animate-pulse shadow-lg">
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold">Photovoltaic Charging 840 W/m²</span>
          </div>
        )}
      </div>

      {/* Bottom Actions: Torch, AOD Switch, Camera & Unlock Swipe Bar */}
      <div className="w-full flex flex-col items-center space-y-4 pb-2">
        {/* Quick Action Circle Buttons */}
        <div className="w-full flex items-center justify-between px-2">
          {/* Torch Button */}
          <button
            onClick={handleToggleTorch}
            className={`w-12 h-12 rounded-full backdrop-blur-xl border flex items-center justify-center transition-all duration-200 active:scale-90 shadow-lg ${
              torchActive
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.6)]'
                : 'bg-black/40 text-white border-white/25 hover:bg-black/60'
            }`}
            title="Torch"
          >
            <Flashlight className="w-5 h-5" />
          </button>

          {/* Center Always-On Display Mode Quick Pill */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              solarSound.playTap(solarState.soundEnabled);
              onEnterAOD();
            }}
            className="px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 active:scale-95 text-white/90 backdrop-blur-xl border border-white/20 transition-all text-[11px] font-semibold flex items-center gap-1.5 shadow-md"
            title="Enter AMOLED Always-On Display"
          >
            <Moon className="w-3.5 h-3.5 text-amber-400" />
            <span>AOD Mode</span>
          </button>

          {/* Camera Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              solarSound.playTap(solarState.soundEnabled);
              onLaunchCamera();
            }}
            className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 active:scale-90 text-white backdrop-blur-xl border border-white/25 flex items-center justify-center transition-all shadow-lg"
            title="Open Camera"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>

        {/* Swipe-Up Prompt & Apple Home Bar */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] text-white/70 font-semibold tracking-wider uppercase drop-shadow flex items-center gap-1 animate-pulse">
            <ChevronUp className="w-3.5 h-3.5" />
            <span>Swipe up or click to unlock</span>
          </span>
          <div className="w-36 h-1.5 bg-white/80 rounded-full shadow-md" />
        </div>
      </div>
    </div>
  );
};
