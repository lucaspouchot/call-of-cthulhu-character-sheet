import { Occupation } from './occupation.types';

/**
 * Fence occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/receleur/
 */
export const fence: Occupation = {
    id: 'fence',
    creditRating: { min: 20, max: 40 },
    occupationSkillPoints: {
      type: 'cumulative',
      formulas: [{ attribute: 'education', multiplier: 2 }, { attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftForging'] },
      'libraryUse',
      'accounting',
      'appraise',
      'history',
      'spotHidden',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Organized crime', 'Business associates', 'Potential buyers', 'Black market'],
    recommendedCharacteristicsOrder: ['appearance', 'intelligence', 'education', 'dexterity', 'power', 'constitution', 'strength', 'size']
  };
