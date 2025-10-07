import { Occupation } from './occupation.types';

/**
 * Guru occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/gourou/
 * Verified: 2025-01-07
 */
export const guru: Occupation = {
    id: 'guru',
    creditRating: { min: 10, max: 60 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'accounting',
      'occult',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Ordinary worshippers', 'Celebrities'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'power', 'intelligence', 'constitution', 'dexterity', 'strength', 'size']
  };
