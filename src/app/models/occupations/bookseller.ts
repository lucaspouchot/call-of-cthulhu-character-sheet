import { Occupation } from './occupation.types';

/**
 * Bookseller occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/libraire/
 */
export const bookseller: Occupation = {
    id: 'bookseller',
    creditRating: { min: 20, max: 40 },
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
      'appraise',
      'driveAuto',
      'history',
      'libraryUse',
      'ownLanguage',
      'otherLanguage',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Bibliographers', 'Booksellers', 'Libraries', 'Universities', 'Clients'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'appearance', 'power', 'constitution', 'dexterity', 'size', 'strength']
  };
