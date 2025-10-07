import { Occupation } from './occupation.types';

/**
 * LabAssistant occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/laborantin/
 * Verified: 2025-01-07
 */
export const labAssistant: Occupation = {
    id: 'labAssistant',
    creditRating: { min: 10, max: 30 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'electricalRepair',
      { type: 'choice', count: 1, options: ['computerUse', 'libraryUse'] },
      'otherLanguage',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceChemistry'] },
      { type: 'specialization', baseSkillId: 'science', allowCustom: true },
      { type: 'specialization', baseSkillId: 'science', allowCustom: true },
      'spotHidden',
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Universities', 'Scientists', 'Libraries'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'power', 'constitution', 'strength', 'appearance', 'size']
  };
