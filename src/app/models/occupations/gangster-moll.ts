import { Occupation } from './occupation.types';

/**
 * GangsterMoll occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/frangine/
 */
export const gangsterMoll: Occupation = {
    id: 'gangsterMoll',
    creditRating: { min: 10, max: 80 },
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
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
      { type: 'choice', count: 1, options: ['fightingBrawl', 'firearmsHandgun'] },
      'driveAuto',
      'stealth',
      'listen',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Gangsters', 'Police', 'Luxury merchants'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'dexterity', 'intelligence', 'constitution', 'power', 'size', 'strength']
  };
