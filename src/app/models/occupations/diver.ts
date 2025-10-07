import { Occupation } from './occupation.types';

/**
 * Diver occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/plongeur/
 */
export const diver: Occupation = {
    id: 'diver',
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
      'mechanicalRepair',
      'swim',
      { type: 'specialization', baseSkillId: 'pilot', allowCustom: false, suggestedSpecializations: ['pilotBoat'] },
      'diving',
      'firstAid',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceBiology'] },
      'spotHidden',
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Marine research', 'Salvage companies', 'Coast guard'],
    recommendedCharacteristicsOrder: ['dexterity', 'constitution', 'strength', 'education', 'intelligence', 'power', 'size', 'appearance']
  };
