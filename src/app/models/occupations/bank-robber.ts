import { Occupation } from './occupation.types';

/**
 * BankRobber occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/braqueur-de-banque/
 */
export const bankRobber: Occupation = {
    id: 'bankRobber',
    creditRating: { min: 5, max: 75 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'strength', multiplier: 2 },
        { attribute: 'dexterity', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'appraise',
      'driveAuto',
      'electricalRepair',
      'firearmsHandgun',
      'fightingBrawl',
      'intimidate',
      'locksmith',
      'mechanicalRepair'
    ],
    suggestedContacts: ['Criminal underworld', 'Fences', 'Corrupt officials', 'Former accomplices'],
    recommendedCharacteristicsOrder: ['dexterity', 'strength', 'constitution', 'intelligence', 'education', 'power', 'appearance', 'size']
  };
