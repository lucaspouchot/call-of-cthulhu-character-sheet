import { Occupation } from './occupation.types';

/**
 * InvestigativeJournalist occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/journaliste-dinvestigation/
 * Verified: 2025-10-07
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
    {
      type: 'mixedChoice', count: 1, options: [
        { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftFineArt'] },
        { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftPhotography'] }
      ]
    },
    'libraryUse',
    'history',
    'languageOwn',
    'psychology',
    { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
    { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['Media circles', 'Politicians', 'Local police', 'Low-level criminals'],
  recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'size', 'strength']
};
