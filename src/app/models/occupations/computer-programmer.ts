import { Occupation } from './occupation.types';

/**
 * ComputerProgrammer occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/informaticien/
 */
export const computerProgrammer: Occupation = {
    id: 'computerProgrammer',
    creditRating: { min: 10, max: 70 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'libraryUse',
      'electricalRepair',
      'electronics',
      'computerUse',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceMathematics'] },
      'spotHidden',
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Other programmers', 'Company employees and executives', 'Internet communities'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'power', 'constitution', 'appearance', 'strength', 'size']
  };
