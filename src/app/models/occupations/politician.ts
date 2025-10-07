import { Occupation } from './occupation.types';

/**
 * Politician occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/homme-politique/
 */
export const politician: Occupation = {
    id: 'politician',
    creditRating: { min: 50, max: 90 },
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
      'fastTalk',
      'charm',
      'listen',
      'history',
      'intimidate',
      'persuade',
      'psychology',
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Bureaucrats', 'Elected officials', 'Media', 'Businessmen', 'Foreign governments', 'Criminal underworld'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'intelligence', 'power', 'constitution', 'dexterity', 'size', 'strength']
  };
