// Types for OpenClaw Office

export type AgentStatus = 'idle' | 'working' | 'thinking' | 'waiting' | 'typing' | 'reading';

export interface Agent {
  id: string;
  name: string;
  emoji: string;
  color: string;
  status: AgentStatus;
  x: number;
  y: number;
  targetX?: number;
  targetY?: number;
  direction: 'up' | 'down' | 'left' | 'right';
}

export interface Tile {
  type: 'floor' | 'wall' | 'void' | 'desk' | 'chair';
  color?: string;
}

export interface OfficeLayout {
  cols: number;
  rows: number;
  tiles: Tile[][];
}

export const TILE_SIZE = 16;
export const DEFAULT_COLS = 20;
export const DEFAULT_ROWS = 12;
