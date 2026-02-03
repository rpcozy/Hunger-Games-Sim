import { Tribute } from '../types';
import { WEAPONS, ITEMS, MELEE_WEAPONS } from '../data/events';

/**
 * Utility to replace placeholders in event text with actual names and items
 * Placeholders: {Player1}, {Player2}, {Player3}, {Weapon}, {Item}
 */

export interface TextReplacementContext {
  tributes: Tribute[];
  requiresWeapon?: boolean;
  requiresItem?: boolean;
}

/**
 * Get a random element from an array
 */
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Get throwable weapons only (excludes bows, crossbows, and other non-throwable weapons)
 */
const getThrowableWeapon = (): string => {
  const throwableWeapons = WEAPONS.filter(weapon => 
    !weapon.toLowerCase().includes('bow') && 
    !weapon.toLowerCase().includes('crossbow')
  );
  return getRandomElement(throwableWeapons);
};

/**
 * Get melee weapons only (for stabbing, slashing, close combat)
 */
const getMeleeWeapon = (): string => {
  return getRandomElement(MELEE_WEAPONS);
};

/**
 * Replace placeholders in event text
 * @param text - The event template text with placeholders
 * @param context - Tributes and item requirements
 * @returns Processed text with all placeholders replaced
 */
export const replaceTextPlaceholders = (
  text: string,
  context: TextReplacementContext
): string => {
  let processedText = text;
  const { tributes, requiresWeapon, requiresItem } = context;

  // Replace Player placeholders
  tributes.forEach((tribute, index) => {
    const playerPlaceholder = `{Player${index + 1}}`;
    const regex = new RegExp(playerPlaceholder.replace(/[{}]/g, '\\$&'), 'g');
    processedText = processedText.replace(regex, tribute.name);
  });

  // Replace Weapon placeholder
  if (requiresWeapon && processedText.includes('{Weapon}')) {
    // Use appropriate weapon type based on action
    const lowerText = text.toLowerCase();
    let weapon: string;
    
    if (lowerText.includes('throw')) {
      weapon = getThrowableWeapon();
    } else if (lowerText.includes('stab') || lowerText.includes('slash') || 
               lowerText.includes('pierce') || lowerText.includes('swing') || 
               lowerText.includes('hack') || lowerText.includes('chop')) {
      weapon = getMeleeWeapon();
    } else {
      weapon = getRandomElement(WEAPONS);
    }
    
    processedText = processedText.replace(/{Weapon}/g, weapon);
  }

  // Replace Item placeholder
  if (requiresItem && processedText.includes('{Item}')) {
    const item = getRandomElement(ITEMS);
    processedText = processedText.replace(/{Item}/g, item);
  }

  return processedText;
};

/**
 * Get pronoun based on gender
 */
export const getPronoun = (
  gender: 'male' | 'female' | 'other',
  type: 'subject' | 'object' | 'possessive'
): string => {
  const pronounMap = {
    male: { subject: 'he', object: 'him', possessive: 'his' },
    female: { subject: 'she', object: 'her', possessive: 'her' },
    other: { subject: 'they', object: 'them', possessive: 'their' },
  };

  return pronounMap[gender][type];
};

/**
 * Format tribute names for display
 */
export const formatTributeName = (tribute: Tribute, includeDistrict = false): string => {
  if (includeDistrict) {
    return `${tribute.name} (District ${tribute.districtId})`;
  }
  return tribute.name;
};

/**
 * Create a summary of multiple tributes for event text
 * e.g., "Alice, Bob, and Charlie" or "Alice and Bob"
 */
export const formatTributeList = (tributes: Tribute[]): string => {
  if (tributes.length === 0) return '';
  if (tributes.length === 1) return tributes[0].name;
  if (tributes.length === 2) return `${tributes[0].name} and ${tributes[1].name}`;
  
  const names = tributes.map(t => t.name);
  const lastTribute = names.pop();
  return `${names.join(', ')}, and ${lastTribute}`;
};
