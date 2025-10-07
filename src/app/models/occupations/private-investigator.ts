import { Occupation } from './occupation.types';

/**
 * PrivateInvestigator occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/detective-prive/
 */
export const privateInvestigator: Occupation = {
    id: 'privateInvestigator',
    creditRating: { min: 9, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'dexterity', multiplier: 2 },
        { attribute: 'strength', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftPhotography'] },
      'libraryUse',
      'law',
      'disguise',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Police', 'Clients'],
    recommendedCharacteristicsOrder: ['education', 'dexterity', 'intelligence', 'strength', 'constitution', 'power', 'size', 'appearance']
  };
