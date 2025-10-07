import { Occupation } from './occupation.types';

/**
 * Explorer occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/explorateur/
 * Verified: 2025-10-07
 */
export const explorer: Occupation = {
  id: 'explorer',
  creditRating: { min: 30, max: 70 },
  occupationSkillPoints: {
    type: 'composite',
    formulas: [{ attribute: 'education', multiplier: 2 }],
    choiceFormulas: [
      { attribute: 'appearance', multiplier: 2 },
      { attribute: 'dexterity', multiplier: 2 },
      { attribute: 'strength', multiplier: 2 }
    ]
  },
  personalSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'intelligence', multiplier: 2 }]
  },
  occupationSkills: [
    'firearmsRifle',
    { type: 'choice', count: 1, options: ['climb', 'swim'] },
    'history',
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    'naturalWorld',
    'navigate',
    'jump',
    { type: 'specialization', baseSkillId: 'survival', allowCustom: true }
  ],
  suggestedContacts: ['Libraries and universities', 'Museums', 'Wealthy patrons', 'Other explorers', 'Publishing houses', 'Foreign bureaucrats', 'Primitive tribes'],
  recommendedCharacteristicsOrder: ['education', 'strength', 'dexterity', 'appearance', 'constitution', 'intelligence', 'power', 'size']
};
