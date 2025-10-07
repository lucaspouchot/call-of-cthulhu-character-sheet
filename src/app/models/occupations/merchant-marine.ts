import { Occupation } from './occupation.types';

/**
 * MerchantMarine occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/marine-marchande/
 * Verified: 2025-01-07
 */
export const merchantMarine: Occupation = {
    id: 'merchantMarine',
    creditRating: { min: 20, max: 40 },
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
      'mechanicalRepair',
      'swim',
      'naturalWorld',
      'navigate',
      'pilotBoat',
      'firstAid',
      'spotHidden',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Coast guard', 'Smugglers', 'Organized crime'],
    recommendedCharacteristicsOrder: ['education', 'strength', 'dexterity', 'intelligence', 'constitution', 'power', 'appearance', 'size']
  };
