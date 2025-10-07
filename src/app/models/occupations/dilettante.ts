import { Occupation } from './occupation.types';

/**
 * Dilettante occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/dilettante/
 * Verified: 2025-10-07
 */
export const dilettante: Occupation = {
  id: 'dilettante',
  creditRating: { min: 50, max: 99 },
  occupationSkillPoints: {
    type: 'cumulative',
    formulas: [
      { attribute: 'education', multiplier: 2 },
      { attribute: 'appearance', multiplier: 2 }
    ]
  },
  personalSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'intelligence', multiplier: 2 }]
  },
  occupationSkills: [
    { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
    'firearmsHandgun',
    'ride',
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
    { type: 'any', count: 3, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['People of the same status', 'Fraternities and artistic circles', 'High society'],
  recommendedCharacteristicsOrder: ['appearance', 'education', 'intelligence', 'power', 'constitution', 'dexterity', 'size', 'strength']
};
