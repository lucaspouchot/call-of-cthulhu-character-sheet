import { Occupation } from './occupation.types';

/**
 * Professor occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/professeur/
 * Verified: 2025-01-07
 */
export const professor: Occupation = {
    id: 'professor',
    creditRating: { min: 20, max: 70 },
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
      'ownLanguage',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'psychology',
      { type: 'any', count: 4, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Scholars', 'Academics', 'Library staff'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'strength', 'size']
  };
