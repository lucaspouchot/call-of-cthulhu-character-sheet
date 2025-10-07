import { Occupation } from './occupation.types';

/**
 * Doctor occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/medecin/
 */
export const doctor: Occupation = {
    id: 'doctor',
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
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: false, suggestedSpecializations: ['languageLatin'] },
      'medicine',
      'firstAid',
      'psychology',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceBiology'] },
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['sciencePharmacy'] },
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Other doctors', 'Hospital staff', 'Patients and former patients'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'dexterity', 'constitution', 'appearance', 'strength', 'size']
  };
