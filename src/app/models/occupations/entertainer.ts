import { Occupation } from './occupation.types';

/**
 * Entertainer occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/artiste-scenique/
 */
export const entertainer: Occupation = {
    id: 'entertainer',
    creditRating: { min: 9, max: 70 },
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
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true, suggestedSpecializations: ['artCraftActing', 'artCraftSinging', 'artCraftComedy'] },
      'disguise',
      'listen',
      'psychology',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Entertainment industry', 'Venues', 'Fans', 'Critics'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'dexterity', 'intelligence', 'power', 'constitution', 'size', 'strength']
  };
