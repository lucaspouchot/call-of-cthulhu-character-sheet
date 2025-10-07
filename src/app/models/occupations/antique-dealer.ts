import { Occupation } from './occupation.types';

/**
 * AntiqueDealer occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/antiquaire/
 * Verified: 2025-10-07
 */
export const antiqueDealer: Occupation = {
  id: 'antiqueDealer',
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
    { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true, suggestedSpecializations: [] },
    'libraryUse',
    'appraise',
    'history',
    'otherLanguage',
    'spotHidden',
    { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
    { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['Local historians', 'Other antique dealers', 'Fences'],
  recommendedCharacteristicsOrder: ['education', 'intelligence', 'appearance', 'power', 'constitution', 'dexterity', 'size', 'strength']
};
