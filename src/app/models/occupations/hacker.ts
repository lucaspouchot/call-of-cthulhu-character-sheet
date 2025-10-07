import { Occupation } from './occupation.types';

/**
 * Hacker occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/pirate-informatique/
 */
export const hacker: Occupation = {
    id: 'hacker',
    creditRating: { min: 10, max: 70 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'computerUse',
      'electronics',
      'libraryUse',
      'spotHidden',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceComputing'] },
      { type: 'any', count: 3 }
    ],
    suggestedContacts: ['Other hackers', 'Online communities', 'Software companies'],
    recommendedCharacteristicsOrder: ['intelligence', 'education', 'dexterity', 'constitution', 'power', 'appearance', 'strength', 'size']
  };
