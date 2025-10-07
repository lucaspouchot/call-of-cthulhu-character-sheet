import { Occupation } from './occupation.types';

/**
 * Gangster occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/mafieux/
 * Verified: 2025-01-07
 */
export const gangster: Occupation = {
  id: 'gangster',
  creditRating: { min: 20, max: 40 },
  occupationSkillPoints: {
    type: 'composite',
    formulas: [{ attribute: 'education', multiplier: 2 }],
    choiceFormulas: [
      { attribute: 'dexterity', multiplier: 2 },
      { attribute: 'strength', multiplier: 2 }
    ]
  },
  personalSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'intelligence', multiplier: 2 }]
  },
  occupationSkills: [
    'firearm',
    'fighting',
    'driveAuto',
    'psychology',
    { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
    { type: 'any', count: 2 }
  ],
  suggestedContacts: ['Street criminals', 'Corrupt police', 'Local community members'],
  recommendedCharacteristicsOrder: ['dexterity', 'strength', 'education', 'appearance', 'constitution', 'power', 'intelligence', 'size']
};
