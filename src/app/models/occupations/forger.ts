import { Occupation } from './occupation.types';

/**
 * Forger occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/faussaire/
 * Verified: 2025-01-07
 */
export const forger: Occupation = {
  id: 'forger',
  creditRating: { min: 20, max: 60 },
  occupationSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'education', multiplier: 4 }]
  },
  personalSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'intelligence', multiplier: 2 }]
  },
  occupationSkills: [
    { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftForgery'] },
    'libraryUse',
    'accounting',
    'appraise',
    'history',
    'sleightOfHand',
    'spotHidden',
    { type: 'any', count: 1 }
  ],
  suggestedContacts: ['Organized crime', 'Businessmen'],
  recommendedCharacteristicsOrder: ['education', 'dexterity', 'intelligence', 'power', 'appearance', 'constitution', 'size', 'strength']
};
