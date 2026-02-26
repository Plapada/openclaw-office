'use client';

import { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  emoji: string;
  color: string;
  status: string;
}

export default function AgentSidebar() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'working': return 'text-green-400';
      case 'thinking': return 'text-yellow-400';
      case 'typing': return 'text-blue-400';
      case 'reading': return 'text-purple-400';
      case 'waiting': return 'text-orange-400';
      case 'sleeping': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="w-56 bg-[#161b22] border-l-4 border-[#30363d] p-4">
        <h2 className="text-lg font-bold text-white mb-4">🤖 Agentes</h2>
        <div className="text-gray-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="w-56 bg-[#161b22] border-l-4 border-[#30363d] p-4">
      <h2 className="text-lg font-bold text-white mb-4">🤖 Agentes</h2>
      <div className="space-y-2">
        {agents.map(agent => (
          <div
            key={agent.id}
            className="p-3 bg-[#21262d] rounded-lg border-2 border-[#30363d] hover:border-[#58a6ff] cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{agent.emoji}</span>
              <div>
                <div className="font-bold text-white text-sm">{agent.name}</div>
                <div className={`text-xs capitalize ${getStatusColor(agent.status)}`}>
                  ● {agent.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
