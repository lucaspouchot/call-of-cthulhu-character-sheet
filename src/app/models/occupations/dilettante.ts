import { Occupation } from './occupation.types';

/**
 * Dilettante occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/dilettante/
 */
export const dilettante: Occupation = {
    id: 'dilettante',
    creditRating: { min: 50, max: 99 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
      'firearmsHandgun',
      'ride',
      { type: 'specialization', baseSkillId: 'language', allowCustom: true },
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 3 }
    ],
    suggestedContacts: ['People of the same status', 'Fraternities and artistic circles', 'High society'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'intelligence', 'power', 'constitution', 'dexterity', 'size', 'strength']
  };
