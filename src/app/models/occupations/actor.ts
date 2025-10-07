import { Occupation } from './occupation.types';

/**
 * Actor occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/comedien/
 * Verified: 2025-10-07
 */
export const actor: Occupation = {
  id: 'actor',
  creditRating: { min: 10, max: 60 },
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
    { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftActing'] },
    { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftDance'] },
    'persuade',
    'psychology',
    { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
    { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['Actors and actresses', 'Theater directors', 'Film studios'],
  recommendedCharacteristicsOrder: ['appearance', 'education', 'dexterity', 'intelligence', 'power', 'constitution', 'size', 'strength']
};
