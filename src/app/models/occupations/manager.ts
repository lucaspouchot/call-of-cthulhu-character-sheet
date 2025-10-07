import { Occupation } from './occupation.types';

/**
 * Manager occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/manager/
 * Verified: 2025-01-07
 */
export const manager: Occupation = {
    id: 'manager',
    creditRating: { min: 40, max: 90 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'accounting',
      'law',
      'otherLanguage',
      'psychology',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Former classmates', 'Secret societies', 'Local and federal officials', 'Media and advertising'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'appearance', 'power', 'constitution', 'dexterity', 'strength', 'size']
  };
