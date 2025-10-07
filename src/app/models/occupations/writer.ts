import { Occupation } from './occupation.types';

/**
 * Writer occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/ecrivain/
 * Verified: 2025-01-07
 */
export const writer: Occupation = {
  id: 'writer',
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
    { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftWriting'] },
    'libraryUse',
    'history',
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    { type: 'choice', count: 1, options: ['naturalWorld', 'occult'] },
    'psychology',
    { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['Publishing houses', 'Literary critics', 'Historians', 'Other writers'],
  recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'size', 'strength']
};
