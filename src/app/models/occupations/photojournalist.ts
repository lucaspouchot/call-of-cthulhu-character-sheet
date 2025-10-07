import { Occupation } from './occupation.types';

/**
 * Photojournalist occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/photojournaliste/
 * Verified: 2025-01-07
 */
export const photojournalist: Occupation = {
    id: 'photojournalist',
    creditRating: { min: 10, max: 30 },
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
      'stealth',
      'spotHidden',
      { type: 'choice', count: 1, options: ['languageOther', 'ownLanguage'] },
      { type: 'any', count: 3 }
    ],
    suggestedContacts: ['Newspapers', 'Press agencies', 'Magazines'],
    recommendedCharacteristicsOrder: ['education', 'dexterity', 'intelligence', 'constitution', 'power', 'appearance', 'strength', 'size']
  };
