export interface Algorithm {
  id: string;
  name: string;
  category: 'PLL' | 'OLL' | 'F2L' | 'Cross';
  notation: string; // e.g., "R U R' U'"
  description?: string;
}

export type Move = {
  axis: 'x' | 'y' | 'z';
  slice: number; // -1, 0, 1
  direction: number; // 1 or -1 (90 degrees)
  notation: string;
};

export interface CubeState {
  isAnimating: boolean;
  currentStep: number;
}

export interface Solve {
  id: string;
  time: number; // in milliseconds
  scramble: string;
  timestamp: number;
}