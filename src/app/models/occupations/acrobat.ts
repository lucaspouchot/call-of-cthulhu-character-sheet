import { Occupation } from './occupation.types';

/**
 * Acrobat occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/acrobate/
 * Verified: 2025-10-07
 */
export const acrobat: Occupation = {
  id: 'acrobat',
  creditRating: { min: 9, max: 20 },
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
    'dodge',
    'climb',
    'throw',
    'swim',
    'jump',
    'spotHidden',
    { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['Amateur athletic clubs', 'Sports journalists', 'Circuses and carnivals'],
  recommendedCharacteristicsOrder: ['dexterity', 'strength', 'constitution', 'education', 'intelligence', 'power', 'appearance', 'size']
};
