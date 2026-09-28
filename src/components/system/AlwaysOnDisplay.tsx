import React, { useState, useEffect } from 'react';
import { SolarState, AODThemeId } from '../../types/launcher';
import { Sun, Battery, Moon, Sparkles, MessageSquare, Bell, Heart } from 'lucide-react';
import { solarSound } from '../../utils/solarSound';

interface AlwaysOnDisplayProps {
  solarState: SolarState;
  onWake: () => void;
}

export const AlwaysOnDisplay: React.FC<AlwaysOnDisplayProps> = ({
  solarState,
  onWake,
}) => {
  const [shiftOffset, setShiftOffset] = useState({ x: 0, y: 0 });

  // Anti-burn-in periodic micro-shift (shifts slightly every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setShiftOffset({
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8,
      });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Time format
  const hours = Math.floor(solarState.timeHours);
  const minutes = Math.floor((solarState.timeHours % 1) * 60);
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const timeString = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes}`;
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const handleWake = () => {
    solarSound.playTap(solarState.soundEnabled);
    onWake();
  };

  // Render chosen AOD theme design
  const renderAODTheme = () => {
    switch (solarState.aodTheme) {
      // 1. Eclipse Ring: Glowing solar corona
      case 'eclipse-ring':
        return (
          <div className="flex flex-col items-center relative">
            {/* Luminous Eclipse Aura */}
            <div className="w-44 h-44 rounded-full border border-amber-500/40 relative flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.25)]">
              <div className="absolute inset-1 rounded-full border-t-2 border-amber-400 opacity-80 animate-spin" style={{ animationDuration: '60s' }} />
              <div className="flex flex-col items-center">
                <span className="text-4xl font-extralight text-white font-mono tracking-wider">
                  {timeString}
                </span>
                <span className="text-[10px] text-amber-400 font-mono font-semibold tracking-widest mt-1">
                  SOLAR ECLIPSE
                </span>
              </div>
            </div>
          </div>
        );

      // 2. Analog Sundial: Minimalist analog ticking watch
      case 'analog-sundial':
        const hourAngle = (hours % 12 + minutes / 60) * 30;
        const minuteAngle = minutes * 6;
        return (
          <div className="flex flex-col items-center">
            <div className="w-40 h-40 rounded-full border border-zinc-800 relative flex items-center justify-center">
              {/* Dial Marks */}
              <div className="absolute top-2 w-0.5 h-2 bg-zinc-600" />
              <div className="absolute bottom-2 w-0.5 h-2 bg-zinc-600" />
              <div className="absolute left-2 w-2 h-0.5 bg-zinc-600" />
              <div className="absolute right-2 w-2 h-0.5 bg-zinc-600" />

              {/* Center Pivot */}
              <div className="w-2 h-2 rounded-full bg-amber-400 z-20" />

              {/* Hour Hand */}
              <div
                className="absolute w-1 h-12 bg-white rounded-full origin-bottom z-10"
                style={{
                  bottom: '50%',
                  transform: `rotate(${hourAngle}deg)`,
                }}
              />

              {/* Minute Hand */}
              <div
                className="absolute w-0.5 h-16 bg-amber-400 rounded-full origin-bottom z-10"
                style={{
                  bottom: '50%',
                  transform: `rotate(${minuteAngle}deg)`,
                }}
              />
            </div>
            <span className="text-xs text-zinc-500 font-mono mt-3">
              {timeString} {ampm}
            </span>
          </div>
        );

      // 3. Bioluminescent Wave: Flowing soft neon curves
      case 'bioluminescent-wave':
        return (
          <div className="flex flex-col items-center">
            <div className="w-32 h-16 relative flex items-center justify-center overflow-hidden mb-2">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 via-cyan-400/20 to-teal-500/20 blur-xl animate-pulse" />
              <span className="text-5xl font-light text-cyan-200 font-mono tracking-tight drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                {timeString}
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 tracking-widest font-mono">
              BIOLUMINESCENT AMBIENCE
            </span>
          </div>
        );

      // 4. Constellation Star Map
      case 'star-map':
        return (
          <div className="flex flex-col items-center">
            <div className="w-40 h-32 relative flex flex-col items-center justify-center">
              {/* Star dots */}
              <div className="absolute top-2 left-6 w-1 h-1 rounded-full bg-white opacity-80" />
              <div className="absolute bottom-4 right-8 w-1 h-1 rounded-full bg-amber-300 opacity-90" />
              <div className="absolute top-8 right-12 w-1.5 h-1.5 rounded-full bg-cyan-300 opacity-70" />
              <div className="absolute bottom-2 left-10 w-1 h-1 rounded-full bg-white opacity-60" />

              <span className="text-5xl font-extralight text-slate-100 tracking-widest">
                {timeString}
              </span>
              <span className="text-[9px] text-amber-300/80 font-mono tracking-widest mt-1">
                SOLAR CONSTELLATION
              </span>
            </div>
          </div>
        );

      // 5. Minimal Digital: Sleek thin typography (Default)
      case 'minimal-digital':
      default:
        return (
          <div className="flex flex-col items-center">
            <h1 className="text-6xl sm:text-7xl font-thin text-white tracking-wider font-mono">
              {timeString}
            </h1>
            <span className="text-xs text-zinc-400 font-medium tracking-wide mt-1">
              Sun, Sep 27 · 26°C Sunny
            </span>
          </div>
        );
    }
  };

  return (
    <div
      onClick={handleWake}
      className="absolute inset-0 z-50 bg-black text-white flex flex-col justify-between p-6 select-none cursor-pointer overflow-hidden"
    >
      {/* Top Status Bar Telemetry (Dimmed for AMOLED battery saving) */}
      <div className="w-full flex items-center justify-between text-zinc-600 text-[11px] pt-4 font-mono">
        <div className="flex items-center gap-1.5">
          <Moon className="w-3.5 h-3.5 text-zinc-500" />
          <span>AOD</span>
        </div>
        <div className="flex items-center gap-2">
          <span>{solarState.batteryLevel}%</span>
          <Battery className="w-3.5 h-3.5 text-zinc-500" />
        </div>
      </div>

      {/* Center Hero Clock & Theme with Anti-Burn-In Micro-Shift */}
      <div
        className="flex-1 flex flex-col items-center justify-center transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${shiftOffset.x}px, ${shiftOffset.y}px)`,
        }}
      >
        {renderAODTheme()}

        {/* Personalized Custom Signature Text */}
        {solarState.aodCustomText && (
          <div className="mt-4 px-3 py-1 rounded-full border border-zinc-800 text-[11px] font-medium text-zinc-400 tracking-wider">
            {solarState.aodCustomText}
          </div>
        )}

        {/* Subtle Ambient Notification Badges */}
        <div className="flex items-center gap-4 mt-6 text-zinc-600">
          <div className="flex items-center gap-1 text-[11px]">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>3</span>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <Bell className="w-3.5 h-3.5" />
            <span>1</span>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <Sun className="w-3.5 h-3.5 text-amber-500/70" />
            <span>840W</span>
          </div>
        </div>
      </div>

      {/* Bottom Wake Prompt */}
      <div className="w-full flex flex-col items-center space-y-2 pb-4 text-center">
        <span className="text-[10px] text-zinc-600 tracking-widest uppercase font-semibold">
          Tap screen to wake
        </span>
        <div className="w-28 h-1 bg-zinc-800 rounded-full" />
      </div>
    </div>
  );
};
