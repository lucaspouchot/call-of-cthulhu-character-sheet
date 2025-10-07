import { Occupation } from './occupation.types';

/**
 * Lawyer occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/avocat/
 * Verified: 2025-10-07
 */
export const lawyer: Occupation = {
  id: 'lawyer',
  creditRating: { min: 30, max: 80 },
  occupationSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'education', multiplier: 4 }]
  },
  personalSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'intelligence', multiplier: 2 }]
  },
  occupationSkills: [
    'libraryUse',
    'accounting',
    'law',
    'psychology',
    { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
    { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['Legal community', 'Clients', 'Police', 'Judges'],
  recommendedCharacteristicsOrder: ['education', 'intelligence', 'appearance', 'power', 'constitution', 'dexterity', 'size', 'strength']
};
