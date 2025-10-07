import { Occupation } from './occupation.types';

/**
 * Driver occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/chauffeur-de-taxi/
 * Verified: 2025-10-07
 */
export const driver: Occupation = {
  id: 'driver',
  creditRating: { min: 9, max: 30 },
  occupationSkillPoints: {
    type: 'cumulative',
    formulas: [
      { attribute: 'education', multiplier: 2 },
      { attribute: 'dexterity', multiplier: 2 }
    ]
  },
  personalSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'intelligence', multiplier: 2 }]
  },
  occupationSkills: [
    'fastTalk',
    'accounting',
    'driveAuto',
    'electricalRepair',
    'mechanicalRepair',
    'navigate',
    'spotHidden',
    { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['Truckers', 'Taxi drivers', 'Rental agencies'],
  recommendedCharacteristicsOrder: ['dexterity', 'education', 'constitution', 'intelligence', 'power', 'strength', 'appearance', 'size']
};
