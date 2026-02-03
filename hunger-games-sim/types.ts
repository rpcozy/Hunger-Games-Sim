/**
 * Core Type Definitions for Hunger Games Simulator
 */

export type Gender = 'male' | 'female' | 'other';

export type GamePhase = 
  | 'setup'
  | 'bloodbath'
  | 'day'
  | 'night'
  | 'feast'
  | 'arena-event'
  | 'finished';

export interface Tribute {
  id: string;
  name: string;
  gender: Gender;
  imageUrl: string;
  districtId: number;
  isAlive: boolean;
  kills: number;
  // Track the day/phase when they died
  deathDay?: number;
  deathPhase?: GamePhase;
  killedBy?: string; // Tribute ID or cause (e.g., "natural causes", "arena")
}

export interface District {
  id: number;
  tribute1: Tribute;
  tribute2: Tribute;
}

/**
 * Event Template with dynamic placeholders
 * Placeholders: {Player1}, {Player2}, {Player3}, {Weapon}, {Item}, etc.
 */
export interface EventTemplate {
  id: string;
  text: string;
  // How many tributes are involved (1 = solo, 2 = interaction, 3+ = group)
  tributesInvolved: number;
  // Who dies in this event (by index in the involved tributes array)
  deaths: number[];
  // Who gets the kill credit (by index, -1 for environmental/no credit)
  killer?: number;
  // Required items/weapons for substitution
  requiresWeapon?: boolean;
  requiresItem?: boolean;
}

export interface EventCategory {
  bloodbath: EventTemplate[];
  day: EventTemplate[];
  night: EventTemplate[];
  feast: EventTemplate[];
  arenaEvent: EventTemplate[];
}

/**
 * A processed game event with actual tribute data
 */
export interface GameEvent {
  id: string;
  day: number;
  phase: GamePhase;
  text: string; // Processed text with names filled in
  tributes: string[]; // Array of tribute IDs involved
  deaths: string[]; // Array of tribute IDs who died
  killer?: string; // Tribute ID who got the kill
  timestamp: Date;
}

export interface GameState {
  // Game metadata
  currentDay: number;
  currentPhase: GamePhase;
  isRunning: boolean;
  
  // Tributes and districts
  tributes: Tribute[];
  districts: District[];
  
  // Event history
  eventLog: GameEvent[];
  
  // Winner
  winner?: Tribute;
}

/**
 * Simulation Step Result
 */
export interface SimulationStepResult {
  events: GameEvent[];
  deaths: string[]; // IDs of tributes who died this step
  newPhase: GamePhase;
  newDay: number;
  isGameOver: boolean;
  winner?: Tribute;
}
