import { Occupation } from './occupation.types';

/**
 * AgencyDetective occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/detective-dagence/
 */
export const agencyDetective: Occupation = {
    id: 'agencyDetective',
    creditRating: { min: 20, max: 45 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'strength', multiplier: 2 },
        { attribute: 'dexterity', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'libraryUse',
      'firearmsHandgun',
      'fightingBrawl',
      'stealth',
      'law',
      'track',
      'psychology',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Police', 'Clients'],
    recommendedCharacteristicsOrder: ['education', 'strength', 'dexterity', 'intelligence', 'constitution', 'power', 'size', 'appearance']
  };
