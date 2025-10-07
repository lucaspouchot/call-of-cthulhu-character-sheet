import { Occupation } from './occupation.types';

/**
 * Miner occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/mineur/
 */
export const miner: Occupation = {
    id: 'miner',
    creditRating: { min: 9, max: 30 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 2 }, { attribute: 'strength', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'operateHeavyMachinery',
      'stealth',
      'climb',
      'mechanicalRepair',
      'jump',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceGeology'] },
      'spotHidden',
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Union members', 'Political organizations'],
    recommendedCharacteristicsOrder: ['strength', 'education', 'constitution', 'dexterity', 'intelligence', 'power', 'size', 'appearance']
  };
