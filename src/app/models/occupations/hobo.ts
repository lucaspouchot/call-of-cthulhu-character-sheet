import { Occupation } from './occupation.types';

/**
 * Hobo occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/hobo/
 */
export const hobo: Occupation = {
    id: 'hobo',
    creditRating: { min: 0, max: 5 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'appearance', multiplier: 2 },
        { attribute: 'dexterity', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
      { type: 'choice', count: 1, options: ['locksmith', 'sleightOfHand'] },
      'stealth',
      'listen',
      'climb',
      'navigate',
      'jump',
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Other hobos', 'Charitable individuals', 'Shelter staff'],
    recommendedCharacteristicsOrder: ['dexterity', 'constitution', 'strength', 'education', 'intelligence', 'power', 'appearance', 'size']
  };
