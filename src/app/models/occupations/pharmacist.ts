import { Occupation } from './occupation.types';

/**
 * Pharmacist occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/pharmacien/
 */
export const pharmacist: Occupation = {
    id: 'pharmacist',
    creditRating: { min: 35, max: 75 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'accounting',
      'firstAid',
      'libraryUse',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: false, suggestedSpecializations: ['languageLatin'] },
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceChemistry'] },
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['sciencePharmacy'] },
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Doctors', 'Patients', 'Drug manufacturers'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'constitution', 'power', 'appearance', 'strength', 'size']
  };
