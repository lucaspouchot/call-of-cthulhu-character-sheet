import { Occupation } from './occupation.types';

/**
 * InvestigativeJournalist occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/journaliste-dinvestigation/
 */
export const investigativeJournalist: Occupation = {
    id: 'investigativeJournalist',
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
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftFineArt', 'artCraftPhotography'] },
      'libraryUse',
      'history',
      'psychology',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 3 }
    ],
    suggestedContacts: ['Media circles', 'Politicians', 'Local police', 'Low-level criminals'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'size', 'strength']
  };
