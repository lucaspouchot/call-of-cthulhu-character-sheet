import { Occupation } from './occupation.types';

/**
 * Archaeologist occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/archeologue/
 */
export const archaeologist: Occupation = {
    id: 'archaeologist',
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
      'archaeology',
      'libraryUse',
      'appraise',
      'history',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'mechanicalRepair',
      { type: 'choice', count: 1, options: ['navigate', 'scienceChemistry', 'sciencePhysics', 'scienceGeology'] },
      'spotHidden'
    ],
    suggestedContacts: ['Clients', 'Museums', 'Universities'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'strength', 'constitution', 'power', 'appearance', 'size']
  };
