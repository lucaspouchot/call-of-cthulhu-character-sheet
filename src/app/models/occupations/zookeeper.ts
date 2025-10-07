import { Occupation } from './occupation.types';

/**
 * Zookeeper occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/gardien-de-zoo/
 */
export const zookeeper: Occupation = {
    id: 'zookeeper',
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
      'accounting',
      'animalHandling',
      'dodge',
      'medicine',
      'naturalWorld',
      'firstAid',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['sciencePharmacy'] },
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceZoology'] }
    ],
    suggestedContacts: ['Scientists', 'Ecologists'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'constitution', 'dexterity', 'power', 'strength', 'size', 'appearance']
  };
