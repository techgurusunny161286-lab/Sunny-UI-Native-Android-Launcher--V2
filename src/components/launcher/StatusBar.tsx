import React, { useState } from 'react';
import { Wifi, Sparkles, BatteryCharging, Sun, Zap, Radio } from 'lucide-react';
import { SolarState } from '../../types/launcher';
import { solarSound } from '../../utils/solarSound';

interface StatusBarProps {
  solarState: SolarState;
  onOpenNotifications: () => void;
  onOpenControlCenter: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  solarState,
  onOpenNotifications,
  onOpenControlCenter,
}) => {
  const [islandExpanded, setIslandExpanded] = useState(false);

  // Is dark mode active
  const isDarkMode =
    solarState.themeMode === 'dark' ||
    (solarState.themeMode === 'auto' &&
      (solarState.sunPosition > 82 || solarState.sunPosition < 15));

  const textClass = isDarkMode ? 'text-white' : 'text-slate-900';
  const fillBg = isDarkMode ? 'bg-white' : 'bg-slate-900';
  const borderCol = isDarkMode ? 'border-white/80' : 'border-slate-900/80';

  // Format time based on solarState.timeHours in iOS 12-hour format
  const hours = Math.floor(solarState.timeHours);
  const minutes = Math.floor((solarState.timeHours % 1) * 60);
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const timeString = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes}`;

  const toggleIsland = (e: React.MouseEvent) => {
    e.stopPropagation();
    solarSound.playTap(solarState.soundEnabled);
    setIslandExpanded(!islandExpanded);
  };

  // Render Battery Indicator based on batteryStyle
  const renderBattery = () => {
    switch (solarState.batteryStyle) {
      // 1. Percentage Inside Capsule
      case 'capsule-inside':
        return (
          <div className="relative w-7 h-3.5 rounded-[4px] border border-current p-[1px] flex items-center justify-center font-mono text-[8px] font-bold">
            <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[1px] h-1.5 bg-current rounded-r-xs" />
            <div
              className={`absolute left-0 inset-y-0 opacity-40 transition-all ${
                solarState.solarCharging
                  ? 'bg-amber-500'
                  : solarState.batteryLevel <= 20
                  ? 'bg-rose-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.max(10, solarState.batteryLevel)}%` }}
            />
            <span className="relative z-10">{solarState.batteryLevel}</span>
          </div>
        );

      // 2. Circular Radial Meter
      case 'circle-meter':
        const circ = 2 * Math.PI * 4.5;
        const strokeDash = circ - (solarState.batteryLevel / 100) * circ;
        return (
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 -rotate-90" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
              <circle
                cx="6"
                cy="6"
                r="4.5"
                fill="none"
                stroke={solarState.solarCharging ? '#f59e0b' : '#10b981'}
                strokeWidth="1.5"
                strokeDasharray={circ}
                strokeDashoffset={strokeDash}
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[10px] font-mono font-bold">{solarState.batteryLevel}%</span>
          </div>
        );

      // 3. Simple Bar Gauge
      case 'bar-only':
        return (
          <div className="w-6 h-1.5 bg-black/20 dark:bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${solarState.batteryLevel}%` }}
            />
          </div>
        );

      // 4. Percentage Only
      case 'percentage-only':
        return (
          <span className="font-mono text-xs font-bold text-emerald-500 dark:text-emerald-400">
            {solarState.batteryLevel}%
          </span>
        );

      // 5. Classic iOS Capsule Outside (Default)
      case 'capsule-outside':
      default:
        return (
          <div className="flex items-center gap-1 ml-0.5">
            <span className="text-[11px] font-semibold font-mono tracking-tight">
              {solarState.batteryLevel}%
            </span>
            <div className={`relative w-5 h-2.5 rounded-[4px] border ${borderCol} p-[1px] flex items-center`}>
              <div className={`absolute -right-[2.5px] top-1/2 -translate-y-1/2 w-[1.5px] h-1.5 ${fillBg} rounded-r-xs`} />
              <div
                className={`h-full rounded-[2px] transition-all duration-300 ${
                  solarState.solarCharging
                    ? 'bg-amber-500'
                    : solarState.batteryLevel <= 20
                    ? 'bg-rose-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.max(10, solarState.batteryLevel)}%` }}
              />
            </div>
          </div>
        );
    }
  };

  // Render Cellular Signal based on signalStyle
  const renderSignal = () => {
    switch (solarState.signalStyle) {
      case 'dots':
        return (
          <div className="flex items-center gap-1 px-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <span className="w-1.5 h-1.5 rounded-full bg-current/40" />
          </div>
        );

      case 'cyber':
        return (
          <div className="font-mono text-[9px] font-bold text-amber-500 flex items-center gap-0.5">
            <Radio className="w-3 h-3 text-amber-500" />
            <span>5G</span>
          </div>
        );

      case 'bars':
      default:
        return (
          <div className="flex items-end gap-[1.5px] h-3 px-0.5">
            <span className={`w-[2.5px] h-1 ${fillBg} rounded-[0.5px]`} />
            <span className={`w-[2.5px] h-1.5 ${fillBg} rounded-[0.5px]`} />
            <span className={`w-[2.5px] h-2.2 ${fillBg} rounded-[0.5px]`} />
            <span className={`w-[2.5px] h-3 ${fillBg} rounded-[0.5px]`} />
          </div>
        );
    }
  };

  // Clock Button
  const clockElement = (
    <button
      onClick={() => {
        solarSound.playTap(solarState.soundEnabled);
        onOpenNotifications();
      }}
      className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all ${textClass} group`}
      title="Notifications"
    >
      <span
        className="font-semibold text-[14px] tracking-tight leading-none"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {timeString}
      </span>
    </button>
  );

  // Dynamic Island Element
  const islandElement = (
    <div
      onClick={toggleIsland}
      className={`cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] bg-black text-white rounded-full px-2.5 py-1 flex items-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.35)] border border-white/10 ${
        islandExpanded ? 'min-w-[210px] h-8 justify-between px-3.5' : 'min-w-[100px] h-6 justify-between'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-[10px] font-semibold text-amber-200 tracking-tight">
          {islandExpanded ? 'Sunny ☀️ Live' : 'SolOS'}
        </span>
      </div>

      {islandExpanded ? (
        <div className="flex items-center gap-1.5 text-[9px] text-slate-300 font-mono">
          <span>{solarState.solarWattage} W/m²</span>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700" />
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#111] border border-white/10" />
        </div>
      )}
    </div>
  );

  // Right Status Telemetry (Signal, Wi-Fi, Battery)
  const rightTelemetry = (
    <button
      onClick={() => {
        solarSound.playTap(solarState.soundEnabled);
        onOpenControlCenter();
      }}
      className={`relative flex flex-col items-end px-1.5 py-0.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all ${textClass} group`}
      title="Tap or Swipe Down for Control Center"
    >
      <div className="flex items-center gap-1.5">
        {renderSignal()}
        <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
        {renderBattery()}
      </div>

      {/* Control Center Pill Handle */}
      <div className="w-7 h-[2px] bg-slate-800/40 dark:bg-white/40 rounded-full mt-0.5 mr-0.5 group-hover:bg-slate-900 dark:group-hover:bg-white transition-colors" />
    </button>
  );

  return (
    <header className="relative z-30 w-full pt-3 px-5 pb-1.5 flex items-center justify-between select-none">
      {/* Dynamic Positioning based on clockPosition */}
      {solarState.clockPosition === 'center' ? (
        <>
          <div className="flex items-center gap-1">{islandElement}</div>
          {clockElement}
          {rightTelemetry}
        </>
      ) : solarState.clockPosition === 'right' ? (
        <>
          {islandElement}
          <div className="flex items-center gap-2">
            {rightTelemetry}
            {clockElement}
          </div>
        </>
      ) : (
        /* Left Clock (Default iOS) */
        <>
          {clockElement}
          {islandElement}
          {rightTelemetry}
        </>
      )}
    </header>
  );
};

