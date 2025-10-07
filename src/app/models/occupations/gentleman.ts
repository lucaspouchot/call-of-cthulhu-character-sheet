import { Occupation } from './occupation.types';

/**
 * Gentleman occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/gentilhomme/
 * Verified: 2025-01-07
 */
export const gentleman: Occupation = {
  id: 'gentleman',
  creditRating: { min: 40, max: 90 },
  occupationSkillPoints: {
    type: 'composite',
    formulas: [{ attribute: 'education', multiplier: 2 }],
    choiceFormulas: [{ attribute: 'appearance', multiplier: 2 }]
  },
  personalSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'intelligence', multiplier: 2 }]
  },
  occupationSkills: [
    { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
    'firearmsRifle',
    'ride',
    'history',
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    'navigate',
    { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
  ],
  suggestedContacts: ['Aristocrats and wealthy bourgeois', 'Politicians', 'Domestic servants and agricultural workers'],
  recommendedCharacteristicsOrder: ['appearance', 'education', 'intelligence', 'power', 'constitution', 'dexterity', 'size', 'strength']
};
