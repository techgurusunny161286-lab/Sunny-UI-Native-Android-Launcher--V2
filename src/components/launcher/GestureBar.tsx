import React from 'react';
import { solarSound } from '../../utils/solarSound';

interface GestureBarProps {
  onGoHome: () => void;
  soundEnabled: boolean;
  isInsideApp?: boolean;
}

export const GestureBar: React.FC<GestureBarProps> = ({
  onGoHome,
  soundEnabled,
  isInsideApp = false,
}) => {
  const handleClick = () => {
    solarSound.playTap(soundEnabled);
    onGoHome();
  };

  return (
    <div
      onClick={handleClick}
      className={`w-full flex items-center justify-center py-2 cursor-pointer z-40 select-none group transition-all ${
        isInsideApp ? 'bg-gradient-to-t from-black/20 to-transparent' : ''
      }`}
      title="Swipe up or tap to return Home"
    >
      <div className="w-32 h-1.5 rounded-full bg-slate-800/40 group-hover:bg-slate-900/70 group-hover:w-36 transition-all duration-200 backdrop-blur-md shadow-sm" />
    </div>
  );
};
