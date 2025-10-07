import { Occupation } from './occupation.types';

/**
 * Aviator occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/aviateur/
 */
export const aviator: Occupation = {
    id: 'aviator',
    creditRating: { min: 30, max: 60 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'pilot', allowCustom: false, suggestedSpecializations: ['pilotAircraft'] },
      'electricalRepair',
      'mechanicalRepair',
      'navigate',
      'listen',
      'spotHidden',
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Airlines', 'Military', 'Aviation clubs', 'Aircraft manufacturers'],
    recommendedCharacteristicsOrder: ['education', 'dexterity', 'intelligence', 'constitution', 'power', 'strength', 'appearance', 'size']
  };
