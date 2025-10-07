import { Occupation } from './occupation.types';

/**
 * Driver occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/conducteur/
 */
export const driver: Occupation = {
    id: 'driver',
    creditRating: { min: 10, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'driveAuto',
      'mechanicalRepair',
      'dodge',
      'listen',
      'navigate',
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.repair' },
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Truckers', 'Taxi drivers', 'Rental agencies'],
    recommendedCharacteristicsOrder: ['dexterity', 'education', 'constitution', 'intelligence', 'power', 'strength', 'appearance', 'size']
  };
