import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Disc3, Volume2, Sparkles } from 'lucide-react';
import { solarSound } from '../../utils/solarSound';

interface MusicAppProps {
  soundEnabled: boolean;
}

export const MusicApp: React.FC<MusicAppProps> = ({ soundEnabled }) => {
  const [isPlaying, setIsPlaying] = useState(solarSound.isMusicActive());
  const [activeTrack, setActiveTrack] = useState(0);

  const playlist = [
    { title: 'Golden Hour Reverie', artist: 'Sol Acoustic', duration: '3:18', tone: 'Dmaj7 Warm Ambient' },
    { title: 'Sunlight on Travertine', artist: 'Amber Chill', duration: '2:45', tone: 'Gmaj7 Soft Breeze' },
    { title: 'Prism Mirage', artist: 'Solar Symphony', duration: '4:10', tone: 'F#m7 Radiant Echoes' },
    { title: 'Sunset on Solitude Bluff', artist: 'Aura Sol', duration: '3:52', tone: 'A7 Dusk Horizon' },
  ];

  const current = playlist[activeTrack];

  const togglePlay = () => {
    if (isPlaying) {
      solarSound.stopSunnyMusic();
      setIsPlaying(false);
    } else {
      solarSound.startSunnyMusic(0.6);
      setIsPlaying(true);
    }
  };

  const handleNext = () => {
    solarSound.playTap(soundEnabled);
    setActiveTrack((prev) => (prev + 1) % playlist.length);
  };

  const handlePrev = () => {
    solarSound.playTap(soundEnabled);
    setActiveTrack((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col justify-between space-y-4">
      {/* Vinyl Disc Showcase */}
      <div className="flex-1 flex flex-col items-center justify-center py-4">
        {/* Animated 3D Glass Vinyl Disc */}
        <div
          className={`relative w-44 h-44 rounded-full bg-gradient-to-tr from-amber-900 via-rose-950 to-neutral-900 p-2 shadow-2xl border-2 border-amber-300/40 flex items-center justify-center transition-all ${
            isPlaying ? 'animate-spin' : ''
          }`}
          style={{ animationDuration: '6s' }}
        >
          {/* Grooves */}
          <div className="w-36 h-36 rounded-full border border-amber-500/20 flex items-center justify-center">
            <div className="w-28 h-28 rounded-full border border-amber-500/30 flex items-center justify-center">
              {/* Disc Center Label */}
              <div className="w-18 h-18 rounded-full bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-200 border-2 border-white shadow-md flex items-center justify-center">
                <Disc3 className="w-8 h-8 text-amber-950" />
              </div>
            </div>
          </div>
        </div>

        {/* Track Title Info */}
        <div className="text-center mt-5">
          <h3 className="font-display font-bold text-lg text-slate-900">
            {current.title}
          </h3>
          <p className="text-xs text-amber-800 font-medium mt-0.5">
            {current.artist} · <span className="font-mono">{current.tone}</span>
          </p>
        </div>

        {/* Live Audio Frequency Waveform */}
        <div className="flex items-center justify-center gap-1 mt-4 h-8">
          {[0.3, 0.7, 1.0, 0.5, 0.9, 0.4, 0.8, 0.6, 0.95, 0.4, 0.7, 0.5].map((val, i) => (
            <span
              key={i}
              className={`w-1 rounded-full bg-amber-500 transition-all duration-200 ${
                isPlaying ? 'animate-pulse' : 'h-1.5 opacity-30'
              }`}
              style={{
                height: isPlaying ? `${val * 32}px` : '4px',
                animationDelay: `${i * 90}ms`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="glass-panel rounded-3xl p-4 border border-white/70 shadow-lg">
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center text-slate-800 hover:bg-white active:scale-95 transition-all"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg active:scale-90 hover:scale-105 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center text-slate-800 hover:bg-white active:scale-95 transition-all"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Scrubber progress representation */}
        <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>01:14</span>
          <div className="flex-1 mx-3 h-1 bg-amber-200/60 rounded-full overflow-hidden">
            <div className="w-2/5 h-full bg-amber-500 rounded-full" />
          </div>
          <span>{current.duration}</span>
        </div>
      </div>
    </div>
  );
};
