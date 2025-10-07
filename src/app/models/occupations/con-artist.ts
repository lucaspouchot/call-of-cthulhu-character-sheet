import { Occupation } from './occupation.types';

/**
 * ConArtist occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/arnaqueur/
 * Verified: 2025-10-07
 */
export const conArtist: Occupation = {
  id: 'conArtist',
  creditRating: { min: 10, max: 65 },
  occupationSkillPoints: {
    type: 'cumulative',
    formulas: [
      { attribute: 'education', multiplier: 2 },
      { attribute: 'appearance', multiplier: 2 }
    ]
  },
  personalSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'intelligence', multiplier: 2 }]
  },
  occupationSkills: [
    { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftActing'] },
    { type: 'choice', count: 1, options: ['law', 'otherLanguage'] },
    'listen',
    'appraise',
    'sleightOfHand',
    'psychology',
    { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
  ],
  suggestedContacts: ['Fences', 'Other criminals', 'Law enforcement', 'Marks'],
  recommendedCharacteristicsOrder: ['appearance', 'education', 'intelligence', 'dexterity', 'power', 'constitution', 'size', 'strength']
};
