import { Occupation } from './occupation.types';

/**
 * Thug occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/petite-frappe/
 */
export const thug: Occupation = {
    id: 'thug',
    creditRating: { min: 3, max: 10 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }, { attribute: 'strength', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'climb',
      'fighting',
      'firearms',
      'intimidate',
      'jump',
      'stealth',
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Street gangs', 'Organized crime', 'Fences'],
    recommendedCharacteristicsOrder: ['strength', 'dexterity', 'constitution', 'size', 'power', 'appearance', 'intelligence', 'education']
  };
