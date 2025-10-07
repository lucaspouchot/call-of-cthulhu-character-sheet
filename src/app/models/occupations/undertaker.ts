import { Occupation } from './occupation.types';

/**
 * Undertaker occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/croque-mort/
 */
export const undertaker: Occupation = {
    id: 'undertaker',
    creditRating: { min: 20, max: 40 },
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
      'driveAuto',
      'history',
      'occult',
      'psychology',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceBiology'] },
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceChemistry'] },
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Bereaved families', 'Related services (priests, coffin suppliers)'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'appearance', 'power', 'constitution', 'dexterity', 'size', 'strength']
  };
