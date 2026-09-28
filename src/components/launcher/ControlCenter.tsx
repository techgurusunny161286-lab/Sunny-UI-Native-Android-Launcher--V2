import React, { useState, useRef } from 'react';
import {
  Wifi,
  Bluetooth,
  Sun,
  Moon,
  Volume2,
  Volume1,
  VolumeX,
  Flashlight,
  Zap,
  Radio,
  Sparkles,
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Plane,
  Lock,
  Airplay,
  Timer,
  Calculator,
  Camera,
  ChevronDown,
} from 'lucide-react';
import { SolarState, AppDefinition, SoundPackId } from '../../types/launcher';
import { solarSound, SOUND_PACKS } from '../../utils/solarSound';

interface ControlCenterProps {
  solarState: SolarState;
  onClose: () => void;
  onUpdateBrightness: (brightness: number) => void;
  onUpdateVolume: (volume: number) => void;
  onToggleWifi: () => void;
  onToggleBluetooth: () => void;
  onToggleFlashlight: () => void;
  onToggleSolarBeam: () => void;
  onToggleSolarCharge: () => void;
  onLaunchApp?: (appId: string) => void;
  onToggleThemeMode?: () => void;
  onTriggerVisualCustomizer?: (tab?: 'store' | 'diy' | 'ai' | 'sounds' | 'icons' | 'wallpapers' | 'system' | 'lockscreen' | 'aod' | 'boot' | 'fonts' | 'theme') => void;
  onUpdateSolarState?: (updates: Partial<SolarState>) => void;
  onLockPhone?: () => void;
  onEnterAOD?: () => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  solarState,
  onClose,
  onUpdateBrightness,
  onUpdateVolume,
  onToggleWifi,
  onToggleBluetooth,
  onToggleFlashlight,
  onToggleSolarBeam,
  onToggleSolarCharge,
  onLaunchApp,
  onToggleThemeMode,
  onTriggerVisualCustomizer,
  onUpdateSolarState,
  onLockPhone,
  onEnterAOD,
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(solarSound.isMusicActive());
  const [airplaneMode, setAirplaneMode] = useState(false);
  const [cellularData, setCellularData] = useState(true);
  const [orientationLock, setOrientationLock] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [screenMirroring, setScreenMirroring] = useState(false);
  const [activeNetworkStatus, setActiveNetworkStatus] = useState<string>('Sunny-5G');

  const brightnessRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  // Toggle sunny music player
  const handleToggleMusic = () => {
    solarSound.playTap(solarState.soundEnabled);
    if (isPlayingMusic) {
      solarSound.stopSunnyMusic();
      setIsPlayingMusic(false);
    } else {
      solarSound.startSunnyMusic(solarState.volume / 100);
      setIsPlayingMusic(true);
    }
  };

