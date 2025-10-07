import { Occupation } from './occupation.types';

/**
 * HitMan occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/tueur-a-gages/
 * Verified: 2025-01-07
 */
export const hitMan: Occupation = {
    id: 'hitMan',
    creditRating: { min: 30, max: 60 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }, { attribute: 'strength', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'firearms',
      'fighting',
      'locksmith',
      'stealth',
      'electricalRepair',
      'disguise',
      'mechanicalRepair',
      'psychology'
    ],
    suggestedContacts: ['Criminal underworld', 'Anonymous clients'],
    recommendedCharacteristicsOrder: ['dexterity', 'strength', 'intelligence', 'constitution', 'power', 'appearance', 'education', 'size']
  };
