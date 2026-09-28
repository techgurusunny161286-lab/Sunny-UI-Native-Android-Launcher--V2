import React from 'react';
import { AppDefinition, SolarState } from '../../types/launcher';
import { AppIcon3D } from '../icons/AppIcon3D';
import { Sliders, Maximize2, Minimize2, RotateCcw, Check, Sparkles, X, Eye, EyeOff } from 'lucide-react';
import { solarSound } from '../../utils/solarSound';

interface IconResizerModalProps {
  solarState: SolarState;
  sampleApps: AppDefinition[];
  onClose: () => void;
  onUpdateState: (updates: Partial<SolarState>) => void;
}

export const IconResizerModal: React.FC<IconResizerModalProps> = ({
  solarState,
  sampleApps,
  onClose,
  onUpdateState,
}) => {
  // Use first 3 apps for live preview
  const previewApps = sampleApps.slice(0, 3);

  const presets = [
    { id: 'sm', label: 'Compact', scale: 82, px: 51, desc: 'Dense grid, 48-52px' },
    { id: 'md', label: 'Standard', scale: 100, px: 62, desc: 'Original iOS, 62px' },
    { id: 'lg', label: 'Large', scale: 114, px: 71, desc: 'Roomy 3D touch, 71px' },
    { id: 'xl', label: 'Jumbo', scale: 126, px: 78, desc: 'Ultra-sized tactile, 78px' },
  ];

  const handleScaleChange = (newScale: number) => {
    solarSound.playTap(solarState.soundEnabled);
    let preset: 'sm' | 'md' | 'lg' | 'xl' = 'md';
    if (newScale < 90) preset = 'sm';
    else if (newScale <= 106) preset = 'md';
    else if (newScale <= 120) preset = 'lg';
    else preset = 'xl';

    onUpdateState({
      iconScale: newScale,
      iconSizePreset: preset,
    });
  };

  const handlePresetSelect = (scale: number, presetId: 'sm' | 'md' | 'lg' | 'xl') => {
    solarSound.playTap(solarState.soundEnabled);
    onUpdateState({
      iconScale: scale,
      iconSizePreset: presetId,
    });
  };

  const handleReset = () => {
    solarSound.playTap(solarState.soundEnabled);
    onUpdateState({
      iconScale: 100,
      iconSizePreset: 'md',
      showIconLabels: true,
      iconTilt3D: true,
    });
  };

  const currentPx = Math.round(62 * (solarState.iconScale / 100));

  return (
    <div
      onClick={onClose}
      className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xl flex flex-col justify-end p-3 animate-in fade-in duration-200"
    >
      {/* Modal Sheet Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-white/90 backdrop-blur-2xl rounded-[32px] border border-white/80 p-5 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-300"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900 leading-tight">
                Icon Resizer
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                Adjust 3D app icon dimensions & grid scale
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleReset}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-90 text-slate-600 transition-all text-xs flex items-center gap-1 font-semibold"
              title="Reset to 100% Standard iOS"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">Reset</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-90 flex items-center justify-center text-slate-600 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Interactive Preview Stage */}
        <div className="rounded-2xl bg-gradient-to-b from-amber-50/70 via-white/80 to-slate-100/70 border border-white/90 p-3.5 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
          <div className="absolute top-2 left-3 flex items-center gap-1 text-[10px] font-bold text-amber-700 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Live Preview · {currentPx}px ({solarState.iconScale}%)
          </div>

          {/* Sample Icons Row */}
          <div className="flex items-end justify-center gap-5 pt-5 pb-2 transition-all duration-200 min-h-[105px]">
            {previewApps.map((app) => (
              <AppIcon3D
                key={app.id}
                app={app}
                customScale={solarState.iconScale}
                showLabel={solarState.showIconLabels}
                tiltEnabled={solarState.iconTilt3D}
                soundEnabled={solarState.soundEnabled}
              />
            ))}
          </div>
        </div>

        {/* Preset Selector Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {presets.map((p) => {
            const isSelected = solarState.iconSizePreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handlePresetSelect(p.scale, p.id as any)}
                className={`py-2 px-1 rounded-xl text-center border transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400/40 font-bold scale-[1.02]'
                    : 'bg-white/80 hover:bg-white text-slate-700 border-white/80 font-medium'
                }`}
              >
                <div className="text-[11px] leading-tight">{p.label}</div>
                <div
                  className={`text-[9px] font-mono mt-0.5 ${
                    isSelected ? 'text-amber-100' : 'text-slate-400'
                  }`}
                >
                  {p.px}px
                </div>
              </button>
            );
          })}
        </div>

        {/* Continuous Precision Slider */}
        <div className="space-y-1.5 bg-white/70 p-3 rounded-2xl border border-white/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Minimize2 className="w-3.5 h-3.5 text-slate-400" />
              Fine-tune Scale
            </span>
            <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-lg border border-amber-200">
              {solarState.iconScale}% ({currentPx}px)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-medium text-slate-400">75%</span>
            <input
              type="range"
              min="75"
              max="130"
              step="1"
              value={solarState.iconScale}
              onChange={(e) => handleScaleChange(Number(e.target.value))}
              className="flex-1 h-2 bg-amber-200/70 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <span className="text-[10px] font-medium text-slate-400">130%</span>
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Toggles: Show/Hide Labels & 3D Tilt */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Label Toggle */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              onUpdateState({ showIconLabels: !solarState.showIconLabels });
            }}
            className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
              solarState.showIconLabels
                ? 'bg-white border-amber-400/80 shadow-xs text-slate-800'
                : 'bg-white/50 border-white/60 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-2 text-left">
              {solarState.showIconLabels ? (
                <Eye className="w-4 h-4 text-amber-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-slate-400" />
              )}
              <div>
                <div className="text-xs font-semibold">Icon Labels</div>
                <div className="text-[9px] text-slate-400">
                  {solarState.showIconLabels ? 'Visible' : 'Hidden'}
                </div>
              </div>
            </div>
            <div
              className={`w-7 h-4 rounded-full p-0.5 transition-colors flex items-center ${
                solarState.showIconLabels ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-white shadow-xs" />
            </div>
          </button>

          {/* 3D Tilt Toggle */}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              onUpdateState({ iconTilt3D: !solarState.iconTilt3D });
            }}
            className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
              solarState.iconTilt3D
                ? 'bg-white border-amber-400/80 shadow-xs text-slate-800'
                : 'bg-white/50 border-white/60 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-2 text-left">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <div>
                <div className="text-xs font-semibold">3D Gyroscope</div>
                <div className="text-[9px] text-slate-400">
                  {solarState.iconTilt3D ? 'Enabled' : 'Disabled'}
                </div>
              </div>
            </div>
            <div
              className={`w-7 h-4 rounded-full p-0.5 transition-colors flex items-center ${
                solarState.iconTilt3D ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-white shadow-xs" />
            </div>
          </button>
        </div>

        {/* Bottom Apply & Done Button */}
        <button
          onClick={() => {
            solarSound.playLaunch(solarState.soundEnabled);
            onClose();
          }}
          className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Check className="w-4 h-4" />
          Apply & Return to Launcher
        </button>
      </div>
    </div>
  );
};
