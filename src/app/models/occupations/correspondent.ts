import { Occupation } from './occupation.types';

/**
 * Correspondent occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/correspondant/
 */
export const correspondent: Occupation = {
    id: 'correspondent',
    creditRating: { min: 10, max: 40 },
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
      'history',
      'languageOwn',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'psychology',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['National or international media', 'Foreign governments', 'Military'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'appearance', 'dexterity', 'power', 'constitution', 'size', 'strength']
  };
