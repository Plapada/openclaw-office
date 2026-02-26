'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@/lib/gameEngine';

export default function OfficeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [zoom, setZoom] = useState(3);

  useEffect(() => {
    engineRef.current = new GameEngine();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    

    const gameLoop = (time: number) => {
      
      

      engineRef.current?.update();
      engineRef.current?.render(ctx, zoom);

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [zoom]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={20 * 16 * zoom}
        height={12 * 16 * zoom}
        className="border-4 border-[#30363d] rounded-lg shadow-2xl"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {/* Zoom Controls */}
      <div className="absolute top-2 right-2 flex gap-1">
        <button
          onClick={() => setZoom(z => Math.max(1, z - 1))}
          className="w-8 h-8 bg-[#21262d] hover:bg-[#30363d] text-white font-bold rounded border-2 border-[#484f58]"
        >
          -
        </button>
        <button
          onClick={() => setZoom(z => Math.min(6, z + 1))}
          className="w-8 h-8 bg-[#21262d] hover:bg-[#30363d] text-white font-bold rounded border-2 border-[#484f58]"
        >
          +
        </button>
      </div>
    </div>
  );
}
