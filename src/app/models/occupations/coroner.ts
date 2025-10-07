import { Occupation } from './occupation.types';

/**
 * Coroner occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/medecin-legiste/
 * Verified: 2025-10-07
 */
export const coroner: Occupation = {
  id: 'coroner',
  creditRating: { min: 40, max: 60 },
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
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: false, suggestedSpecializations: ['languageLatin'] },
    'medicine',
    'persuade',
    { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceBiology'] },
    { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceForensics'] },
    { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['sciencePharmacy'] },
    'spotHidden'
  ],
  suggestedContacts: ['Lab workers', 'Police', 'Hospital staff'],
  recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'dexterity', 'constitution', 'appearance', 'strength', 'size']
};
