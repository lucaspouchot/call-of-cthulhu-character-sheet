import { Occupation } from './occupation.types';

/**
 * Tribal occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/sauvage/
 */
export const tribal: Occupation = {
    id: 'tribal',
    creditRating: { min: 0, max: 15 },
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
      { type: 'choice', count: 1, options: ['fighting', 'throw'] },
      'listen',
      'climb',
      'swim',
      'naturalWorld',
      'occult',
      { type: 'specialization', baseSkillId: 'survival', allowCustom: true },
      'spotHidden'
    ],
    suggestedContacts: ['Tribe members', 'Spiritual guides', 'Shamans', 'Allied tribes'],
    recommendedCharacteristicsOrder: ['strength', 'dexterity', 'constitution', 'power', 'size', 'intelligence', 'education', 'appearance']
  };
