import { Occupation } from './occupation.types';

/**
 * Trafficker occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/trafiquant/
 * Verified: 2025-01-07
 */
export const trafficker: Occupation = {
    id: 'trafficker',
    creditRating: { min: 5, max: 30 },
        occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'dexterity', multiplier: 2 },
        { attribute: 'strength', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'firearms',
      'fighting',
      'drive',
      'stealth',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Organized crime', 'Local police', 'Local merchants'],
    recommendedCharacteristicsOrder: ['strength', 'dexterity', 'constitution', 'intelligence', 'power', 'appearance', 'education', 'size']
  };
