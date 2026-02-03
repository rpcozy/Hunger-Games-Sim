import { create } from 'zustand';
import { Tribute, District, GameEvent, GameState, GamePhase } from '../types';

interface GameStore extends GameState {
  // Actions
  initializeGame: (tributes: Tribute[], districts: District[]) => void;
  setTributes: (tributes: Tribute[]) => void;
  updateTributeStatus: (tributeId: string, isAlive: boolean, killedBy?: string) => void;
  incrementKills: (tributeId: string) => void;
  addEvent: (event: GameEvent) => void;
  addMultipleEvents: (events: GameEvent[]) => void;
  advancePhase: (newPhase: GamePhase, newDay?: number) => void;
  setWinner: (tribute: Tribute) => void;
  resetGame: () => void;
  
  // Getters
  getAliveTributes: () => Tribute[];
  getDeadTributes: () => Tribute[];
  getTributeById: (id: string) => Tribute | undefined;
  getDistrictTributes: (districtId: number) => Tribute[];
}

const initialState: GameState = {
  currentDay: 0,
  currentPhase: 'setup',
  isRunning: false,
  tributes: [],
  districts: [],
  eventLog: [],
  winner: undefined,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  /**
   * Initialize the game with tributes and districts
   */
  initializeGame: (tributes: Tribute[], districts: District[]) => {
    set({
      tributes,
      districts,
      currentDay: 0,
      currentPhase: 'bloodbath',
      isRunning: true,
      eventLog: [],
      winner: undefined,
    });
  },

  /**
   * Set tributes list
   */
  setTributes: (tributes: Tribute[]) => {
    set({ tributes });
  },

  /**
   * Update a tribute's alive status
   */
  updateTributeStatus: (tributeId: string, isAlive: boolean, killedBy?: string) => {
    const { currentDay, currentPhase } = get();
    
    set((state) => ({
      tributes: state.tributes.map((tribute) =>
        tribute.id === tributeId
          ? {
              ...tribute,
              isAlive,
              deathDay: !isAlive ? currentDay : tribute.deathDay,
              deathPhase: !isAlive ? currentPhase : tribute.deathPhase,
              killedBy: !isAlive && killedBy ? killedBy : tribute.killedBy,
            }
          : tribute
      ),
    }));
  },

  /**
   * Increment kill count for a tribute
   */
  incrementKills: (tributeId: string) => {
    set((state) => ({
      tributes: state.tributes.map((tribute) =>
        tribute.id === tributeId
          ? { ...tribute, kills: tribute.kills + 1 }
          : tribute
      ),
    }));
  },

  /**
   * Add a single event to the log
   */
  addEvent: (event: GameEvent) => {
    set((state) => ({
      eventLog: [...state.eventLog, event],
    }));
  },

  /**
   * Add multiple events to the log
   */
  addMultipleEvents: (events: GameEvent[]) => {
    set((state) => ({
      eventLog: [...state.eventLog, ...events],
    }));
  },

  /**
   * Advance to the next phase/day
   */
  advancePhase: (newPhase: GamePhase, newDay?: number) => {
    set((state) => ({
      currentPhase: newPhase,
      currentDay: newDay !== undefined ? newDay : state.currentDay,
    }));
  },

  /**
   * Set the winner and end the game
   */
  setWinner: (tribute: Tribute) => {
    set({
      winner: tribute,
      currentPhase: 'finished',
      isRunning: false,
    });
  },

  /**
   * Reset the entire game state
   */
  resetGame: () => {
    set(initialState);
  },

  /**
   * Get all alive tributes
   */
  getAliveTributes: () => {
    return get().tributes.filter((t) => t.isAlive);
  },

  /**
   * Get all dead tributes
   */
  getDeadTributes: () => {
    return get().tributes.filter((t) => !t.isAlive);
  },

  /**
   * Get a tribute by ID
   */
  getTributeById: (id: string) => {
    return get().tributes.find((t) => t.id === id);
  },

  /**
   * Get tributes from a specific district
   */
  getDistrictTributes: (districtId: number) => {
    return get().tributes.filter((t) => t.districtId === districtId);
  },
}));
