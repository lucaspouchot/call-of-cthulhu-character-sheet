import { Occupation } from './occupation.types';

/**
 * NewsReporter occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/reporter/
 * Verified: 2025-10-07
 */
export const newsReporter: Occupation = {
  id: 'newsReporter',
  creditRating: { min: 9, max: 30 },
  occupationSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'education', multiplier: 4 }]
  },
  personalSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'intelligence', multiplier: 2 }]
  },
  occupationSkills: [
    { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftActing'] },
    'stealth',
    'listen',
    'history',
    'ownLanguage',
    'psychology',
    'spotHidden',
    { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
  ],
  suggestedContacts: ['Media', 'Politicians', 'Business', 'Police', 'Street criminals', 'High society'],
  recommendedCharacteristicsOrder: ['education', 'intelligence', 'constitution', 'appearance', 'dexterity', 'power', 'strength', 'size']
};
