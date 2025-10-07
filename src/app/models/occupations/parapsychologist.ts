import { Occupation } from './occupation.types';

/**
 * Parapsychologist occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/parapsychologue/
 * Verified: 2025-01-07
 */
export const parapsychologist: Occupation = {
    id: 'parapsychologist',
    creditRating: { min: 9, max: 30 },
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
      'psychology',
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Universities', 'Parapsychology societies', 'Libraries'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'constitution', 'dexterity', 'appearance', 'strength', 'size']
  };
