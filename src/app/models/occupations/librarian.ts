import { Occupation } from './occupation.types';

/**
 * Librarian occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/bibliothecaire/
 * Verified: 2025-01-07
 */
export const librarian: Occupation = {
    id: 'librarian',
    creditRating: { min: 9, max: 35 },
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
      'libraryUse',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'history',
      'spotHidden',
      { type: 'any', count: 3, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Scholars', 'Researchers', 'Book collectors', 'University staff'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'appearance', 'power', 'constitution', 'size', 'strength']
  };
