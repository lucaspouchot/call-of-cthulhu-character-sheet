import { Occupation } from './occupation.types';

/**
 * Athlete occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/athlete/
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
      'climb',
      'jump',
      'fightingBrawl',
      'ride',
      'swim',
      'throw',
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Sports teams', 'Coaches', 'Fans', 'Sports journalists'],
    recommendedCharacteristicsOrder: ['dexterity', 'strength', 'constitution', 'education', 'appearance', 'intelligence', 'power', 'size']
  };
