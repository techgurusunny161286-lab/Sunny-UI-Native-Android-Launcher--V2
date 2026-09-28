import React from 'react';
import { Zap, Sun } from 'lucide-react';
import { SolarState } from '../../types/launcher';
import { solarSound } from '../../utils/solarSound';

interface SolarBatteryWidgetProps {
  solarState: SolarState;
  onToggleSolarCharge: () => void;
  onOpenApp: () => void;
}

export const SolarBatteryWidget: React.FC<SolarBatteryWidgetProps> = ({
  solarState,
  onToggleSolarCharge,
  onOpenApp,
}) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    solarSound.playTap(solarState.soundEnabled);
    onToggleSolarCharge();
  };

  // Circular progress stroke calculation
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (solarState.batteryLevel / 100) * circumference;

  return (
    <div
      onClick={onOpenApp}
      className="group relative glass-widget rounded-[28px] p-3.5 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-xl overflow-hidden h-[135px]"
    >
      {/* Top Header & Radial Battery Ring */}
      <div className="flex items-center justify-between">
        <div>
          <div
            className="font-semibold text-xs text-slate-900 tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Solar Battery
          </div>
          <div className="text-[10px] text-slate-500 font-medium">
            {solarState.solarCharging ? 'Harvesting Sunlight' : 'Discharging'}
          </div>
        </div>

        {/* Circular iOS Battery Ring */}
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg className="w-12 h-12 -rotate-90">
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="24"
              cy="24"
              r={radius}
              stroke={solarState.solarCharging ? '#F59E0B' : solarState.batteryLevel <= 20 ? '#F43F5E' : '#10B981'}
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            {solarState.solarCharging ? (
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            ) : (
              <span className="font-mono text-[11px] font-bold text-slate-900">
                {solarState.batteryLevel}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Solar Harvesting Toggle */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-200/40 text-[10px]">
        <div className="flex items-center gap-1 text-amber-800 font-medium">
          <Sun className="w-3 h-3 text-amber-600" />
          <span>+{(solarState.solarWattage * 0.08).toFixed(1)}W Sol</span>
        </div>

        <button
          onClick={handleToggle}
          className={`px-2.5 py-1 rounded-full font-semibold transition-all ${
            solarState.solarCharging
              ? 'bg-amber-500 text-white shadow-xs'
              : 'bg-white/80 text-amber-900 hover:bg-white border border-slate-200'
          }`}
        >
          {solarState.solarCharging ? 'Active' : 'Charge'}
        </button>
      </div>
    </div>
  );
};
