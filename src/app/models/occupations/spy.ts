import { Occupation } from './occupation.types';

/**
 * Spy occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/espion/
 * Verified: 2025-01-07
 */
export const spy: Occupation = {
  id: 'spy',
  creditRating: { min: 20, max: 60 },
  occupationSkillPoints: {
    type: 'composite',
    formulas: [{ attribute: 'education', multiplier: 2 }],
    choiceFormulas: [
      { attribute: 'appearance', multiplier: 2 },
      { attribute: 'dexterity', multiplier: 2 }
    ]
  },
  personalSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'intelligence', multiplier: 2 }]
  },
  occupationSkills: [
    {
      type: 'mixedChoice', count: 1, options: [
        'disguise',
        { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftActing'] }
      ]
    },
    'firearmsHandgun',
    'stealth',
    'listen',
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    'sleightOfHand',
    'psychology',
    { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
  ],
  suggestedContacts: ['Superior handler', 'Contacts based on cover identity', 'Local informants'],
  recommendedCharacteristicsOrder: ['education', 'appearance', 'dexterity', 'intelligence', 'power', 'constitution', 'size', 'strength']
};
