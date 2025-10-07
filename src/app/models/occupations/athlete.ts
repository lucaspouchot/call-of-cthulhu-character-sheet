import { Occupation } from './occupation.types';

/**
 * Athlete occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/athlete/
 * Verified: 2025-10-07
 */
export const athlete: Occupation = {
  id: 'athlete',
  creditRating: { min: 9, max: 70 },
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
    'fightingBrawl',
    'ride',
    'climb',
    'throw',
    'swim',
    'jump',
    { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
    { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['Sports teams', 'Coaches', 'Fans', 'Sports journalists'],
  recommendedCharacteristicsOrder: ['dexterity', 'strength', 'constitution', 'education', 'appearance', 'intelligence', 'power', 'size']
};
