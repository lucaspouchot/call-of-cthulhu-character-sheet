import { Occupation } from './occupation.types';

/**
 * Orderly occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/aide-soignant/
 * Verified: 2025-01-07
 */
export const orderly: Occupation = {
    id: 'orderly',
    creditRating: { min: 6, max: 15 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'strength', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'fightingBrawl',
      'stealth',
      'listen',
      'electricalRepair',
      'mechanicalRepair',
      'firstAid',
      'psychology',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Hospital staff', 'Patients', 'Privileged access'],
    recommendedCharacteristicsOrder: ['strength', 'constitution', 'education', 'dexterity', 'intelligence', 'power', 'appearance', 'size']
  };
