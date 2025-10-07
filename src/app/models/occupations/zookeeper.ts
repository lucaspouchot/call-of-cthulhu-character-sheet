import { Occupation } from './occupation.types';

/**
 * Zookeeper occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/gardien-de-zoo/
 * Verified: 2025-01-07
 */
export const zookeeper: Occupation = {
    id: 'zookeeper',
    creditRating: { min: 9, max: 40 },
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
