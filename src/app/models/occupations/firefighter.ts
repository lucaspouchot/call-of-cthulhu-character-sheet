import { Occupation } from './occupation.types';

/**
 * Firefighter occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/pompier/
 * Verified: 2025-01-07
 */
export const firefighter: Occupation = {
  id: 'firefighter',
  creditRating: { min: 9, max: 30 },
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
    'operateHeavyMachinery',
    'driveAuto',
    'dodge',
    'climb',
    'throw',
    'mechanicalRepair',
    'firstAid',
    'jump'
  ],
  suggestedContacts: ['Fire department', 'Emergency services', 'Local community'],
  recommendedCharacteristicsOrder: ['strength', 'dexterity', 'constitution', 'education', 'intelligence', 'power', 'size', 'appearance']
};
