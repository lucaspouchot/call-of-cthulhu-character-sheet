import { Occupation } from './occupation.types';

/**
 * Employee occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/employe/
 */
export const employee: Occupation = {
    id: 'employee',
    creditRating: { min: 9, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'accounting',
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
      'listen',
      { type: 'specialization', baseSkillId: 'language', allowCustom: true },
      'psychology',
      { type: 'any', count: 3 }
    ],
    suggestedContacts: ['Office colleagues', 'Former university classmates', 'Friends or family in other companies'],
    recommendedCharacteristicsOrder: ['education', 'dexterity', 'intelligence', 'appearance', 'constitution', 'power', 'size', 'strength']
  };
