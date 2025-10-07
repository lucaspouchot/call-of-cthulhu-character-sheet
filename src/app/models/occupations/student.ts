import { Occupation } from './occupation.types';

/**
 * Student occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/etudiant/
 */
export const student: Occupation = {
    id: 'student',
    creditRating: { min: 5, max: 10 },
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
      'listen',
      { type: 'specialization', baseSkillId: 'language', allowCustom: true },
      { type: 'any', count: 5 }
    ],
    suggestedContacts: ['Professors', 'Other students', 'Company contacts (for interns)'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'size', 'strength']
  };
