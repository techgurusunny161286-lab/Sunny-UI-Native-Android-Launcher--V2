import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Sparkles, Sliders, Image as ImageIcon, Zap, Sun } from 'lucide-react';
import { solarSound } from '../../utils/solarSound';

interface CameraAppProps {
  soundEnabled: boolean;
}

export const CameraApp: React.FC<CameraAppProps> = ({ soundEnabled }) => {
  const [filter, setFilter] = useState<'golden' | 'amber' | 'prism' | 'natural'>('golden');
  const [flashActive, setFlashActive] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'user' } })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          setCameraActive(true);
        }
      })
      .catch(() => {
        // Fallback gracefully to simulated lens view
        setCameraActive(false);
      });

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    solarSound.playShutter(soundEnabled);
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 200);

    // Save capture to reel
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setCapturedPhotos((prev) => [timestamp, ...prev]);
  };

  const getFilterStyle = () => {
    switch (filter) {
      case 'golden':
        return 'sepia(35%) saturate(150%) hue-rotate(-10deg) brightness(105%)';
      case 'amber':
        return 'sepia(65%) saturate(180%) hue-rotate(-20deg) contrast(110%)';
      case 'prism':
        return 'contrast(115%) saturate(160%) hue-rotate(25deg)';
      default:
        return 'none';
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-black text-white relative overflow-hidden select-none">
      {/* Flash overlay */}
      {flashActive && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-out fade-out duration-200" />
      )}

      {/* Top Lens Controls */}
      <div className="z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Solar 50mm f/1.4 Lens</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-amber-500/30 border border-amber-400/50 text-[10px] font-mono text-amber-300">
            HDR SOL
          </span>
        </div>
      </div>

      {/* Viewfinder Main Frame */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Live camera video or simulated golden lens backdrop */}
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ filter: getFilterStyle() }}
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center transition-all duration-300 relative overflow-hidden"
            style={{
              background: 'radial-gradient(circle at 50% 40%, #fbbf24 0%, #ea580c 45%, #78350f 85%, #0f172a 100%)',
              filter: getFilterStyle(),
            }}
          >
            {/* Viewfinder Solar Horizon Graphics */}
            <div className="w-40 h-40 rounded-full border border-white/30 flex items-center justify-center relative">
              <div className="w-28 h-28 rounded-full border border-white/50 flex items-center justify-center">
                <Sun className="w-12 h-12 text-yellow-100 animate-spin" style={{ animationDuration: '30s' }} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[1px] bg-white/40" />
                <div className="h-full w-[1px] bg-white/40 absolute" />
              </div>
            </div>
            <div className="mt-4 text-xs font-medium text-white/90 drop-shadow">
              Optical Viewfinder · Golden Hour Sensor
            </div>
          </div>
        )}

        {/* Viewfinder Grid Crosshairs */}
        <div className="absolute inset-8 pointer-events-none border border-white/20 rounded-2xl flex items-center justify-center">
          <div className="w-12 h-12 border border-amber-400/60 rounded-lg flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>
        </div>
      </div>

      {/* Filter Selector Tabs */}
      <div className="z-10 px-4 py-2 flex items-center justify-center gap-2 bg-black/60 backdrop-blur-md">
        {(['golden', 'amber', 'prism', 'natural'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => {
              solarSound.playTap(soundEnabled);
              setFilter(mode);
            }}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider transition-all ${
              filter === mode
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-white/60 hover:text-white bg-white/10'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Bottom Shutter & Gallery Bar */}
      <div className="z-10 p-5 flex items-center justify-around bg-black/90 pb-8">
        {/* Photo Gallery Thumbnail */}
        <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/30 flex items-center justify-center overflow-hidden">
          {capturedPhotos.length > 0 ? (
            <div className="w-full h-full bg-amber-600 flex items-center justify-center text-[10px] font-bold text-white">
              {capturedPhotos.length}
            </div>
          ) : (
            <ImageIcon className="w-5 h-5 text-slate-400" />
          )}
        </div>

        {/* Big Tactile Shutter Button */}
        <button
          onClick={handleCapture}
          className="w-18 h-18 rounded-full bg-white p-1 border-4 border-amber-400/80 shadow-2xl flex items-center justify-center active:scale-90 transition-transform group"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 group-hover:scale-95 transition-transform shadow-inner flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </button>

        {/* Switch Lens Button */}
        <button
          onClick={() => solarSound.playTap(soundEnabled)}
          className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-white active:scale-95 hover:bg-white/25 transition-all"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
