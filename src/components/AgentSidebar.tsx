'use client';

import { useState, useEffect } from 'react';

interface Agent { id: string; name: string; emoji: string; color: string; status: string; }

export default function AgentSidebar() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventSource = new EventSource('/api/agents-stream');
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.agents) {
          setAgents(data.agents);
          setLoading(false);
        }
      } catch (err) { console.error('SSE parse error:', err); }
    };

    return () => eventSource.close();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      working: 'text-green-400', thinking: 'text-yellow-400', typing: 'text-blue-400',
      reading: 'text-purple-400', waiting: 'text-orange-400', sleeping: 'text-gray-400',
    };
    return colors[status] || 'text-gray-400';
  };

  if (loading) return (
    <div className="w-56 bg-[#161b22] border-l-4 border-[#30363d] p-4">
      <h2 className="text-lg font-bold text-white mb-4">🤖 Agentes</h2>
      <div className="text-gray-400">Conectando...</div>
    </div>
  );

  return (
    <div className="w-56 bg-[#161b22] border-l-4 border-[#30363d] p-4">
      <h2 className="text-lg font-bold text-white mb-4">🤖 Agentes</h2>
      <div className="space-y-2">
        {agents.map(agent => (
          <div key={agent.id} className="p-3 bg-[#21262d] rounded-lg border-2 border-[#30363d] hover:border-[#58a6ff] cursor-pointer transition-all">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{agent.emoji}</span>
              <div>
                <div className="font-bold text-white text-sm">{agent.name}</div>
                <div className={`text-xs capitalize ${getStatusColor(agent.status)}`}>● {agent.status}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
