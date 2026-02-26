import { Agent, AgentStatus, TILE_SIZE } from './types';

export class GameEngine {
  private agents: Agent[] = [];
  private lastTime: number = 0;
  private animationFrame: number = 0;

  constructor() {
    this.initDemoAgents();
  }

  private initDemoAgents() {
    this.agents = [
      { id: '1', name: 'Pi', emoji: '🥧', color: '#ff6b6b', status: 'working', x: 3, y: 4, direction: 'right' as const },
      { id: '2', name: 'DevCraft', emoji: '🎨', color: '#4ecdc4', status: 'idle', x: 6, y: 3, direction: 'down' as const },
      { id: '3', name: 'Lion', emoji: '🦁', color: '#ffe66d', status: 'thinking', x: 5, y: 6, direction: 'left' as const },
      { id: '4', name: 'Master', emoji: '📝', color: '#95e1d3', status: 'typing', x: 8, y: 5, direction: 'down' as const },
    ];
  }

  getAgents() {
    return this.agents;
  }

  update() {
    this.agents.forEach(agent => {
      // Random status changes
      if (Math.random() < 0.005) {
        const statuses: AgentStatus[] = ['idle', 'working', 'thinking', 'typing', 'reading'];
        agent.status = statuses[Math.floor(Math.random() * statuses.length)];
      }

      // Random movement
      if (Math.random() < 0.02) {
        const directions = ['up', 'down', 'left', 'right'] as const;
        agent.direction = directions[Math.floor(Math.random() * 4)];
        
        const moves = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
        const move = moves[agent.direction];
        
        const newX = agent.x + move.x;
        const newY = agent.y + move.y;
        
        if (newX >= 0 && newX < 20 && newY >= 0 && newY < 12) {
          agent.x = newX;
          agent.y = newY;
        }
      }
    });
  }

  render(ctx: CanvasRenderingContext2D, zoom: number) {
    const tileSize = TILE_SIZE * zoom;
    
    // Render floor
    for (let y = 0; y < 12; y++) {
      for (let x = 0; x < 20; x++) {
        const isChecker = (x + y) % 2 === 0;
        ctx.fillStyle = isChecker ? '#1a1d23' : '#21262d';
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }

    // Render grid lines
    ctx.strokeStyle = '#30363d';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 20; x++) {
      ctx.beginPath();
      ctx.moveTo(x * tileSize, 0);
      ctx.lineTo(x * tileSize, 12 * tileSize);
      ctx.stroke();
    }
    for (let y = 0; y <= 12; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * tileSize);
      ctx.lineTo(20 * tileSize, y * tileSize);
      ctx.stroke();
    }

    // Render agents
    this.agents.forEach(agent => {
      this.renderAgent(ctx, agent, tileSize);
    });
  }

  private renderAgent(ctx: CanvasRenderingContext2D, agent: Agent, tileSize: number) {
    const x = agent.x * tileSize;
    const y = agent.y * tileSize;
    const size = tileSize;

    // Agent body (pixel art style)
    ctx.fillStyle = agent.color;
    ctx.fillRect(x + 2, y + 2, size - 4, size - 4);

    // Head
    ctx.fillStyle = '#ffe0bd';
    ctx.fillRect(x + 4, y + 2, size - 8, size - 8);

    // Eyes based on direction
    ctx.fillStyle = '#000';
    if (agent.direction === 'left') {
      ctx.fillRect(x + 5, y + 5, 2, 2);
    } else if (agent.direction === 'right') {
      ctx.fillRect(x + 9, y + 5, 2, 2);
    } else {
      ctx.fillRect(x + 5, y + 5, 2, 2);
      ctx.fillRect(x + 9, y + 5, 2, 2);
    }

    // Status bubble
    if (agent.status !== 'idle') {
      const statusEmoji = this.getStatusEmoji(agent.status);
      ctx.fillStyle = '#0d1117';
      ctx.beginPath();
      ctx.arc(x + size - 4, y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(statusEmoji, x + size - 4, y + 3);
    }
  }

  private getStatusEmoji(status: AgentStatus): string {
    const emojis: Record<AgentStatus, string> = {
      idle: '💤',
      working: '⚡',
      thinking: '🤔',
      waiting: '⏳',
      typing: '⌨️',
      reading: '📖',
    };
    return emojis[status];
  }
}
