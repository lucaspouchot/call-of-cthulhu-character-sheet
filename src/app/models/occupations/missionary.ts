import { Occupation } from './occupation.types';

/**
 * Missionary occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/missionnaire/
 * Verified: 2025-01-07
 */
export const missionary: Occupation = {
    id: 'missionary',
    creditRating: { min: 0, max: 30 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 2 }, { attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
      'mechanicalRepair',
      'medicine',
      'naturalWorld',
      'firstAid',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Church hierarchy', 'Foreign bureaucrats'],
    recommendedCharacteristicsOrder: ['education', 'appearance', 'intelligence', 'power', 'constitution', 'dexterity', 'strength', 'size']
  };
