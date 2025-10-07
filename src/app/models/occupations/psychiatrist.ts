import { Occupation } from './occupation.types';

/**
 * Psychiatrist occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/psychiatre/
 * Verified: 2025-10-07
 */
export const psychiatrist: Occupation = {
  id: 'psychiatrist',
  creditRating: { min: 30, max: 80 },
  occupationSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'education', multiplier: 4 }]
  },
  personalSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'intelligence', multiplier: 2 }]
  },
  occupationSkills: [
    'listen',
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    'medicine',
    'persuade',
    'psychoanalysis',
    'psychology',
    { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceBiology'] },
    { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceChemistry'] }
  ],
  suggestedContacts: ['Mental health specialists', 'Doctors', 'Police detectives'],
  recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'strength', 'size']
};
