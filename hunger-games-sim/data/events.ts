import { EventTemplate, EventCategory } from '../types';

/**
 * Event Pool Data - Separate from Logic
 * Each event template uses placeholders that will be replaced dynamically
 */

// Weapons and items for random substitution
export const MELEE_WEAPONS = [
  'knife', 'sword', 'spear', 'axe', 'machete', 
  'trident', 'mace', 'club', 'sickle'
];

export const RANGED_WEAPONS = [
  'bow and arrow', 'crossbow', 'poisoned dart'
];

export const WEAPONS = [...MELEE_WEAPONS, ...RANGED_WEAPONS];

export const ITEMS = [
  'water bottle', 'medkit', 'rope', 'backpack', 'sleeping bag', 
  'matches', 'tent', 'compass', 'map', 'food rations', 'torch'
];

/**
 * Bloodbath Events - High intensity, fast-paced
 */
const bloodbathEvents: EventTemplate[] = [
  {
    id: 'bb_001',
    text: '{Player1} grabs a {Weapon} and runs into the forest.',
    tributesInvolved: 1,
    deaths: [],
    requiresWeapon: true,
  },
  {
    id: 'bb_002',
    text: '{Player1} finds a {Item} and retreats to safety.',
    tributesInvolved: 1,
    deaths: [],
    requiresItem: true,
  },
  {
    id: 'bb_003',
    text: '{Player1} kills {Player2} with a {Weapon}.',
    tributesInvolved: 2,
    deaths: [1], // Player2 dies
    killer: 0, // Player1 gets the kill
    requiresWeapon: true,
  },
  {
    id: 'bb_004',
    text: '{Player1} and {Player2} fight for a backpack. {Player1} gives up and runs away.',
    tributesInvolved: 2,
    deaths: [],
  },
  {
    id: 'bb_005',
    text: '{Player1} and {Player2} fight for a backpack. {Player2} gives up and runs away.',
    tributesInvolved: 2,
    deaths: [],
  },
  {
    id: 'bb_006',
    text: '{Player1} snatches a pair of sais.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'bb_007',
    text: '{Player1} stays at the cornucopia for resources.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'bb_008',
    text: '{Player1} gathers as much food as they can.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'bb_009',
    text: '{Player1}, {Player2}, and {Player3} work together to get as many supplies as possible.',
    tributesInvolved: 3,
    deaths: [],
  },
  {
    id: 'bb_010',
    text: '{Player1} runs away from the cornucopia.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'bb_011',
    text: '{Player1} throws a {Weapon} at {Player2}, killing them.',
    tributesInvolved: 2,
    deaths: [1],
    killer: 0,
    requiresWeapon: true,
  },
  {
    id: 'bb_012',
    text: '{Player1} breaks {Player2}\'s nose for a basket of bread.',
    tributesInvolved: 2,
    deaths: [],
  },
  {
    id: 'bb_013',
    text: '{Player1} severely injures {Player2}, but puts them out of their misery.',
    tributesInvolved: 2,
    deaths: [1],
    killer: 0,
  },
  {
    id: 'bb_014',
    text: '{Player1} severely injures {Player2} and leaves them to die.',
    tributesInvolved: 2,
    deaths: [1],
    killer: 0,
  },
];

/**
 * Day Events - Survival, exploration, alliances
 */
const dayEvents: EventTemplate[] = [
  {
    id: 'day_001',
    text: '{Player1} goes hunting.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'day_002',
    text: '{Player1} finds a cave and takes shelter.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'day_003',
    text: '{Player1} injures themselves tripping over a log.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'day_004',
    text: '{Player1} searches for water.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'day_005',
    text: '{Player1} and {Player2} hunt for tributes together.',
    tributesInvolved: 2,
    deaths: [],
  },
  {
    id: 'day_006',
    text: '{Player1} stabs {Player2} in the back with a {Weapon}.',
    tributesInvolved: 2,
    deaths: [1],
    killer: 0,
    requiresWeapon: true,
  },
  {
    id: 'day_007',
    text: '{Player1} makes a wooden spear.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'day_008',
    text: '{Player1} explores the arena.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'day_009',
    text: '{Player1} practices their archery.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'day_010',
    text: '{Player1} discovers a hidden food cache.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'day_011',
    text: '{Player1}, {Player2}, and {Player3} form an alliance.',
    tributesInvolved: 3,
    deaths: [],
  },
  {
    id: 'day_012',
    text: '{Player1} chases {Player2}.',
    tributesInvolved: 2,
    deaths: [],
  },
  {
    id: 'day_013',
    text: '{Player1} falls into a pit and dies.',
    tributesInvolved: 1,
    deaths: [0],
    killer: -1, // Environmental death
  },
  {
    id: 'day_014',
    text: '{Player1} camouflages themselves in the bushes.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'day_015',
    text: '{Player1} sets up a booby trap.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'day_016',
    text: '{Player1} picks flowers.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'day_017',
    text: '{Player1} begs {Player2} for mercy. {Player2} refuses and kills them.',
    tributesInvolved: 2,
    deaths: [0],
    killer: 1,
  },
  {
    id: 'day_018',
    text: '{Player1} receives fresh food from a sponsor.',
    tributesInvolved: 1,
    deaths: [],
  },
];

/**
 * Night Events - Rest, stealth, paranoia
 */
