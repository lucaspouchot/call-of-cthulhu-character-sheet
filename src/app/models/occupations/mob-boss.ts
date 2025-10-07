import { Occupation } from './occupation.types';

/**
 * MobBoss occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/chef-mafieux/
 */
export const mobBoss: Occupation = {
    id: 'mobBoss',
    creditRating: { min: 60, max: 95 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'firearmsHandgun',
      'fightingBrawl',
      'law',
      'listen',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Organized crime', 'Street criminals', 'Corrupt police', 'Local politicians', 'Judges', 'Union leaders', 'Lawyers', 'Ethnic community members'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'intelligence', 'power', 'constitution', 'dexterity', 'strength', 'size']
  };
