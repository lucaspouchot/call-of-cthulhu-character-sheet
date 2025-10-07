import { Occupation } from './occupation.types';

/**
 * TheaterActor occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/acteur-de-theatre/
 */
export const theaterActor: Occupation = {
    id: 'theaterActor',
    creditRating: { min: 9, max: 40 },
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
      'fightingBrawl',
      'history',
      'disguise',
      'psychology',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Theater community', 'Critics', 'Actors guild or union'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'intelligence', 'dexterity', 'constitution', 'power', 'size', 'strength']
  };
