import { Occupation } from './occupation.types';

/**
 * Boxer occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/boxeur/
 */
export const boxer: Occupation = {
    id: 'boxer',
    creditRating: { min: 9, max: 60 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'strength', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'dodge',
      'fightingBrawl',
      'intimidate',
      'jump',
      'psychology',
      'spotHidden',
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Sports promoters', 'Gyms', 'Boxing community', 'Sports journalists'],
    recommendedCharacteristicsOrder: ['strength', 'constitution', 'dexterity', 'education', 'intelligence', 'power', 'appearance', 'size']
  };
