import React, { useState, useEffect } from 'react';
import { SolarState, BootAnimationId } from '../../types/launcher';
import { Sun, Sparkles, Terminal, Apple, Disc } from 'lucide-react';
import { solarSound } from '../../utils/solarSound';

interface BootSimulatorProps {
  solarState: SolarState;
  onComplete: () => void;
}

export const BootSimulator: React.FC<BootSimulatorProps> = ({
  solarState,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState('Initializing SolOS Kernel...');

  useEffect(() => {
    // Play sound chime at boot start
    solarSound.playLaunch(solarState.soundEnabled);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 5;
        if (next === 25) setStageText('Calibrating 3D Refractive Glass Engine...');
        if (next === 50) setStageText('Syncing Photovoltaic Solar Core...');
        if (next === 75) setStageText('Mounting iOS Squircle Icon Platters...');
        if (next === 90) setStageText('System Ready · Welcome to Sunny UI ☀️');
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 350);
          return 100;
        }
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [solarState.soundEnabled, onComplete]);

  // Render Theme Animation
  const renderThemeAnimation = () => {
    switch (solarState.bootAnimation) {
      // 1. Solar Flare Awakening
      case 'solar-flare':
        return (
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 flex items-center justify-center mb-6">
              {/* Pulsing solar aura */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 blur-xl animate-ping opacity-40" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-200 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(245,158,11,0.8)] border border-yellow-100 animate-spin" style={{ animationDuration: '10s' }}>
                ☀️
              </div>
            </div>
            <h2 className="text-2xl font-bold font-display tracking-tight text-white mb-1">
              Sunny ☀️ UI
            </h2>
            <p className="text-[11px] font-mono text-amber-400">SolOS 3.5 Engine</p>
          </div>
        );

      // 2. Cupertino Liquid Glass
      case 'liquid-apple':
        return (
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-[28px] ios-icon-surface bg-gradient-to-tr from-white/95 via-slate-100 to-slate-200/90 flex items-center justify-center mb-6 shadow-2xl relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white font-bold text-xl shadow-md">
                ☀️
              </div>
              <div className="ios-icon-sheen" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-white mb-1">
              Apple Silicon
            </h2>
            <p className="text-[11px] text-zinc-400">Solar Bionic Architecture</p>
          </div>
        );

      // 3. Cyber Matrix Boot
      case 'cyber-matrix':
        return (
          <div className="flex flex-col items-center font-mono">
            <div className="w-24 h-24 rounded-2xl bg-black border border-cyan-400/80 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              <Terminal className="w-12 h-12 text-cyan-400 animate-pulse" />
            </div>
            <h2 className="text-lg font-bold text-cyan-300 tracking-widest mb-1">
              NEO // SOLOS-KERNEL
            </h2>
            <p className="text-[10px] text-cyan-500">BOOT SEQUENCE // SEC-01</p>
          </div>
        );

      // 4. Retro Mac 1984
      case 'retro-mac':
        return (
          <div className="flex flex-col items-center">
            <div className="w-24 h-28 rounded-lg bg-[#e2d5c3] border-4 border-[#bda68e] flex flex-col items-center justify-between p-2 mb-6 shadow-2xl">
              <div className="w-16 h-12 rounded bg-[#333] flex items-center justify-center text-xl">
                <span className="animate-bounce">😊</span>
              </div>
              <div className="w-10 h-1 bg-[#8c7864] rounded-full" />
            </div>
            <h2 className="text-lg font-mono font-bold text-amber-200 mb-1">
              Welcome to Macintosh
            </h2>
            <p className="text-[10px] font-mono text-zinc-400">System 7 · Solar Edition</p>
          </div>
        );

      // 5. Nebula Ignition
      case 'nebula-ignition':
      default:
        return (
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-2xl opacity-60 animate-pulse" />
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shadow-[0_0_40px_white]">
                ✨
              </div>
            </div>
            <h2 className="text-2xl font-bold font-display tracking-wider text-white mb-1">
              COSMOS SOL
            </h2>
            <p className="text-[11px] font-mono text-purple-300">Infinite Optical Engine</p>
          </div>
        );
    }
  };

  return (
    <div className="absolute inset-0 z-60 bg-black text-white flex flex-col justify-between items-center p-8 select-none animate-in fade-in duration-300">
      {/* Top Telemetry */}
      <div className="w-full flex items-center justify-between text-[10px] font-mono text-zinc-600">
        <span>SOLAR BOOT SEQUENCE</span>
        <button
          onClick={onComplete}
          className="text-zinc-500 hover:text-white px-2 py-0.5 rounded border border-zinc-800"
        >
          Skip Boot
        </button>
      </div>

      {/* Center Boot Theme Visual */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {renderThemeAnimation()}
      </div>

      {/* Bottom Progress Bar & Telemetry Status */}
      <div className="w-full max-w-xs flex flex-col items-center space-y-2 pb-6">
        {/* Progress Bar Capsule */}
        <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic Boot Message */}
        <div className="flex items-center justify-between w-full text-[10px] font-mono text-zinc-400">
          <span className="truncate max-w-[210px]">{stageText}</span>
          <span className="font-bold text-amber-400">{progress}%</span>
        </div>
      </div>
    </div>
  );
};
