import { Occupation } from './occupation.types';

/**
 * Farmer occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/agriculteur/
 */
export const farmer: Occupation = {
    id: 'farmer',
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
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftFarming'] },
      'driveAuto',
      'operateHeavyMachinery',
      'mechanicalRepair',
      'naturalWorld',
      'track',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Banks', 'Local officials', 'Agriculture department'],
    recommendedCharacteristicsOrder: ['strength', 'constitution', 'dexterity', 'education', 'intelligence', 'power', 'size', 'appearance']
  };
