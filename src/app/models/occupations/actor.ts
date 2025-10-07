import { Occupation } from './occupation.types';

/**
 * Actor occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/comedien/
 */
export const actor: Occupation = {
    id: 'actor',
    creditRating: { min: 10, max: 60 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftActing'] },
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.dance' },
      'psychology',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Actors and actresses', 'Theater directors', 'Film studios'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'dexterity', 'intelligence', 'power', 'constitution', 'size', 'strength']
  };
