import { NextResponse } from 'next/server';

const SUPABASE_URL = 'https://smfcnhvoixumthluacwq.supabase.co/rest/v1/agents';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZmNuaHZvaXh1bXRobHVhY3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MDkwMzIsImV4cCI6MjA4NzE4NTAzMn0.rGWbfVpPRt4WOa3f3Hmc7MWq-tWzfBX3gLqfmZO24Nc';

export const dynamic = 'force-dynamic';

interface SupabaseAgent {
  id: string;
  name: string;
  status: string;
}

interface GameAgent {
  id: string;
  name: string;
  emoji: string;
  color: string;
  status: string;
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
}

function getEmoji(name: string): string {
  const emojis: Record<string, string> = {
    'Pi': '🥧', 'DevCraft': '🎨', 'Master Planner': '📝', 'Creator': '🧬',
    'Lion': '🦁', 'Secretary RAG': '📚', 'Secretary Core': '💼',
    'Malas Shop Visual': '👜', 'Treinador VETEC': '🏋️',
  };
  return emojis[name] || '🤖';
}

function getColor(index: number): string {
  const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#c792ea', '#82aaff', '#c3e88d', '#f78c6c'];
  return colors[index] || '#888888';
}

export async function GET() {
  try {
    const res = await fetch(SUPABASE_URL, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const agents: SupabaseAgent[] = await res.json();
    
    const gameAgents: GameAgent[] = agents.slice(0, 4).map((agent, index) => ({
      id: agent.id,
      name: agent.name,
      emoji: getEmoji(agent.name),
      color: getColor(index),
      status: agent.status || 'idle',
      x: 2 + index * 4,
      y: 3 + index,
      direction: 'down' as const,
    }));
    
    return NextResponse.json(gameAgents);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
