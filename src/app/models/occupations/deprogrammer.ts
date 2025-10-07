import { Occupation } from './occupation.types';

/**
 * Deprogrammer occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/deprogrammeur/
 * Verified: 2025-10-07
 */
export const deprogrammer: Occupation = {
  id: 'deprogrammer',
  creditRating: { min: 20, max: 50 },
  occupationSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'education', multiplier: 4 }]
  },
  personalSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'intelligence', multiplier: 2 }]
  },
  occupationSkills: [
    { type: 'choice', count: 1, options: ['fightingBrawl', 'firearmsHandgun'] },
    'driveAuto',
    'stealth',
    'history',
    'occult',
    'psychology',
    { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
  ],
  suggestedContacts: ['Law enforcement', 'Criminal underworld', 'Religious communities'],
  recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'strength', 'size']
};
