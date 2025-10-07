import { Occupation } from './occupation.types';

/**
 * Student occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/etudiant/
 * Verified: 2025-01-07
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
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    { type: 'any', count: 5, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['Professors', 'Other students', 'Company contacts (for interns)'],
  recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'size', 'strength']
};
