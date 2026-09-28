import React from 'react';
import { SolarState } from '../../types/launcher';
import { Sun, Sunrise, Sunset, Sparkles, Compass } from 'lucide-react';
import { solarSound } from '../../utils/solarSound';

interface SolarWeatherWidgetProps {
  solarState: SolarState;
  onUpdateSunPosition: (pos: number) => void;
  onOpenWeatherApp: () => void;
}

export const SolarWeatherWidget: React.FC<SolarWeatherWidgetProps> = ({
  solarState,
  onUpdateSunPosition,
  onOpenWeatherApp,
}) => {
  // Calculate sun coordinate along a parabolic arc
  // x: 10% to 90%, y: 80% (sunrise) -> 20% (noon) -> 80% (sunset)
  const normPos = Math.max(0, Math.min(100, solarState.sunPosition)) / 100;
  const sunX = 15 + normPos * 70;
  // Parabola: at 0 -> 75, at 0.5 -> 22, at 1.0 -> 75
  const sunY = 75 - Math.sin(normPos * Math.PI) * 52;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onUpdateSunPosition(val);
    solarSound.playTap(solarState.soundEnabled);
  };

  return (
    <div
      onClick={onOpenWeatherApp}
      className="group relative w-full glass-widget rounded-[28px] p-4 cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-white/90"
    >
      {/* Dynamic Sun Flare Atmosphere glow */}
      <div
        className="absolute -top-12 rounded-full w-44 h-44 bg-gradient-to-br from-amber-400/25 via-yellow-300/15 to-transparent blur-2xl pointer-events-none transition-all duration-500"
        style={{
          left: `${sunX - 25}%`,
        }}
      />

      {/* Top Header Row */}
      <div className="flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-tr from-sky-400 to-amber-400 border border-white/80 flex items-center justify-center shadow-xs">
            <Sun className="w-4.5 h-4.5 text-white animate-spin" style={{ animationDuration: '30s' }} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[13px] text-slate-900 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Cupertino · {solarState.weatherCondition}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2">
              <span>UV {solarState.uvIndex}</span>
              <span>·</span>
              <span>{solarState.solarWattage} W/m²</span>
            </div>
          </div>
        </div>

        {/* Big Temperature Indicator */}
        <div className="text-right">
          <div className="text-2xl font-bold text-slate-900 leading-none" style={{ fontFamily: 'var(--font-display)' }}>
            {solarState.temperature}°
          </div>
          <div className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider mt-0.5">
            {solarState.timeOfDay.replace('_', ' ')}
          </div>
        </div>
      </div>

      {/* Dynamic Sun Path Sky Arc Graphic */}
      <div className="relative mt-3 h-20 w-full flex items-center justify-center">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 80" preserveAspectRatio="none">
          {/* Horizon Line */}
          <line x1="8" y1="74" x2="92" y2="74" stroke="rgba(245, 158, 11, 0.3)" strokeWidth="1.5" strokeDasharray="3 3" />
          
          {/* Sky Arch Path */}
          <path
            d="M 15 74 Q 50 15 85 74"
            fill="none"
            stroke="url(#solarPathGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Golden Hour highlight zones */}
          <path
            d="M 15 74 Q 28 50 35 40"
            fill="none"
            stroke="rgba(251, 146, 60, 0.6)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 65 40 Q 72 50 85 74"
            fill="none"
            stroke="rgba(251, 146, 60, 0.6)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          <defs>
            <linearGradient id="solarPathGrad" x1="0" y1="1" x2="1" y2="1">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>
        </svg>

        {/* The Animated 3D Sun Cursor */}
        <div
          className="absolute z-20 transition-all duration-150 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${sunX}%`,
            top: `${sunY}%`,
          }}
        >
          <div className="relative flex items-center justify-center">
            {/* Halo */}
            <div className="w-8 h-8 rounded-full bg-amber-400/40 blur-sm animate-ping" style={{ animationDuration: '3s' }} />
            {/* 3D Orb */}
            <div className="absolute w-5.5 h-5.5 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-100 shadow-md border border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full opacity-90" />
            </div>
          </div>
        </div>

        {/* Sunrise & Sunset labels */}
        <div className="absolute bottom-0 left-2 flex items-center gap-1 text-[10px] font-semibold text-slate-500">
          <Sunrise className="w-3.5 h-3.5 text-amber-500" />
          <span>06:24 AM</span>
        </div>
        <div className="absolute bottom-0 right-2 flex items-center gap-1 text-[10px] font-semibold text-slate-500">
          <span>07:48 PM</span>
          <Sunset className="w-3.5 h-3.5 text-orange-500" />
        </div>
      </div>

      {/* Interactive Sun Scrub Slider */}
      <div
        className="mt-3 pt-2 border-t border-amber-200/50 flex items-center justify-between gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1 text-[11px] font-medium text-amber-900/80">
          <Compass className="w-3.5 h-3.5 text-amber-600" />
          <span>Sun Position</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={solarState.sunPosition}
          onChange={handleSliderChange}
          className="flex-1 h-1.5 bg-amber-200/60 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none"
        />
        <span className="font-mono text-[10px] font-semibold text-amber-900 w-8 text-right">
          {Math.round(solarState.sunPosition)}%
        </span>
      </div>
    </div>
  );
};
