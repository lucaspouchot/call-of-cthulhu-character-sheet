import { Occupation } from './occupation.types';

/**
 * TruckDriver occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/routier/
 * Verified: 2025-01-07
 */
export const truckDriver: Occupation = {
    id: 'truckDriver',
    creditRating: { min: 9, max: 20 },
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
      'accounting',
      'drive',
      'listen',
      'mechanicalRepair',
      'navigate',
      'psychology',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Clients', 'Merchants', 'Local police', 'Street criminals'],
    recommendedCharacteristicsOrder: ['dexterity', 'constitution', 'strength', 'intelligence', 'education', 'power', 'appearance', 'size']
  };
