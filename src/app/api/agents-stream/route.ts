import { NextResponse } from 'next/server';

const SUPABASE_URL = 'https://smfcnhvoixumthluacwq.supabase.co/rest/v1/agents';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZmNuaHZvaXh1bXRobHVhY3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2MDkwMzIsImV4cCI6MjA4NzE4NTAzMn0.rGWbfVpPRt4WOa3f3Hmc7MWq-tWzfBX3gLqfmZO24Nc';

export const dynamic = 'force-dynamic';

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

async function fetchAgents() {
  const res = await fetch(SUPABASE_URL, {
    headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` },
  });
  const agents = await res.json();
  return agents.slice(0, 8).map((agent: any, index: number) => ({
    id: agent.id, name: agent.name, emoji: getEmoji(agent.name),
    color: getColor(index), status: agent.status || 'idle',
    x: 2 + (index % 4) * 4, y: 3 + Math.floor(index / 4) * 2, direction: 'down' as const,
  }));
}

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const agents = await fetchAgents();
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'init', agents })}\n\n`));
      
      const interval = setInterval(async () => {
        try {
          const agents = await fetchAgents();
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'update', agents })}\n\n`));
        } catch (err) { console.error('SSE error:', err); }
      }, 3000);
    },
  });

  return new NextResponse(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
  });
}
