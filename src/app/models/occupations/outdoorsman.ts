import { Occupation } from './occupation.types';

/**
 * Outdoorsman occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/baroudeur/
 */
export const outdoorsman: Occupation = {
    id: 'outdoorsman',
    creditRating: { min: 5, max: 20 },
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
      'climb',
      'firearmsRifle',
      'jump',
      'listen',
      'naturalWorld',
      'navigate',
      'spotHidden',
      { type: 'specialization', baseSkillId: 'survival', allowCustom: true }
    ],
    suggestedContacts: ['Hunters', 'Park rangers', 'Outdoor enthusiasts', 'Wildlife experts'],
    recommendedCharacteristicsOrder: ['dexterity', 'strength', 'constitution', 'intelligence', 'education', 'power', 'size', 'appearance']
  };
