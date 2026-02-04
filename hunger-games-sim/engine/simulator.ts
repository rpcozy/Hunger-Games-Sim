import { v4 as uuidv4 } from 'uuid';
import { 
  Tribute, 
  GameEvent, 
  EventTemplate, 
  GamePhase, 
  SimulationStepResult 
} from '../types';
import { EVENT_POOL, shouldSelectFatalEvent } from '../data/events';
import { replaceTextPlaceholders } from '../utils/textReplacer';

/**
 * Core Simulation Engine
 * Handles event matching, tribute shuffling, and state updates
 */

/**
 * Shuffle an array (Fisher-Yates algorithm)
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Separate events into fatal and non-fatal
 * Fatal events: have at least one death in the deaths array
 */
const separateFatalAndNonFatal = (events: EventTemplate[]): [EventTemplate[], EventTemplate[]] => {
  const fatal = events.filter(e => e.deaths.length > 0);
  const nonFatal = events.filter(e => e.deaths.length === 0);
  return [fatal, nonFatal];
};

/**
 * Get random event from a pool, optionally weighted toward fatal or non-fatal
 */
const getRandomEvent = (eventPool: EventTemplate[], phase?: string): EventTemplate => {
  // If no phase specified, just return random event
  if (!phase) {
    return eventPool[Math.floor(Math.random() * eventPool.length)];
  }

  // Separate fatal and non-fatal events
  const [fatalEvents, nonFatalEvents] = separateFatalAndNonFatal(eventPool);

  // If we don't have both types, return from what we have
  if (fatalEvents.length === 0) return eventPool[Math.floor(Math.random() * eventPool.length)];
  if (nonFatalEvents.length === 0) return eventPool[Math.floor(Math.random() * eventPool.length)];

  // Determine if we should select a fatal event based on configuration
  const selectFatal = shouldSelectFatalEvent(phase);
  const selectedPool = selectFatal ? fatalEvents : nonFatalEvents;

  return selectedPool[Math.floor(Math.random() * selectedPool.length)];
};

/**
 * Check if we have enough tributes for an event
 */
const canExecuteEvent = (
  event: EventTemplate,
  availableTributes: Tribute[]
): boolean => {
  return availableTributes.length >= event.tributesInvolved;
};

/**
 * Process an event template into a game event
 */
const processEvent = (
  template: EventTemplate,
  involvedTributes: Tribute[],
  currentDay: number,
  currentPhase: GamePhase
): GameEvent => {
  // Replace text placeholders
  const processedText = replaceTextPlaceholders(template.text, {
    tributes: involvedTributes,
    requiresWeapon: template.requiresWeapon,
    requiresItem: template.requiresItem,
  });

  // Determine who died
  const deaths = template.deaths.map((deathIndex) => involvedTributes[deathIndex].id);

  // Determine killer
  let killer: string | undefined;
  if (template.killer !== undefined && template.killer >= 0) {
    killer = involvedTributes[template.killer].id;
  }

  return {
    id: uuidv4(),
    day: currentDay,
    phase: currentPhase,
    text: processedText,
    tributes: involvedTributes.map((t) => t.id),
    deaths,
    killer,
    timestamp: new Date(),
  };
};

/**
 * Simulate one phase of the game
 * @param aliveTributes - Current alive tributes
 * @param currentPhase - Current game phase
 * @param currentDay - Current day number
 * @returns SimulationStepResult with events and state changes
 */
