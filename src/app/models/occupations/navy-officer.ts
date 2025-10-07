import { Occupation } from './occupation.types';

/**
 * NavyOfficer occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/marine-militaire/
 * Verified: 2025-01-07
 */
export const navyOfficer: Occupation = {
    id: 'navyOfficer',
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
      'firearm',
      'fighting',
      { type: 'choice', count: 1, options: ['electricalRepair', 'mechanicalRepair'] },
      'swim',
      'navigate',
      'pilotBoat',
      'firstAid',
      { type: 'specialization', baseSkillId: 'survival', allowCustom: false, suggestedSpecializations: ['survivalSea'] }
    ],
    suggestedContacts: ['Military personnel', 'Veteran associations'],
    recommendedCharacteristicsOrder: ['education', 'strength', 'dexterity', 'intelligence', 'constitution', 'power', 'appearance', 'size']
  };
