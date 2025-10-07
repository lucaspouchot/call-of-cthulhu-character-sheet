import { Occupation } from './occupation.types';

/**
 * Prostitute occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/prostitue/
 * Verified: 2025-01-07
 */
export const prostitute: Occupation = {
    id: 'prostitute',
    creditRating: { min: 5, max: 50 },
    occupationSkillPoints: {
      type: 'cumulative',
      formulas: [{ attribute: 'education', multiplier: 2 }, { attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
      'stealth',
      'dodge',
      'sleightOfHand',
      'psychology',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Street people', 'Police', 'Organized crime', 'Regular clients'],
    recommendedCharacteristicsOrder: ['appearance', 'dexterity', 'constitution', 'intelligence', 'power', 'education', 'strength', 'size']
  };
