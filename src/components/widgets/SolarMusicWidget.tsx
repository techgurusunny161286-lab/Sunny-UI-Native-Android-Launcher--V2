import React, { useState } from 'react';
import { Play, Pause, SkipForward } from 'lucide-react';
import { solarSound } from '../../utils/solarSound';

interface SolarMusicWidgetProps {
  soundEnabled: boolean;
  onOpenApp: () => void;
}

export const SolarMusicWidget: React.FC<SolarMusicWidgetProps> = ({
  soundEnabled,
  onOpenApp,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const tracks = [
    { title: 'Golden Hour Reverie', artist: 'Sol Acoustic', duration: '3:18' },
    { title: 'Sunlight on Travertine', artist: 'Amber Chill', duration: '2:45' },
    { title: 'Prism Mirage', artist: 'Solar Symphony', duration: '4:10' },
  ];

  const currentTrack = tracks[trackIndex];

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      solarSound.stopSunnyMusic();
      setIsPlaying(false);
    } else {
      solarSound.startSunnyMusic(0.6);
      setIsPlaying(true);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTrackIndex((prev) => (prev + 1) % tracks.length);
    solarSound.playTap(soundEnabled);
  };

  return (
    <div
      onClick={onOpenApp}
      className="group relative glass-widget rounded-[28px] p-3.5 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-xl overflow-hidden h-[135px]"
    >
      {/* Top Track Row */}
      <div className="flex items-center gap-2.5">
        {/* iOS Album Art Squircle */}
        <div className="relative w-11 h-11 rounded-[12px] overflow-hidden bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-300 shadow-[0_3px_8px_rgba(0,0,0,0.18)] border border-white/60 shrink-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-white/40 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
          </div>
          {/* Vinyl spin animation if playing */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
        </div>

        <div className="overflow-hidden flex-1">
          <h4
            className="font-semibold text-xs text-slate-900 truncate tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {currentTrack.title}
          </h4>
          <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* iOS Now Playing Controls Bar */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-200/40">
        {/* Mini Frequency Bar Indicator */}
        <div className="flex items-end gap-0.5 h-3.5 px-1">
          {[0.4, 0.9, 0.5, 1.0, 0.6].map((h, i) => (
            <span
              key={i}
              className={`w-0.75 rounded-full bg-rose-500 transition-all duration-200 ${
                isPlaying ? 'animate-pulse' : 'h-1 opacity-40'
              }`}
              style={{
                height: isPlaying ? `${h * 14}px` : '3px',
                animationDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>
          <button
            onClick={handleNext}
            className="w-7 h-7 rounded-full bg-white/70 text-slate-700 flex items-center justify-center hover:bg-white active:scale-95 transition-transform"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
