import { Occupation } from './occupation.types';

/**
 * Politician occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/homme-politique/
 * Verified: 2025-01-07
 */
export const politician: Occupation = {
    id: 'politician',
    creditRating: { min: 50, max: 90 },
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
      'fastTalk',
      'charm',
      'listen',
      'history',
      'intimidate',
      'persuade',
      'psychology',
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Bureaucrats', 'Elected officials', 'Media', 'Businessmen', 'Foreign governments', 'Criminal underworld'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'intelligence', 'power', 'constitution', 'dexterity', 'size', 'strength']
  };
