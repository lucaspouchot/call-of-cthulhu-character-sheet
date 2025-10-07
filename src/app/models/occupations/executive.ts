import { Occupation } from './occupation.types';

/**
 * Executive occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/cadre/
 * Verified: 2025-10-07
 */
export const executive: Occupation = {
  id: 'executive',
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
    { type: 'choice', count: 1, options: ['libraryUse', 'computerUse'] },
    'accounting',
    'law',
    'listen',
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
    { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['Management colleagues', 'Business lawyers', 'External consultants'],
  recommendedCharacteristicsOrder: ['education', 'intelligence', 'appearance', 'power', 'constitution', 'dexterity', 'size', 'strength']
};
