import { Occupation } from './occupation.types';

/**
 * Accountant occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/comptable/
 */
export const accountant: Occupation = {
    id: 'accountant',
    creditRating: { min: 30, max: 70 },
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
      'listen',
      'persuade',
      'spotHidden',
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Clients', 'Business lawyers', 'Financial sector'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'appearance', 'power', 'constitution', 'size', 'strength']
  };
