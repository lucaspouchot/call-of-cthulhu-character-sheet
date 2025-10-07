import { Occupation } from './occupation.types';

/**
 * Bartender occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/barman/
 * Verified: 2025-10-07
 */
export const bartender: Occupation = {
  id: 'bartender',
  creditRating: { min: 8, max: 25 },
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
    'fightingBrawl',
    'accounting',
    'listen',
    'psychology',
    'spotHidden',
    { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
    { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['Regular customers', 'Local community', 'Suppliers', 'Law enforcement'],
  recommendedCharacteristicsOrder: ['appearance', 'constitution', 'education', 'intelligence', 'dexterity', 'power', 'strength', 'size']
};
