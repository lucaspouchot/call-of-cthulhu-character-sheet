import { Occupation } from './occupation.types';

/**
 * UnskilledWorker occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/ouvrier-non-qualifie/
 * Verified: 2025-01-07
 */
export const unskilledWorker: Occupation = {
    id: 'unskilledWorker',
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
      'drive',
      'electricalRepair',
      'fighting',
      'firstAid',
      'mechanicalRepair',
      'throw',
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Union', 'Coworkers', 'Organized crime'],
    recommendedCharacteristicsOrder: ['strength', 'dexterity', 'constitution', 'education', 'size', 'power', 'intelligence', 'appearance']
  };
