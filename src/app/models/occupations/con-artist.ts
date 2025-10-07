import { Occupation } from './occupation.types';

/**
 * ConArtist occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/arnaqueur/
 */
export const conArtist: Occupation = {
    id: 'conArtist',
    creditRating: { min: 10, max: 65 },
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
      'appraise',
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftForgery'] },
      'disguise',
      'law',
      'locksmith',
      'psychology',
      'sleightOfHand',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Fences', 'Other criminals', 'Law enforcement', 'Marks'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'intelligence', 'dexterity', 'power', 'constitution', 'size', 'strength']
  };
