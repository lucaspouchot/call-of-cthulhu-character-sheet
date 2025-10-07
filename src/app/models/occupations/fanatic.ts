import { Occupation } from './occupation.types';

/**
 * Fanatic occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/fanatique/
 */
export const fanatic: Occupation = {
    id: 'fanatic',
    creditRating: { min: 0, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'appearance', multiplier: 2 },
        { attribute: 'power', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'stealth',
      'history',
      'psychology',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 3 }
    ],
    suggestedContacts: ['Religious or community groups', 'Media contacts'],
    recommendedCharacteristicsOrder: ['power', 'education', 'appearance', 'intelligence', 'constitution', 'dexterity', 'strength', 'size']
  };
