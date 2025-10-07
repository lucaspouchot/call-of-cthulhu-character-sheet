import { Occupation } from './occupation.types';

/**
 * Nurse occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/infirmier/
 * Verified: 2025-01-07
 */
export const nurse: Occupation = {
    id: 'nurse',
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
      'listen',
      'medicine',
      'firstAid',
      'psychology',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceBiology'] },
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Hospital staff', 'Doctors', 'Social workers'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'strength', 'size']
  };
