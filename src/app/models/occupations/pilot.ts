import { Occupation } from './occupation.types';

/**
 * Pilot occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/pilote/
 * Verified: 2025-01-07
 */
export const pilot: Occupation = {
    id: 'pilot',
    creditRating: { min: 20, max: 70 },
    occupationSkillPoints: {
      type: 'cumulative',
      formulas: [
        { attribute: 'education', multiplier: 2 },
        { attribute: 'dexterity', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'pilot', allowCustom: true },
      'electricalRepair',
      'mechanicalRepair',
      'navigate',
      'spotHidden',
      { type: 'any', count: 3, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Airlines', 'Military', 'Airport staff'],
    recommendedCharacteristicsOrder: ['dexterity', 'education', 'intelligence', 'constitution', 'strength', 'power', 'appearance', 'size']
  };
