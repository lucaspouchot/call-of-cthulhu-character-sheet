import { Occupation } from './occupation.types';

/**
 * Lumberjack occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/bucheron/
 * Verified: 2025-01-07
 */
export const lumberjack: Occupation = {
    id: 'lumberjack',
    creditRating: { min: 9, max: 30 },
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
      'firstAid',
      'jump',
      'listen',
      'mechanicalRepair',
      'naturalWorld',
      'spotHidden',
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Logging companies', 'Forestry workers', 'Environmental groups', 'Equipment suppliers'],
    recommendedCharacteristicsOrder: ['strength', 'constitution', 'dexterity', 'education', 'intelligence', 'power', 'size', 'appearance']
  };
