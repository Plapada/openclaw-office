'use client';

import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@/lib/gameEngine';

interface Agent {
  id: string;
  name: string;
  emoji: string;
  color: string;
  status: string;
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
}

export default function OfficeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [zoom, setZoom] = useState(3);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real agents from API
  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch('/api/agents');
        const data = await res.json();
        if (Array.isArray(data)) {
          setAgents(data);
        }
      } catch (err) {
        console.error('Failed to fetch agents:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAgents();
    
    // Refresh every 10 seconds
    const interval = setInterval(fetchAgents, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (agents.length === 0) return;

    engineRef.current = new GameEngine(agents);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const gameLoop = () => {
      engineRef.current?.update();
      engineRef.current?.render(ctx, zoom);

      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [agents, zoom]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-[#0d1117] border-4 border-[#30363d] rounded-lg">
        <div className="text-white text-xl">🤖 Carregando agentes...</div>
      </div>
    );
  }

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
