import { Occupation } from './occupation.types';

/**
 * Curator occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/conservateur/
 */
export const curator: Occupation = {
    id: 'curator',
    creditRating: { min: 10, max: 30 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'archaeology',
      'libraryUse',
      'accounting',
      'appraise',
      'history',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'occult',
      'spotHidden'
    ],
    suggestedContacts: ['Local academics and scholars', 'Publishing houses', 'Museum visitors'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'appearance', 'power', 'constitution', 'size', 'strength']
  };
