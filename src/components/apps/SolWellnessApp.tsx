import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Wind, Play, Pause } from 'lucide-react';
import { solarSound } from '../../utils/solarSound';

interface SolWellnessAppProps {
  soundEnabled: boolean;
}

export const SolWellnessApp: React.FC<SolWellnessAppProps> = ({ soundEnabled }) => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (phase === 'Inhale') {
            setPhase('Hold');
            solarSound.playTap(soundEnabled);
            return 4;
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            solarSound.playTap(soundEnabled);
            return 4;
          } else {
            setPhase('Inhale');
            solarSound.playLaunch(soundEnabled);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phase, soundEnabled]);

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-6 text-center select-none">
      {/* Header */}
      <div>
        <h3 className="font-display font-bold text-xl text-slate-900">
          Sol Resonant Breath
        </h3>
        <p className="text-xs text-amber-800 font-medium mt-1">
          Synchronize with the natural solar circadian cycle
        </p>
      </div>

      {/* 3D Animated Breathing Core */}
      <div className="relative w-56 h-56 flex items-center justify-center my-6">
        {/* Pulsing halo */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-tr from-pink-400/30 via-amber-300/30 to-yellow-200/40 blur-xl transition-all duration-1000 ${
            phase === 'Inhale' ? 'scale-125 opacity-100' : phase === 'Hold' ? 'scale-115 opacity-90' : 'scale-90 opacity-40'
          }`}
        />

        {/* 3D Glass Breathing Orb */}
        <div
          className={`w-36 h-36 rounded-full bg-gradient-to-tr from-pink-500 via-rose-400 to-amber-300 shadow-2xl border-2 border-white flex flex-col items-center justify-center text-white transition-all duration-1000 ease-in-out ${
            phase === 'Inhale'
              ? 'scale-110 shadow-pink-500/50'
              : phase === 'Hold'
              ? 'scale-105'
              : 'scale-90 shadow-amber-500/20'
          }`}
        >
          <span className="font-display font-bold text-lg tracking-tight drop-shadow">
            {phase}
          </span>
          <span className="font-mono text-2xl font-bold mt-1">
            {secondsLeft}s
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="w-full space-y-3">
        <button
          onClick={() => {
            solarSound.playTap(soundEnabled);
            setIsActive(!isActive);
          }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-display font-bold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {isActive ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isActive ? 'Pause Session' : 'Resume Session'}</span>
        </button>

        <p className="text-[11px] text-slate-500">
          4-4-4 Box Breathing · Activates parasympathetic calm
        </p>
      </div>
    </div>
  );
};
