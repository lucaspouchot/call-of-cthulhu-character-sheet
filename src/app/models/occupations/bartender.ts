import { Occupation } from './occupation.types';

/**
 * Bartender occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/barman/
 */
export const bartender: Occupation = {
    id: 'bartender',
    creditRating: { min: 8, max: 25 },
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
      'accounting',
      'fastTalk',
      'fightingBrawl',
      'listen',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 2, options: ['charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Regular customers', 'Local community', 'Suppliers', 'Law enforcement'],
    recommendedCharacteristicsOrder: ['appearance', 'constitution', 'education', 'intelligence', 'dexterity', 'power', 'strength', 'size']
  };
