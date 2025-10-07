import { Occupation } from './occupation.types';

/**
 * Alienist occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/alieniste/
 */
export const alienist: Occupation = {
    id: 'alienist',
    creditRating: { min: 10, max: 60 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'law',
      'listen',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'medicine',
      'psychoanalysis',
      'psychology',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceBiology'] },
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceChemistry'] }
    ],
    suggestedContacts: ['Other mental illness specialists', 'Physicians', 'Police detectives'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'size', 'strength']
  };
