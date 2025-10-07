import { Occupation } from './occupation.types';

/**
 * Researcher occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/chercheur/
 * Verified: 2025-01-07
 */
export const researcher: Occupation = {
    id: 'researcher',
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
      'libraryUse',
      'history',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'spotHidden',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 3, description: 'character.creation.skills.anySkills.occupationDescription.researchFields' }
    ],
    suggestedContacts: ['Scholars and academics', 'Large corporations', 'Foreign governments'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'constitution', 'power', 'appearance', 'size', 'strength']
  };
