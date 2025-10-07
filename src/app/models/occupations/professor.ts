import { Occupation } from './occupation.types';

/**
 * Professor occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/professeur/
 */
export const professor: Occupation = {
    id: 'professor',
    creditRating: { min: 20, max: 70 },
    occupationSkillPoints: {
      type: 'cumulative',
      formulas: [{ attribute: 'education', multiplier: 4 }, { attribute: 'intelligence', multiplier: 2 }]
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
      { type: 'any', count: 4 }
    ],
    suggestedContacts: ['Scholars', 'Academics', 'Library staff'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'strength', 'size']
  };