  // Drag and click handling for iOS Vertical Brightness Slider
  const handleBrightnessChange = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!brightnessRef.current) return;
    const rect = brightnessRef.current.getBoundingClientRect();
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const offsetY = rect.bottom - clientY;
    const percentage = Math.max(10, Math.min(100, Math.round((offsetY / rect.height) * 100)));
    onUpdateBrightness(percentage);
  };

  // Drag and click handling for iOS Vertical Volume Slider
  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const offsetY = rect.bottom - clientY;
    const percentage = Math.max(0, Math.min(100, Math.round((offsetY / rect.height) * 100)));
    onUpdateVolume(percentage);
    solarSound.playTap(solarState.soundEnabled);
  };

  return (
    <div
      onClick={onClose}
      className="absolute inset-0 z-50 bg-black/65 backdrop-blur-3xl flex flex-col justify-between p-4.5 animate-in fade-in duration-200 select-none overflow-y-auto no-scrollbar"
      style={{
        WebkitBackdropFilter: 'blur(40px)',
      }}
    >
      {/* Container preventing backdrop click close */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full flex flex-col space-y-3.5 pt-1 pb-4"
      >
        {/* iOS Top Status & Drag Handle */}
        <div className="flex flex-col items-center justify-center pt-1 pb-1">
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              onClose();
            }}
            className="w-12 h-1.5 bg-white/40 hover:bg-white/70 active:scale-95 rounded-full transition-all cursor-pointer mb-2"
            title="Dismiss Control Center"
          />
          <div className="w-full flex items-center justify-between text-white/90 px-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-semibold tracking-tight">
                Control Center
              </span>
            </div>
            <button
              onClick={() => {
                solarSound.playTap(solarState.soundEnabled);
                onClose();
              }}
              className="w-7 h-7 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center hover:bg-white/25 active:scale-95 transition-all text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Top Section: 2x2 Network Platter & Now Playing Platter */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Authentic iOS 2x2 Connectivity Platter */}
          <div className="bg-[#1c1c1e]/80 backdrop-blur-2xl rounded-[26px] p-3 border border-white/10 shadow-[0_12px_28px_rgba(0,0,0,0.35)] flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-2.5 place-items-center">
              {/* Airplane Mode */}
              <button
                onClick={() => {
                  solarSound.playTap(solarState.soundEnabled);
                  setAirplaneMode(!airplaneMode);
                  setActiveNetworkStatus(!airplaneMode ? 'Airplane Mode' : 'Connected');
                }}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${
                  airplaneMode
                    ? 'bg-[#ff9500] text-white shadow-[0_0_14px_rgba(255,149,0,0.5)]'
                    : 'bg-white/15 text-white/90 hover:bg-white/25'
                }`}
                title="Airplane Mode"
              >
                <Plane className="w-5 h-5 -rotate-45" />
              </button>

              {/* Cellular Data */}
              <button
                onClick={() => {
                  solarSound.playTap(solarState.soundEnabled);
                  setCellularData(!cellularData);
                  setActiveNetworkStatus(!cellularData ? 'Cellular LTE' : 'No Cellular');
                }}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${
                  cellularData && !airplaneMode
                    ? 'bg-[#34c759] text-white shadow-[0_0_14px_rgba(52,199,89,0.5)]'
                    : 'bg-white/15 text-white/90 hover:bg-white/25'
                }`}
                title="Cellular Data"
              >
                <Radio className="w-5 h-5" />
              </button>

              {/* Wi-Fi */}
              <button
                onClick={() => {
                  solarSound.playTap(solarState.soundEnabled);
                  onToggleWifi();
                  setActiveNetworkStatus(!solarState.wifiEnabled ? 'Sunny-5G' : 'Wi-Fi Off');
                }}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${
                  solarState.wifiEnabled && !airplaneMode
                    ? 'bg-[#007aff] text-white shadow-[0_0_14px_rgba(0,122,255,0.5)]'
                    : 'bg-white/15 text-white/90 hover:bg-white/25'
                }`}
                title="Wi-Fi"
              >
                <Wifi className="w-5 h-5" />
              </button>

              {/* Bluetooth */}
              <button
                onClick={() => {
                  solarSound.playTap(solarState.soundEnabled);
                  onToggleBluetooth();
                }}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 ${
                  solarState.bluetoothEnabled && !airplaneMode
                    ? 'bg-[#007aff] text-white shadow-[0_0_14px_rgba(0,122,255,0.5)]'
                    : 'bg-white/15 text-white/90 hover:bg-white/25'
                }`}
                title="Bluetooth"
              >
                <Bluetooth className="w-5 h-5" />
              </button>
            </div>

            {/* Connection Subtitle */}
            <div className="mt-2 text-center">
              <span className="text-[10px] font-medium text-white/60 truncate block">
                {airplaneMode ? 'Airplane Mode On' : activeNetworkStatus}
              </span>
            </div>
          </div>

          {/* Authentic iOS Now Playing Media Platter */}
          <div className="bg-[#1c1c1e]/80 backdrop-blur-2xl rounded-[26px] p-3.5 border border-white/10 shadow-[0_12px_28px_rgba(0,0,0,0.35)] flex flex-col justify-between">
            {/* Header: Track & Artist */}
            <div className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-[10px] bg-gradient-to-tr from-rose-500 via-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-md overflow-hidden">
                <span className="text-sm">☀️</span>
                <div className="absolute inset-0 bg-white/20 pointer-events-none rounded-[10px]" />
              </div>
              <div className="overflow-hidden flex-1">
                <h4 className="font-semibold text-xs text-white truncate tracking-tight">
                  Golden Hour
                </h4>
                <p className="text-[10px] text-white/60 font-medium truncate">
                  Sol Acoustic · 3D
                </p>
              </div>
            </div>

            {/* Progress Scrubber */}
            <div className="w-full my-2">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-white rounded-full transition-all duration-300 ${
                    isPlayingMusic ? 'w-2/3 animate-pulse' : 'w-1/3'
                  }`}
                />
              </div>
              <div className="flex justify-between text-[8px] text-white/50 font-mono mt-0.5">
                <span>1:42</span>
                <span>3:15</span>
              </div>
            </div>

            {/* Controls: Prev, Play/Pause, Next */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => solarSound.playTap(solarState.soundEnabled)}
                className="w-7 h-7 rounded-full text-white/80 hover:text-white flex items-center justify-center active:scale-90 transition-transform"
              >
                <SkipBack className="w-3.5 h-3.5 fill-current" />
              </button>
              <button
                onClick={handleToggleMusic}
                className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-90 transition-transform"
              >
                {isPlayingMusic ? (
                  <Pause className="w-4 h-4 fill-current text-black" />
                ) : (
                  <Play className="w-4 h-4 fill-current text-black ml-0.5" />
                )}
              </button>
              <button
                onClick={() => solarSound.playTap(solarState.soundEnabled)}
                className="w-7 h-7 rounded-full text-white/80 hover:text-white flex items-center justify-center active:scale-90 transition-transform"
              >
                <SkipForward className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Orientation Lock, AirPlay Screen Mirroring & Focus */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Split Left Column: Orientation Lock & Screen Mirroring */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Orientation Lock */}
            <button
              onClick={() => {
                solarSound.playTap(solarState.soundEnabled);
                setOrientationLock(!orientationLock);
              }}
              className={`h-14 rounded-[20px] bg-[#1c1c1e]/80 backdrop-blur-2xl border border-white/10 flex flex-col items-center justify-center transition-all duration-200 active:scale-95 shadow-[0_8px_20px_rgba(0,0,0,0.3)] ${
                orientationLock ? 'text-[#ff453a]' : 'text-white/80 hover:text-white'
              }`}
              title="Portrait Orientation Lock"
            >
              <Lock className="w-5 h-5" />
              <span className="text-[9px] font-medium mt-0.5 text-white/70">Lock</span>
            </button>

            {/* Screen Mirroring */}
            <button
              onClick={() => {
                solarSound.playTap(solarState.soundEnabled);
                setScreenMirroring(!screenMirroring);
              }}
              className={`h-14 rounded-[20px] bg-[#1c1c1e]/80 backdrop-blur-2xl border border-white/10 flex flex-col items-center justify-center transition-all duration-200 active:scale-95 shadow-[0_8px_20px_rgba(0,0,0,0.3)] ${
                screenMirroring ? 'bg-white/30 text-white' : 'text-white/80 hover:text-white'
              }`}
              title="Screen Mirroring"
            >
              <Airplay className="w-5 h-5" />
              <span className="text-[9px] font-medium mt-0.5 text-white/70">Mirror</span>
            </button>
          </div>

          {/* Right Column: Focus / Do Not Disturb Platter */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              setFocusMode(!focusMode);
            }}
            className={`h-14 rounded-[22px] bg-[#1c1c1e]/80 backdrop-blur-2xl border border-white/10 px-3.5 flex items-center justify-between transition-all duration-200 active:scale-95 shadow-[0_8px_20px_rgba(0,0,0,0.3)] ${
              focusMode ? 'ring-2 ring-purple-400 text-purple-300' : 'text-white/90 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  focusMode ? 'bg-purple-600 text-white' : 'bg-white/15 text-white'
                }`}
              >
                <Moon className="w-4 h-4 fill-current" />
              </div>
              <div className="text-left">
                <span className="text-xs font-semibold block text-white">Focus</span>
                <span className="text-[9px] text-white/60">
                  {focusMode ? 'Solar Solitude' : 'Off'}
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Row 3: Authentic iOS Vertical Sliders for Brightness & Volume */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* iOS Display Brightness Vertical Slider */}
          <div
            ref={brightnessRef}
            onClick={handleBrightnessChange}
            onMouseMove={(e) => {
              if (e.buttons === 1) handleBrightnessChange(e);
            }}
            onTouchMove={handleBrightnessChange}
            className="h-38 rounded-[26px] bg-[#1c1c1e]/80 backdrop-blur-2xl border border-white/10 shadow-[0_12px_28px_rgba(0,0,0,0.35)] relative overflow-hidden flex flex-col justify-between p-3.5 select-none cursor-ns-resize"
          >
            {/* White Liquid Glass Fill Layer */}
            <div
              className="absolute bottom-0 inset-x-0 bg-white transition-all duration-100 pointer-events-none rounded-b-[24px]"
              style={{ height: `${solarState.brightness}%` }}
            />

            {/* Percentage Badge */}
            <div className="relative z-10 flex items-center justify-between text-xs font-semibold">
              <span
                className={`font-mono text-[10px] font-bold transition-colors ${
                  solarState.brightness > 80 ? 'text-slate-900' : 'text-white'
                }`}
              >
                {solarState.brightness}%
              </span>
            </div>

            {/* Center Sun Glyph adapting color for contrast */}
            <div className="relative z-10 flex items-center justify-center pb-1 pointer-events-none">
              <Sun
                className={`w-6 h-6 transition-colors duration-150 ${
                  solarState.brightness > 40 ? 'text-slate-900' : 'text-white'
                }`}
              />
            </div>
          </div>

          {/* iOS Volume Vertical Slider */}
          <div
            ref={volumeRef}
            onClick={handleVolumeChange}
            onMouseMove={(e) => {
              if (e.buttons === 1) handleVolumeChange(e);
            }}
            onTouchMove={handleVolumeChange}
            className="h-38 rounded-[26px] bg-[#1c1c1e]/80 backdrop-blur-2xl border border-white/10 shadow-[0_12px_28px_rgba(0,0,0,0.35)] relative overflow-hidden flex flex-col justify-between p-3.5 select-none cursor-ns-resize"
          >
            {/* White Liquid Glass Fill Layer */}
            <div
              className="absolute bottom-0 inset-x-0 bg-white transition-all duration-100 pointer-events-none rounded-b-[24px]"
              style={{ height: `${solarState.volume}%` }}
            />

            {/* Percentage Badge */}
            <div className="relative z-10 flex items-center justify-between text-xs font-semibold">
              <span
                className={`font-mono text-[10px] font-bold transition-colors ${
                  solarState.volume > 80 ? 'text-slate-900' : 'text-white'
                }`}
              >
                {solarState.volume}%
              </span>
            </div>

            {/* Center Speaker Glyph adapting color for contrast */}
            <div className="relative z-10 flex items-center justify-center pb-1 pointer-events-none">
              {solarState.volume === 0 ? (
                <VolumeX className="w-6 h-6 text-white/60" />
              ) : solarState.volume < 50 ? (
                <Volume1
                  className={`w-6 h-6 transition-colors duration-150 ${
                    solarState.volume > 40 ? 'text-slate-900' : 'text-white'
                  }`}
                />
              ) : (
                <Volume2
                  className={`w-6 h-6 transition-colors duration-150 ${
                    solarState.volume > 40 ? 'text-slate-900' : 'text-white'
                  }`}
                />
              )}
            </div>
          </div>
        </div>

        {/* Row 4: Authentic 4 iOS Utility Actions (Flashlight, Timer, Calculator, Camera) */}
        <div className="grid grid-cols-4 gap-2.5">
          {/* Flashlight */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              onToggleFlashlight();
            }}
            className={`h-15 rounded-[20px] flex flex-col items-center justify-center transition-all duration-200 active:scale-90 border border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.3)] ${
              solarState.flashlightEnabled
                ? 'bg-[#ffd60a] text-slate-950 shadow-[0_0_18px_rgba(255,214,10,0.6)] font-bold'
                : 'bg-[#1c1c1e]/80 text-white/90 hover:bg-[#2c2c2e]'
            }`}
            title="Flashlight"
          >
            <Flashlight className="w-5 h-5" />
            <span className="text-[9px] font-medium mt-1">Torch</span>
          </button>

          {/* Timer */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              setTimerActive(!timerActive);
            }}
            className={`h-15 rounded-[20px] flex flex-col items-center justify-center transition-all duration-200 active:scale-90 border border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.3)] ${
              timerActive
                ? 'bg-[#ff9f0a] text-white shadow-[0_0_18px_rgba(255,159,10,0.5)] font-bold'
                : 'bg-[#1c1c1e]/80 text-white/90 hover:bg-[#2c2c2e]'
            }`}
            title="Timer"
          >
            <Timer className="w-5 h-5" />
            <span className="text-[9px] font-medium mt-1">Timer</span>
          </button>

          {/* Calculator - Direct App Launcher */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              if (onLaunchApp) {
                onLaunchApp('solarcalc');
              }
            }}
            className="h-15 rounded-[20px] bg-[#1c1c1e]/80 text-white/90 hover:bg-[#2c2c2e] border border-white/10 flex flex-col items-center justify-center transition-all duration-200 active:scale-90 shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
            title="Calculator"
          >
            <Calculator className="w-5 h-5" />
            <span className="text-[9px] font-medium mt-1">Calculator</span>
          </button>

          {/* Camera - Direct App Launcher */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              if (onLaunchApp) {
                onLaunchApp('solarcam');
              }
            }}
            className="h-15 rounded-[20px] bg-[#1c1c1e]/80 text-white/90 hover:bg-[#2c2c2e] border border-white/10 flex flex-col items-center justify-center transition-all duration-200 active:scale-90 shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
            title="Camera"
          >
            <Camera className="w-5 h-5" />
            <span className="text-[9px] font-medium mt-1">Camera</span>
          </button>
        </div>

        {/* Row 5: Sunny ☀️ Special Innovations (Sol Power & Sol Flare) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Photovoltaic Solar Power Harvesting */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              onToggleSolarCharge();
            }}
            className={`h-13 rounded-[20px] px-3 flex items-center justify-between border border-white/10 transition-all duration-200 active:scale-95 shadow-[0_8px_20px_rgba(0,0,0,0.3)] ${
              solarState.solarCharging
                ? 'bg-[#30d158] text-slate-950 font-semibold shadow-[0_0_18px_rgba(48,209,88,0.5)]'
                : 'bg-[#1c1c1e]/80 text-white/90 hover:bg-[#2c2c2e]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap
                className={`w-4 h-4 ${
                  solarState.solarCharging ? 'fill-slate-950 animate-bounce' : 'text-emerald-400'
                }`}
              />
              <div className="text-left">
                <span className="text-xs font-semibold block leading-tight">Sol Power</span>
                <span className="text-[9px] opacity-75">
                  {solarState.solarCharging ? 'Harvesting' : `${solarState.solarWattage} W/m²`}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold">
              {solarState.solarCharging ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Sol Flare Optical Bloom Mode */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              onToggleSolarBeam();
            }}
            className={`h-13 rounded-[20px] px-3 flex items-center justify-between border border-white/10 transition-all duration-200 active:scale-95 shadow-[0_8px_20px_rgba(0,0,0,0.3)] ${
              solarState.solarBeamMode
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-[0_0_18px_rgba(245,158,11,0.5)]'
                : 'bg-[#1c1c1e]/80 text-white/90 hover:bg-[#2c2c2e]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sun
                className={`w-4 h-4 ${
                  solarState.solarBeamMode ? 'animate-spin' : 'text-amber-400'
                }`}
                style={{ animationDuration: '14s' }}
              />
              <div className="text-left">
                <span className="text-xs font-semibold block leading-tight">Sol Flare</span>
                <span className="text-[9px] opacity-75">Sun Ray Bloom</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold">
              {solarState.solarBeamMode ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {/* Row: Smart Theme Studio & Sound Pack Switcher */}
        <div className="grid grid-cols-2 gap-3">
          {/* Sound Pack Quick Switcher */}
          <button
            onClick={() => {
              const curIdx = SOUND_PACKS.findIndex((p) => p.id === solarState.activeSoundPack);
              const nextPack = SOUND_PACKS[(curIdx + 1) % SOUND_PACKS.length];
              if (onUpdateSolarState) {
                onUpdateSolarState({ activeSoundPack: nextPack.id });
              }
              solarSound.playTap(true, nextPack.id);
              solarSound.playNotification(true, nextPack.id);
            }}
            className="h-13 rounded-[20px] px-3 flex items-center justify-between border border-white/10 bg-[#1c1c1e]/80 text-white/90 hover:bg-[#2c2c2e] transition-all duration-200 active:scale-95 shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
            title="Cycle Active Sound Pack"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{SOUND_PACKS.find((p) => p.id === solarState.activeSoundPack)?.icon || '🎵'}</span>
              <div className="text-left">
                <span className="text-xs font-semibold block leading-tight">Sound Pack</span>
                <span className="text-[9px] text-emerald-400 font-medium truncate max-w-[85px] block">
                  {SOUND_PACKS.find((p) => p.id === solarState.activeSoundPack)?.name.split(' ')[0] || 'Solar'}
                </span>
              </div>
            </div>
            <span className="text-[9px] font-mono text-white/60 font-bold">NEXT</span>
          </button>

          {/* Theme Studio Quick Launch */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled, solarState.activeSoundPack);
              onClose();
              if (onLaunchApp) {
                onLaunchApp('solarstudio');
              } else if (onTriggerVisualCustomizer) {
                onTriggerVisualCustomizer('store');
              }
            }}
            className="h-13 rounded-[20px] px-3 flex items-center justify-between border border-amber-500/40 bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-purple-500/25 hover:from-amber-500/35 text-white transition-all duration-200 active:scale-95 shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
            title="Theme Studio: DIY, AI & Community Store"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">✨</span>
              <div className="text-left">
                <span className="text-xs font-semibold block leading-tight">Theme Studio</span>
                <span className="text-[9px] text-amber-300 font-medium">DIY · AI · Store</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400">OPEN</span>
          </button>
        </div>

        {/* Row 6: Universal Dark/Light Mode & Master Visual Customizer */}
        <div className="grid grid-cols-2 gap-3">
          {/* Universal Dark Mode Toggle (iOS Style) */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              if (onToggleThemeMode) {
                onToggleThemeMode();
              }
            }}
            className={`h-13 rounded-[20px] px-3 flex items-center justify-between border border-white/10 transition-all duration-200 active:scale-95 shadow-[0_8px_20px_rgba(0,0,0,0.3)] ${
              solarState.themeMode === 'dark' || (solarState.themeMode === 'auto' && solarState.sunPosition > 80)
                ? 'bg-blue-600 text-white font-semibold shadow-[0_0_18px_rgba(37,99,235,0.5)]'
                : 'bg-[#1c1c1e]/80 text-white/90 hover:bg-[#2c2c2e]'
            }`}
            title="Toggle Universal Dark / Light Mode"
          >
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 fill-current text-white" />
              <div className="text-left">
                <span className="text-xs font-semibold block leading-tight">Dark Mode</span>
                <span className="text-[9px] opacity-75">
                  {solarState.themeMode === 'auto'
                    ? 'Auto Circadian'
                    : solarState.themeMode === 'dark'
                    ? 'Always Dark'
                    : 'Light Mode'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold">
              {solarState.themeMode === 'dark' ? 'ON' : solarState.themeMode === 'auto' ? 'AUTO' : 'OFF'}
            </span>
          </button>

          {/* Master Look & Feel Customizer */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              onClose();
              if (onTriggerVisualCustomizer) {
                onTriggerVisualCustomizer('icons');
              }
            }}
            className="h-13 rounded-[20px] px-3 flex items-center justify-between border border-white/10 bg-[#1c1c1e]/80 text-white/90 hover:bg-[#2c2c2e] transition-all duration-200 active:scale-95 shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
            title="Open UI & Visual Customizer (Packs, Wallpapers, Fonts)"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <div className="text-left">
                <span className="text-xs font-semibold block leading-tight">Visual Studio</span>
                <span className="text-[9px] opacity-75">Packs & Fonts</span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400">
              OPEN
            </span>
          </button>
        </div>

        {/* Row 7: System Lock & AOD Shortcuts */}
        <div className="grid grid-cols-2 gap-3">
          {onLockPhone && (
            <button
              onClick={() => {
                solarSound.playTap(solarState.soundEnabled);
                onClose();
                onLockPhone();
              }}
              className="h-10 rounded-[18px] px-3 flex items-center justify-between border border-white/10 bg-[#1c1c1e]/70 text-white/90 hover:bg-[#2c2c2e] active:scale-95 transition-all shadow-sm"
              title="Lock Screen"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs">🔒</span>
                <span className="text-[11px] font-semibold">Lock Device</span>
              </div>
              <span className="text-[9px] font-mono text-slate-400">SLIDE</span>
            </button>
          )}

          {onEnterAOD && (
            <button
              onClick={() => {
                solarSound.playTap(solarState.soundEnabled);
                onClose();
                onEnterAOD();
              }}
              className="h-10 rounded-[18px] px-3 flex items-center justify-between border border-white/10 bg-[#1c1c1e]/70 text-white/90 hover:bg-[#2c2c2e] active:scale-95 transition-all shadow-sm"
              title="Enter Always-On Display"
            >
              <div className="flex items-center gap-2">
                <Moon className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-semibold">AOD Mode</span>
              </div>
              <span className="text-[9px] font-mono text-amber-400 font-bold">OLED</span>
            </button>
          )}
        </div>

        {/* Bottom Dismiss Bar Pill */}
        <div className="pt-2 flex justify-center">
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              onClose();
            }}
            className="w-32 h-1.5 bg-white/50 hover:bg-white/80 active:scale-95 rounded-full transition-all"
            title="Close Control Center"
          />
        </div>
      </div>
    </div>
  );
};
