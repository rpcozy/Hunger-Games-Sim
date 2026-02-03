import { useGameStore } from '../stores/gameStore';
import { simulatePhase, triggerSpecialEvent, shouldTriggerFeast, shouldTriggerArenaEvent } from '../engine/simulator';
import { GamePhase, GameEvent } from '../types';

/**
 * Custom hook to handle game simulation logic
 * Integrates the engine with the Zustand store
 */
export const useGameSimulation = () => {
  const {
    currentDay,
    currentPhase,
    getAliveTributes,
    addMultipleEvents,
    updateTributeStatus,
    incrementKills,
    advancePhase,
    setWinner,
  } = useGameStore();

  /**
   * Execute one simulation step (phase)
   * NOTE: Deaths are NOT applied here - they're applied incrementally as events are displayed
   */
  const runSimulationStep = () => {
    const aliveTributes = getAliveTributes();
    
    // Check if game is already over
    if (aliveTributes.length <= 1) {
      if (aliveTributes.length === 1) {
        setWinner(aliveTributes[0]);
      }
      return;
    }

    // Run simulation for current phase
    const result = simulatePhase(aliveTributes, currentPhase, currentDay);

    // Add events to log (deaths will be applied later as user views events)
    addMultipleEvents(result.events);

    // NOTE: Deaths are NOT processed here anymore!
    // They will be applied incrementally in the component's handleNextEvent

    // Check for game over and advance phase
    // We still need to update phase/day, but winner will be set after last death is shown
    if (result.newPhase !== currentPhase || result.newDay !== currentDay) {
      advancePhase(result.newPhase, result.newDay);
    }
  };

  /**
   * Trigger a feast event
   * NOTE: Deaths are NOT applied here - they're applied incrementally as events are displayed
   */
  const triggerFeast = () => {
    const aliveTributes = getAliveTributes();
    const result = triggerSpecialEvent(aliveTributes, 'feast', currentDay);

    addMultipleEvents(result.events);

    // NOTE: Deaths are NOT processed here anymore!
    // They will be applied incrementally in the component's handleNextEvent

    // Advance phase
    if (result.newPhase !== currentPhase || result.newDay !== currentDay) {
      advancePhase(result.newPhase, result.newDay);
    }
  };

  /**
   * Trigger an arena event
   * NOTE: Deaths are NOT applied here - they're applied incrementally as events are displayed
   */
  const triggerArena = () => {
    const aliveTributes = getAliveTributes();
    const result = triggerSpecialEvent(aliveTributes, 'arena-event', currentDay);

    addMultipleEvents(result.events);

    // NOTE: Deaths are NOT processed here anymore!
    // They will be applied incrementally in the component's handleNextEvent

    // Advance phase
    if (result.newPhase !== currentPhase || result.newDay !== currentDay) {
      advancePhase(result.newPhase, result.newDay);
    }
  };

  /**
   * Automatically trigger special events based on game state
   */
  const autoTriggerSpecialEvents = () => {
    const aliveTributes = getAliveTributes();
    
    if (shouldTriggerFeast(currentDay)) {
      console.log('Triggering feast...');
      triggerFeast();
      return true;
    }
    
    if (shouldTriggerArenaEvent(currentDay, aliveTributes.length)) {
      console.log('Triggering arena event...');
      triggerArena();
      return true;
    }
    
    return false;
  };

  /**
   * Apply deaths for a specific event (called when user views the event)
   */
  const applyEventDeaths = (event: GameEvent) => {
    event.deaths.forEach((deadTributeId) => {
      const killedBy = event.killer || 'arena';
      updateTributeStatus(deadTributeId, false, killedBy);
      
      // Increment kill count for killer
      if (event.killer) {
        incrementKills(event.killer);
      }
    });

    // Check if game is over after applying deaths
    const aliveTributes = getAliveTributes();
    if (aliveTributes.length === 1) {
      setWinner(aliveTributes[0]);
    }
  };

  return {
    runSimulationStep,
    triggerFeast,
    triggerArena,
    autoTriggerSpecialEvents,
    applyEventDeaths,
  };
};
