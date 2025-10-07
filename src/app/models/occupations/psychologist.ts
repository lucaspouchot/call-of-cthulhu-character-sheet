import { Occupation } from './occupation.types';

/**
 * Psychologist occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/psychologue/
 */
export const psychologist: Occupation = {
    id: 'psychologist',
    creditRating: { min: 10, max: 40 },
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
      'listen',
      'persuade',
      'psychoanalysis',
      'psychology',
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Other psychologists', 'Patients', 'University researchers'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'strength', 'size']
  };
