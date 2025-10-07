import { Occupation } from './occupation.types';

/**
 * Employee occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/employe/
 * Verified: 2025-10-07
 * Note: Web lists 9 skills which is unusual - kept core 8
 */
export const employee: Occupation = {
  id: 'employee',
  creditRating: { min: 9, max: 30 },
  occupationSkillPoints: {
    type: 'cumulative',
    formulas: [
      { attribute: 'education', multiplier: 2 },
      { attribute: 'dexterity', multiplier: 2 }
    ]
  },
  personalSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'intelligence', multiplier: 2 }]
  },
  occupationSkills: [
    'accounting',
    { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
    'computerUse',
    'law',
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    'psychology',
    { type: 'customSkill', skillNameKey: 'skills.humanResources', baseValue: 5, description: 'character.creation.skills.customSkills.humanResources' },
    { type: 'customSkill', skillNameKey: 'skills.elocution', baseValue: 5, description: 'character.creation.skills.customSkills.elocution' },
    'listen'
  ],
  suggestedContacts: ['Office colleagues', 'Former university classmates', 'Friends or family in other companies'],
  recommendedCharacteristicsOrder: ['education', 'dexterity', 'intelligence', 'appearance', 'constitution', 'power', 'size', 'strength']
};
