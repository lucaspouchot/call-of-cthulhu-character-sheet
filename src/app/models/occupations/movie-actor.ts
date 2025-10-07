import { Occupation } from './occupation.types';

/**
 * MovieActor occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/acteur-de-cinema/
 */
export const movieActor: Occupation = {
    id: 'movieActor',
    creditRating: { min: 20, max: 90 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftActing'] },
      'driveAuto',
      'disguise',
      'psychology',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Film industry', 'Studio directors', 'Critics', 'Screenwriters'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'intelligence', 'dexterity', 'constitution', 'power', 'size', 'strength']
  };
