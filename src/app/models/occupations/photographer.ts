import { Occupation } from './occupation.types';

/**
 * Photographer occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/photographe/
 * Verified: 2025-10-07
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
    'stealth',
    'psychology',
    { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceChemistry'] },
    'spotHidden',
    { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
    { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['Clients', 'Advertising agencies', 'Newspapers'],
  recommendedCharacteristicsOrder: ['education', 'dexterity', 'appearance', 'intelligence', 'power', 'constitution', 'strength', 'size']
};
