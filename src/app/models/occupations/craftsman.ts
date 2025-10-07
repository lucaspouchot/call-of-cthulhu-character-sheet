import { Occupation } from './occupation.types';

/**
 * Craftsman occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/artisan/
 * Verified: 2025-10-07
 */
export const craftsman: Occupation = {
  id: 'craftsman',
  creditRating: { min: 10, max: 40 },
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
    { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
    { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
    'accounting',
    'mechanicalRepair',
    'naturalWorld',
    'spotHidden',
    { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['Customers', 'Suppliers', 'Trade associations'],
  recommendedCharacteristicsOrder: ['dexterity', 'education', 'intelligence', 'strength', 'constitution', 'power', 'appearance', 'size']
};
