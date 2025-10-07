import { Occupation } from './occupation.types';

/**
 * MilitaryOfficer occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/officier/
 * Verified: 2025-01-07
 */
export const militaryOfficer: Occupation = {
    id: 'militaryOfficer',
    creditRating: { min: 20, max: 70 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }, { attribute: 'strength', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'firearms',
      'navigate',
      'firstAid',
      'psychology',
      { type: 'choice', count: 1, options: ['charm', 'persuade'] },
      { type: 'any', count: 3 }
    ],
    suggestedContacts: ['Military', 'Government'],
    recommendedCharacteristicsOrder: ['education', 'dexterity', 'strength', 'constitution', 'power', 'intelligence', 'appearance', 'size']
  };
