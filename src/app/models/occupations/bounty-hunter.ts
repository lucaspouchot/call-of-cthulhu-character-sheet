import { Occupation } from './occupation.types';

/**
 * BountyHunter occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/chasseur-de-prime/
 * Verified: 2025-10-07
 */
export const bountyHunter: Occupation = {
  id: 'bountyHunter',
  creditRating: { min: 9, max: 30 },
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
    'driveAuto',
    'stealth',
    'law',
    { type: 'choice', count: 1, options: ['electronics', 'electricalRepair'] },
    'track',
    'psychology',
    { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
  ],
  suggestedContacts: ['Bail bondsmen', 'Local police', 'Informants'],
  recommendedCharacteristicsOrder: ['dexterity', 'strength', 'constitution', 'education', 'intelligence', 'power', 'size', 'appearance']
};
