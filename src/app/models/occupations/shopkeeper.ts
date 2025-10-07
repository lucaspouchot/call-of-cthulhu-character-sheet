import { Occupation } from './occupation.types';

/**
 * Shopkeeper occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/commercant/
 * Verified: 2025-01-07
 */
export const shopkeeper: Occupation = {
    id: 'shopkeeper',
    creditRating: { min: 20, max: 40 },
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
      'accounting',
      'listen',
      'electricalRepair',
      'mechanicalRepair',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Neighborhood residents and merchants', 'Police', 'Local officials', 'Customers'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'intelligence', 'dexterity', 'power', 'constitution', 'size', 'strength']
  };
