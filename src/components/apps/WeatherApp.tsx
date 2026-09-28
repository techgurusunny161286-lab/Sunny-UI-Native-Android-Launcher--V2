import React from 'react';
import { SolarState } from '../../types/launcher';
import { Sun, Sunrise, Sunset, Wind, Droplets, Compass, ShieldAlert, Sparkles } from 'lucide-react';

interface WeatherAppProps {
  solarState: SolarState;
  onUpdateSunPosition: (pos: number) => void;
}

export const WeatherApp: React.FC<WeatherAppProps> = ({
  solarState,
  onUpdateSunPosition,
}) => {
  const days = [
    { day: 'Sun (Today)', temp: '26°', condition: 'Sunny & Clear', icon: '☀️', uv: 8 },
    { day: 'Mon', temp: '27°', condition: 'Golden Radiance', icon: '🌤️', uv: 9 },
    { day: 'Tue', temp: '25°', condition: 'Solar Flare', icon: '☀️', uv: 8 },
    { day: 'Wed', temp: '24°', condition: 'Sun Shower', icon: '🌦️', uv: 5 },
    { day: 'Thu', temp: '28°', condition: 'High Noon Peak', icon: '☀️', uv: 10 },
    { day: 'Fri', temp: '26°', condition: 'Clear Sky', icon: '🌤️', uv: 7 },
  ];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4">
      {/* Hero Solar Condition Card */}
      <div className="glass-panel rounded-3xl p-5 border border-white/70 shadow-lg text-center relative overflow-hidden">
        <div className="absolute top-2 right-3">
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
            LIVE TELEMETRY
          </span>
        </div>

        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-yellow-100 flex items-center justify-center shadow-lg border-2 border-white mb-2 animate-solar-pulse">
          <Sun className="w-9 h-9 text-amber-700 animate-spin" style={{ animationDuration: '40s' }} />
        </div>

        <h2 className="font-display font-bold text-3xl text-slate-900 tracking-tight">
          {solarState.temperature}°C
        </h2>
        <p className="font-display font-semibold text-sm text-amber-800">
          {solarState.weatherCondition}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Direct solar irradiance {solarState.solarWattage} W/m² · UV Index {solarState.uvIndex}
        </p>
      </div>

      {/* Sun Arc & Golden Hour Telemetry */}
      <div className="glass-widget rounded-3xl p-4 border border-white/70 shadow-md">
        <h3 className="font-display font-bold text-xs text-slate-800 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Solar Trajectory & Light Timing
        </h3>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-white/50 border border-white/60">
            <div className="flex items-center gap-1 text-slate-500 text-[10px] font-semibold uppercase">
              <Sunrise className="w-3.5 h-3.5 text-amber-600" />
              <span>Sunrise</span>
            </div>
            <div className="font-mono font-bold text-slate-900 text-base mt-1">06:24 AM</div>
            <div className="text-[10px] text-slate-500">First morning solar rays</div>
          </div>

          <div className="p-3 rounded-2xl bg-white/50 border border-white/60">
            <div className="flex items-center gap-1 text-slate-500 text-[10px] font-semibold uppercase">
              <Sunset className="w-3.5 h-3.5 text-orange-600" />
              <span>Sunset</span>
            </div>
            <div className="font-mono font-bold text-slate-900 text-base mt-1">07:48 PM</div>
            <div className="text-[10px] text-slate-500">Sunset dusk twilight</div>
          </div>
        </div>

        {/* Golden Hour photography advisory */}
        <div className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-amber-400/20 to-orange-400/20 border border-amber-300/60 flex items-center justify-between">
          <div>
            <div className="font-display font-bold text-xs text-amber-900">
              Golden Hour Window
            </div>
            <div className="text-[10px] text-amber-800">
              06:20 PM - 07:15 PM · Warm soft directional lighting
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white font-mono text-[10px] font-bold shadow-sm">
            IN 34M
          </span>
        </div>
      </div>

      {/* 7-Day Solar Forecast List */}
      <div className="glass-panel rounded-3xl p-4 border border-white/70 shadow-md">
        <h3 className="font-display font-bold text-xs text-slate-800 mb-2">
          Weekly Daylight Forecast
        </h3>

        <div className="divide-y divide-slate-200/50">
          {days.map((item, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-base">{item.icon}</span>
                <div>
                  <div className="font-semibold text-slate-800">{item.day}</div>
                  <div className="text-[10px] text-slate-500">{item.condition}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  UV {item.uv}
                </span>
                <span className="font-mono font-bold text-slate-900 w-8 text-right">
                  {item.temp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
