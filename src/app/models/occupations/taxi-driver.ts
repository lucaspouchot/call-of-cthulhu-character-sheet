import { Occupation } from './occupation.types';

/**
 * TaxiDriver occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/chauffeur-de-taxi/
 * Verified: 2025-01-07
 */
export const taxiDriver: Occupation = {
    id: 'taxiDriver',
    creditRating: { min: 9, max: 30 },
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
      'fastTalk',
      'accounting',
      'driveAuto',
      'electricalRepair',
      'mechanicalRepair',
      'navigate',
      'spotHidden',
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Random people', 'Notable clients'],
    recommendedCharacteristicsOrder: ['dexterity', 'education', 'intelligence', 'constitution', 'power', 'appearance', 'size', 'strength']
  };
