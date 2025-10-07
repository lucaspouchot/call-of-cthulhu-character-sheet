import { Occupation } from './occupation.types';

/**
 * Entertainer occupation  
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/artiste/
 * Verified: 2025-10-07
 */
export const entertainer: Occupation = {
  id: 'entertainer',
  creditRating: { min: 9, max: 50 },
  occupationSkillPoints: {
    type: 'composite',
    formulas: [{ attribute: 'education', multiplier: 2 }],
    choiceFormulas: [
      { attribute: 'dexterity', multiplier: 2 },
      { attribute: 'power', multiplier: 2 }
    ]
  },
  personalSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'intelligence', multiplier: 2 }]
  },
  occupationSkills: [
    { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
    { type: 'choice', count: 1, options: ['history', 'naturalWorld'] },
    { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
    'psychology',
    'spotHidden',
    { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
    { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['Entertainment industry', 'Venues', 'Fans', 'Critics'],
  recommendedCharacteristicsOrder: ['appearance', 'education', 'dexterity', 'intelligence', 'power', 'constitution', 'size', 'strength']
};
