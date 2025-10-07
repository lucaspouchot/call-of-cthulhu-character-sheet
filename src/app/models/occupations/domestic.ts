import { Occupation } from './occupation.types';

/**
 * Domestic occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/domestique/
 * Verified: 2025-10-07
 */
export const domestic: Occupation = {
  id: 'domestic',
  creditRating: { min: 9, max: 40 },
  occupationSkillPoints: {
    type: 'cumulative',
    formulas: [
      { attribute: 'education', multiplier: 4 },
      { attribute: 'dexterity', multiplier: 2 }
    ]
  },
  personalSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'intelligence', multiplier: 2 }]
  },
  occupationSkills: [
    { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true, suggestedSpecializations: ['artCraftCooking', 'artCraftBarber'] },
    { type: 'choice', count: 1, options: ['accounting', 'appraise'] },
    'listen',
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    'firstAid',
    'psychology',
    'spotHidden',
    { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['Domestic staff from other households', 'Local suppliers', 'Local merchants'],
  recommendedCharacteristicsOrder: ['education', 'dexterity', 'intelligence', 'appearance', 'constitution', 'power', 'size', 'strength']
};
