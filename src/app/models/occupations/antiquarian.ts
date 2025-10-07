import { Occupation } from './occupation.types';

/**
 * Antiquarian occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/antiquaire/
 */
export const antiquarian: Occupation = {
    id: 'antiquarian',
    creditRating: { min: 30, max: 70 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'appraise',
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
      'history',
      'libraryUse',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'navigate',
      'occult',
      'spotHidden'
    ],
    suggestedContacts: ['Auction houses', 'Dealers', 'Historians', 'Museums'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'appearance', 'constitution', 'size', 'power', 'strength']
  };
