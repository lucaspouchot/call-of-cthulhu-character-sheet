import { Occupation } from './occupation.types';

/**
 * PriestMonk occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/religieux/
 */
export const priestMonk: Occupation = {
    id: 'priestMonk',
    creditRating: { min: 9, max: 60 },
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
      'accounting',
      'listen',
      'history',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'psychology',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Church hierarchy', 'Parishioners', 'Influential church members'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'strength', 'size']
  };
