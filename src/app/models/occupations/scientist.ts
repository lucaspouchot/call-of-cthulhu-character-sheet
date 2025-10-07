import { Occupation } from './occupation.types';

/**
 * Scientist occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/scientifique/
 */
export const scientist: Occupation = {
    id: 'scientist',
    creditRating: { min: 9, max: 50 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'choice', count: 1, options: ['computerUse', 'libraryUse'] },
      'ownLanguage',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'spotHidden',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'specialization', baseSkillId: 'science', allowCustom: true },
      { type: 'specialization', baseSkillId: 'science', allowCustom: true },
      { type: 'specialization', baseSkillId: 'science', allowCustom: true }
    ],
    suggestedContacts: ['Other scientists', 'Professors', 'Universities', 'Current and former employers'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'constitution', 'power', 'appearance', 'strength', 'size']
  };
