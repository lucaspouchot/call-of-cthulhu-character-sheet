import { Occupation } from './occupation.types';

/**
 * Occultist occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/occultiste/
 */
export const occultist: Occupation = {
    id: 'occultist',
    creditRating: { min: 9, max: 65 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'anthropology',
      'history',
      'libraryUse',
      'occult',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      { type: 'any', count: 3 }
    ],
    suggestedContacts: ['Libraries', 'Occult societies', 'Other occultists'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'constitution', 'dexterity', 'appearance', 'strength', 'size']
  };
