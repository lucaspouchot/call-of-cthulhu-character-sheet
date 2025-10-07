import { Occupation } from './occupation.types';

/**
 * Mechanic occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/mecanicien/
 */
export const mechanic: Occupation = {
    id: 'mechanic',
    creditRating: { min: 9, max: 40 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
      'operateHeavyMachinery',
      'driveAuto',
      'electricalRepair',
      'climb',
      'mechanicalRepair',
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Union members', 'Specialists in their field'],
    recommendedCharacteristicsOrder: ['education', 'dexterity', 'strength', 'intelligence', 'constitution', 'power', 'appearance', 'size']
  };
