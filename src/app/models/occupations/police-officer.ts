import { Occupation } from './occupation.types';

/**
 * PoliceOfficer occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/policier/
 * Verified: 2025-01-07
 */
export const policeOfficer: Occupation = {
    id: 'policeOfficer',
    creditRating: { min: 9, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }, { attribute: 'strength', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'firearms',
      'fighting',
      { type: 'choice', count: 1, options: ['drive', 'ride'] },
      'law',
      'firstAid',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 1, options: ['charm', 'fastTalk', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Law enforcement', 'Street contacts', 'Organized crime'],
    recommendedCharacteristicsOrder: ['strength', 'dexterity', 'constitution', 'education', 'intelligence', 'power', 'size', 'appearance']
  };
