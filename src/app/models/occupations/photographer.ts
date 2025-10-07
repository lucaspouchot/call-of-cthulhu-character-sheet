import { Occupation } from './occupation.types';

/**
 * Photographer occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/photographe/
 */
export const photographer: Occupation = {
    id: 'photographer',
    creditRating: { min: 9, max: 30 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftPhotography'] },
      'charm',
      'psychology',
      'stealth',
      'spotHidden',
      { type: 'any', count: 3 }
    ],
    suggestedContacts: ['Clients', 'Advertising agencies', 'Newspapers'],
    recommendedCharacteristicsOrder: ['education', 'dexterity', 'appearance', 'intelligence', 'power', 'constitution', 'strength', 'size']
  };
