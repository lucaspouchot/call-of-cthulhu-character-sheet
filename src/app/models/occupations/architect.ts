import { Occupation } from './occupation.types';

/**
 * Architect occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/architecte/
 */
export const architect: Occupation = {
    id: 'architect',
    creditRating: { min: 30, max: 70 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftTechnicalDrawing'] },
      'accounting',
      'law',
      'history',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'psychology',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceEngineering'] },
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Construction companies', 'Engineers', 'City officials', 'Clients'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'appearance', 'power', 'constitution', 'size', 'strength']
  };
