import { Occupation } from './occupation.types';

/**
 * Musician occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/musicien/
 * Verified: 2025-01-07
 */
export const musician: Occupation = {
  id: 'musician',
  creditRating: { min: 9, max: 30 },
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
    { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
    'listen',
    'psychology',
    { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
    { type: 'any', count: 4 }
  ],
  suggestedContacts: ['Club owners', 'Musician union', 'Organized crime', 'Street criminals'],
  recommendedCharacteristicsOrder: ['education', 'appearance', 'dexterity', 'power', 'constitution', 'intelligence', 'strength', 'size']
};
