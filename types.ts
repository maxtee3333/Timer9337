export enum TimerStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
  WAITING_FOR_ACTION = 'WAITING_FOR_ACTION', // Phase complete, waiting for user
  COMPLETED = 'COMPLETED'
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

export interface TimerPhase {
  id: string;
  name: string; // e.g., "Bloom", "Boil", "Add Sugar"
  durationSeconds: number;
  ingredients: Ingredient[]; // Ingredients specific to this phase
}

export interface Timer {
  id: string;
  name: string;
  theme: string; // CSS class string for gradient
  multiplier: number; // 1, 2, or 3
  phases: TimerPhase[];
  currentPhaseIndex: number;
  timeLeftInCurrentPhase: number;
  status: TimerStatus;
  createdAt: number;
}

export interface CreateTimerInput {
  name: string;
  phases: Omit<TimerPhase, 'id'>[];
}