const nightEvents: EventTemplate[] = [
  {
    id: 'night_001',
    text: '{Player1} starts a fire.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'night_002',
    text: '{Player1} goes to sleep.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'night_003',
    text: '{Player1} sets up camp for the night.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'night_004',
    text: '{Player1} looks at the night sky and thinks of home.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'night_005',
    text: '{Player1} receives medical supplies from a sponsor.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'night_006',
    text: '{Player1} and {Player2} tell stories about their past.',
    tributesInvolved: 2,
    deaths: [],
  },
  {
    id: 'night_007',
    text: '{Player1} and {Player2} huddle for warmth.',
    tributesInvolved: 2,
    deaths: [],
  },
  {
    id: 'night_008',
    text: '{Player1} cries themselves to sleep.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'night_009',
    text: '{Player1} stays awake all night, too afraid to sleep.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'night_010',
    text: '{Player1} climbs a tree to rest.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'night_011',
    text: '{Player1} hears a noise and investigates.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'night_012',
    text: '{Player1} ambushes {Player2} and kills them.',
    tributesInvolved: 2,
    deaths: [1],
    killer: 0,
  },
  {
    id: 'night_013',
    text: '{Player1} quietly sneaks up on {Player2} and strangles them.',
    tributesInvolved: 2,
    deaths: [1],
    killer: 0,
  },
  {
    id: 'night_014',
    text: '{Player1} accidentally steps on a landmine.',
    tributesInvolved: 1,
    deaths: [0],
    killer: -1,
  },
  {
    id: 'night_015',
    text: '{Player1}, {Player2}, and {Player3} sleep in shifts.',
    tributesInvolved: 3,
    deaths: [],
  },
  {
    id: 'night_016',
    text: '{Player1} tends to their wounds.',
    tributesInvolved: 1,
    deaths: [],
  },
];

/**
 * Feast Events - High stakes, confrontations
 */
const feastEvents: EventTemplate[] = [
  {
    id: 'feast_001',
    text: '{Player1} gathers all the supplies they can before fleeing.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'feast_002',
    text: '{Player1} decides not to go to the feast.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'feast_003',
    text: '{Player1} and {Player2} decide to work together to get supplies.',
    tributesInvolved: 2,
    deaths: [],
  },
  {
    id: 'feast_004',
    text: '{Player1} kills {Player2} for their supplies.',
    tributesInvolved: 2,
    deaths: [1],
    killer: 0,
  },
  {
    id: 'feast_005',
    text: '{Player1} destroys {Player2}\'s supplies while they are away.',
    tributesInvolved: 2,
    deaths: [],
  },
  {
    id: 'feast_006',
    text: '{Player1} steals {Player2}\'s supplies.',
    tributesInvolved: 2,
    deaths: [],
  },
  {
    id: 'feast_007',
    text: '{Player1}, {Player2}, and {Player3} start a fight, but {Player2} runs away.',
    tributesInvolved: 3,
    deaths: [],
  },
  {
    id: 'feast_008',
    text: '{Player1} stabs {Player2} with a {Weapon} while their back is turned.',
    tributesInvolved: 2,
    deaths: [1],
    killer: 0,
    requiresWeapon: true,
  },
  {
    id: 'feast_009',
    text: '{Player1} takes the supplies without hesitation.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'feast_010',
    text: '{Player1} and {Player2} get into a fight over the supplies, but {Player1} gives up.',
    tributesInvolved: 2,
    deaths: [],
  },
];

/**
 * Arena Events - Game maker interventions, environmental hazards
 */
const arenaEvents: EventTemplate[] = [
  {
    id: 'arena_001',
    text: 'A fire spreads throughout the arena. {Player1} survives.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'arena_002',
    text: 'A fire spreads throughout the arena. {Player1} is unable to escape and dies.',
    tributesInvolved: 1,
    deaths: [0],
    killer: -1,
  },
  {
    id: 'arena_003',
    text: 'A flood spreads throughout the arena. {Player1} climbs a tree to safety.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'arena_004',
    text: 'A flood spreads throughout the arena. {Player1} is swept away and drowns.',
    tributesInvolved: 1,
    deaths: [0],
    killer: -1,
  },
  {
    id: 'arena_005',
    text: 'Acid rain pours down on the arena. {Player1} finds shelter just in time.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'arena_006',
    text: 'Acid rain pours down on the arena. {Player1} is unable to find shelter and dies.',
    tributesInvolved: 1,
    deaths: [0],
    killer: -1,
  },
  {
    id: 'arena_007',
    text: 'The gamemakers release a pack of mutant wolves. {Player1} survives.',
    tributesInvolved: 1,
    deaths: [],
  },
  {
    id: 'arena_008',
    text: 'The gamemakers release a pack of mutant wolves. {Player1} is torn apart by the wolves.',
    tributesInvolved: 1,
    deaths: [0],
    killer: -1,
  },
  {
    id: 'arena_009',
    text: '{Player1} and {Player2} survive an earthquake.',
    tributesInvolved: 2,
    deaths: [],
  },
  {
    id: 'arena_010',
    text: 'A tsunami strikes the arena. {Player1} holds onto a floating piece of debris and survives.',
    tributesInvolved: 1,
    deaths: [],
  },
];

/**
 * Complete event category export
 */
export const EVENT_POOL: EventCategory = {
  bloodbath: bloodbathEvents,
  day: dayEvents,
  night: nightEvents,
  feast: feastEvents,
  arenaEvent: arenaEvents,
};
