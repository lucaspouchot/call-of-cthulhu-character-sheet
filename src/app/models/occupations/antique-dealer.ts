import { Occupation } from './occupation.types';

/**
 * AntiqueDealer occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/marchand-dantiquites/
 */
export const antiqueDealer: Occupation = {
    id: 'antiqueDealer',
    creditRating: { min: 30, max: 50 },
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
      'driveAuto',
      'appraise',
      'history',
      'navigate',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Local historians', 'Other antique dealers', 'Fences'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'appearance', 'power', 'constitution', 'dexterity', 'size', 'strength']
  };
