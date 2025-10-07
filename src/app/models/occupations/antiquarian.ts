import { Occupation } from './occupation.types';

/**
 * Antiquarian occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/antiquaire/
 * Verified: 2025-10-07
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
    { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
    'libraryUse',
    'appraise',
    'history',
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    'spotHidden',
    { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
    { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['Auction houses', 'Dealers', 'Historians', 'Museums'],
  recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'appearance', 'constitution', 'size', 'power', 'strength']
};
