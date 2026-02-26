import { NextResponse } from 'next/server';

const SUPABASE_URL = 'https://smfcnhvoixumthluacwq.supabase.co/rest/v1/agents';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZmNuaHZvaXh1bXRobHVhY3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MDkwMzIsImV4cCI6MjA4NzE4NTAzMn0.rGWbfVpPRt4WOa3f3Hmc7MWq-tWzfBX3gLqfmZO24Nc';

export async function GET() {
  try {
    const res = await fetch(SUPABASE_URL, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const agents = await res.json();
    
    // Map to game format
    const gameAgents = agents.slice(0, 4).map((agent: any, index: number) => ({
      id: agent.id,
      name: agent.name,
      emoji: getEmoji(agent.name),
      color: getColor(index),
      status: agent.status || 'idle',
      x: 2 + index * 4,
      y: 3 + Math.floor(index / 2),
      direction: 'down' as const,
    }));
    
    return NextResponse.json(gameAgents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}

function getEmoji(name: string): string {
  const emojis: Record<string, string> = {
    'Pi': '🥧',
    'DevCraft': '🎨',
    'Master Planner': '📝',
    'Creator': '🧬',
    'Lion': '🦁',
    'Secretary RAG': '📚',
    'Secretary Core': '💼',
    'Malas Shop Visual': '👜',
    'Treinador VETEC': '🏋️',
  };
  return emojis[name] || '🤖';
}

function getColor(index: number): string {
  const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3'];
  return colors[index] || '#888888';
}
