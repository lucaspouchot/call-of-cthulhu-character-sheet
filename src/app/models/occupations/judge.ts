import { Occupation } from './occupation.types';

/**
 * Judge occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/juge/
 * Verified: 2025-01-07
 */
export const judge: Occupation = {
    id: 'judge',
    creditRating: { min: 50, max: 80 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'libraryUse',
      'law',
      'listen',
      'history',
      'intimidate',
      'persuade',
      'psychology',
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Legal professionals', 'Organized crime'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'size', 'strength']
  };