export const simulatePhase = (
  aliveTributes: Tribute[],
  currentPhase: GamePhase,
  currentDay: number
): SimulationStepResult => {
  const events: GameEvent[] = [];
  const deaths: string[] = [];
  
  // Get event pool based on phase
  let eventPool: EventTemplate[] = [];
  switch (currentPhase) {
    case 'bloodbath':
      eventPool = EVENT_POOL.bloodbath;
      break;
    case 'day':
      eventPool = EVENT_POOL.day;
      break;
    case 'night':
      eventPool = EVENT_POOL.night;
      break;
    case 'feast':
      eventPool = EVENT_POOL.feast;
      break;
    case 'arena-event':
      eventPool = EVENT_POOL.arenaEvent;
      break;
    default:
      return {
        events: [],
        deaths: [],
        newPhase: currentPhase,
        newDay: currentDay,
        isGameOver: false,
      };
  }

  // Shuffle tributes for random assignment
  let shuffledTributes = shuffleArray(aliveTributes);
  
  // For arena events, select ONE event template to use for all tributes
  const useSharedEvent = currentPhase === 'arena-event';
  const sharedEventTemplate = useSharedEvent ? getRandomEvent(eventPool, currentPhase) : null;
  
  // Process events until all tributes have been assigned
  while (shuffledTributes.length > 0) {
    // Get random event (or use shared event for arena)
    const eventTemplate = sharedEventTemplate || getRandomEvent(eventPool, currentPhase);
    
    // Check if we have enough tributes
    if (!canExecuteEvent(eventTemplate, shuffledTributes)) {
      // Try to find a solo event if only one tribute left
      const soloEvent = eventPool.find(e => e.tributesInvolved === 1);
      if (soloEvent && shuffledTributes.length >= 1) {
        const involvedTributes = shuffledTributes.splice(0, 1);
        const gameEvent = processEvent(soloEvent, involvedTributes, currentDay, currentPhase);
        events.push(gameEvent);
        
        // Track deaths
        if (gameEvent.deaths.length > 0) {
          deaths.push(...gameEvent.deaths);
        }
      } else {
        // Not enough tributes for any event, break
        break;
      }
    } else {
      // Execute the event
      const involvedTributes = shuffledTributes.splice(0, eventTemplate.tributesInvolved);
      const gameEvent = processEvent(eventTemplate, involvedTributes, currentDay, currentPhase);
      events.push(gameEvent);
      
      // Track deaths
      if (gameEvent.deaths.length > 0) {
        deaths.push(...gameEvent.deaths);
      }
    }
  }

  // Determine next phase and day
  let newPhase: GamePhase = currentPhase;
  let newDay = currentDay;
  
  switch (currentPhase) {
    case 'bloodbath':
      newPhase = 'day';
      newDay = 1;
      break;
    case 'day':
      newPhase = 'night';
      break;
    case 'night':
      newPhase = 'day';
      newDay += 1;
      break;
    case 'feast':
      newPhase = 'day';
      break;
    case 'arena-event':
      newPhase = 'day';
      break;
  }

  // Check for winner (only 1 alive after deaths)
  const remainingAlive = aliveTributes.filter(t => !deaths.includes(t.id));
  const isGameOver = remainingAlive.length <= 1;
  const winner = remainingAlive.length === 1 ? remainingAlive[0] : undefined;

  return {
    events,
    deaths,
    newPhase: isGameOver ? 'finished' : newPhase,
    newDay,
    isGameOver,
    winner,
  };
};

/**
 * Trigger a special event (Feast or Arena Event)
 * @param aliveTributes - Current alive tributes
 * @param eventType - Type of special event
 * @param currentDay - Current day number
 * @returns SimulationStepResult
 */
export const triggerSpecialEvent = (
  aliveTributes: Tribute[],
  eventType: 'feast' | 'arena-event',
  currentDay: number
): SimulationStepResult => {
  return simulatePhase(aliveTributes, eventType, currentDay);
};

/**
 * Check if a feast should occur (randomly triggered after day 3)
 */
export const shouldTriggerFeast = (currentDay: number, lastFeastDay?: number): boolean => {
  if (currentDay <= 3) return false;
  if (lastFeastDay && currentDay - lastFeastDay < 3) return false;
  
  // 20% chance each day after day 3
  return Math.random() < 0.2;
};

/**
 * Check if an arena event should occur (randomly triggered after day 2)
 */
export const shouldTriggerArenaEvent = (
  currentDay: number, 
  aliveCount: number,
  lastArenaEventDay?: number
): boolean => {
  if (currentDay <= 2) return false;
  if (lastArenaEventDay && currentDay - lastArenaEventDay < 2) return false;
  
  // Higher chance if many tributes still alive
  const baseChance = aliveCount > 10 ? 0.25 : 0.15;
  return Math.random() < baseChance;
};
