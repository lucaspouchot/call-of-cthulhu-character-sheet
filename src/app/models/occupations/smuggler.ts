import { Occupation } from './occupation.types';

/**
 * Smuggler occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/contrebandier/
 */
export const smuggler: Occupation = {
    id: 'smuggler',
    creditRating: { min: 20, max: 60 },
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
      'firearmsHandgun',
      { type: 'choice', count: 1, options: ['driveAuto', 'pilotAircraft', 'pilotBoat'] },
      'listen',
      'navigate',
      'sleightOfHand',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Organized crime', 'Coast guard', 'Customs agents'],
    recommendedCharacteristicsOrder: ['appearance', 'dexterity', 'education', 'intelligence', 'constitution', 'power', 'size', 'strength']
  };
