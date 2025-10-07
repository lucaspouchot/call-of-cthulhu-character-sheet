import { Occupation } from './occupation.types';

/**
 * Cowboy occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/cow-boy/
 */
export const cowboy: Occupation = {
    id: 'cowboy',
    creditRating: { min: 9, max: 20 },
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
      { type: 'choice', count: 1, options: ['fightingBrawl', 'firearmsHandgun'] },
      'ride',
      'dodge',
      'throw',
      'track',
      { type: 'choice', count: 1, options: ['firstAid', 'naturalWorld'] },
      'jump',
      { type: 'specialization', baseSkillId: 'survival', allowCustom: true }
    ],
    suggestedContacts: ['Cattle dealers', 'Federal Agriculture Agency', 'Rodeo and show organizers'],
    recommendedCharacteristicsOrder: ['dexterity', 'strength', 'constitution', 'education', 'intelligence', 'power', 'size', 'appearance']
  };
