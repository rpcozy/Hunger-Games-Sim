/**
 * Barrel export file for easy imports
 * Usage: import { useGameStore, simulatePhase, EVENT_POOL } from '@/lib/game-engine';
 */

// Types
export * from './types';

// Store
export { useGameStore } from './stores/gameStore';

// Engine
export * from './engine/simulator';

// Data
export { EVENT_POOL, WEAPONS, ITEMS } from './data/events';

// Utilities
export * from './utils/textReplacer';

// Hooks
export { useGameSimulation } from './hooks/useGameSimulation';
