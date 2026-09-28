import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Trophy, RotateCcw } from 'lucide-react';
import { solarSound } from '../../utils/solarSound';

interface ArcadeAppProps {
  soundEnabled: boolean;
}

interface Flare {
  id: number;
  x: number;
  y: number;
  speed: number;
  color: string;
}

export const ArcadeApp: React.FC<ArcadeAppProps> = ({ soundEnabled }) => {
  const [paddleX, setPaddleX] = useState(50); // percentage 0 - 100
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(140);
  const [gameOver, setGameOver] = useState(false);
  const [flares, setFlares] = useState<Flare[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Spawning flares
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setFlares((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          x: Math.floor(Math.random() * 80) + 10,
          y: 0,
          speed: Math.random() * 2 + 3,
          color: Math.random() > 0.4 ? '#F59E0B' : '#EA580C',
        },
      ]);
    }, 1200);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Game animation loop
  useEffect(() => {
    if (gameOver) return;

    const anim = setInterval(() => {
      setFlares((prev) => {
        const next: Flare[] = [];
        for (const f of prev) {
          const nextY = f.y + f.speed;

          // Collision with paddle at y > 82%
          if (nextY >= 82 && nextY <= 90) {
            if (Math.abs(f.x - paddleX) < 16) {
              // Caught flare!
              setScore((s) => {
                const newScore = s + 10;
                if (newScore > highScore) setHighScore(newScore);
                return newScore;
              });
              solarSound.playTap(soundEnabled);
              continue;
            }
          }

          if (nextY > 96) {
            // Missed! Game over if missed 3
            continue;
          }

          next.push({ ...f, y: nextY });
        }
        return next;
      });
    }, 50);

    return () => clearInterval(anim);
  }, [gameOver, paddleX, highScore, soundEnabled]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setPaddleX(Math.max(10, Math.min(90, x)));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    setPaddleX(Math.max(10, Math.min(90, x)));
  };

  const restartGame = () => {
    setScore(0);
    setFlares([]);
    setGameOver(false);
    solarSound.playLaunch(soundEnabled);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="flex-1 relative flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-slate-900 via-amber-950/40 to-slate-900 text-white cursor-none"
    >
      {/* Top Score Bar */}
      <div className="p-4 flex items-center justify-between z-10 bg-slate-900/60 backdrop-blur-md border-b border-white/10">
        <div>
          <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
            SOLAR FLARES
          </span>
          <div className="font-mono text-xl font-bold text-white leading-none mt-0.5">
            {score} pts
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span>Best: {highScore}</span>
        </div>
      </div>

      {/* Play Area with falling solar particles */}
      <div className="relative flex-1 overflow-hidden">
        {flares.map((f) => (
          <div
            key={f.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center animate-spin"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
            }}
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-200 shadow-[0_0_12px_#fbbf24] border border-white" />
          </div>
        ))}

        {/* 3D Tactile Glass Catcher Paddle */}
        <div
          className="absolute bottom-8 -translate-x-1/2 w-24 h-5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 shadow-[0_0_20px_#f59e0b] border-2 border-white flex items-center justify-center transition-all duration-75"
          style={{ left: `${paddleX}%` }}
        >
          <div className="w-12 h-1 bg-white rounded-full opacity-80" />
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="p-3 text-center text-[11px] text-amber-200/80 bg-slate-900/80">
        Slide left / right to harvest falling solar energy flares!
      </div>
    </div>
  );
};
