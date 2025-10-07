import { Occupation } from './occupation.types';

/**
 * IndependentCriminal occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/criminel-independant/
 */
export const independentCriminal: Occupation = {
    id: 'independentCriminal',
    creditRating: { min: 5, max: 65 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'dexterity', multiplier: 2 },
        { attribute: 'appearance', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      {
        type: 'mixedChoice',
        count: 1,
        options: [
          { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftActing'] },
          'disguise'
        ]
      },
      { type: 'choice', count: 1, options: ['fightingBrawl', 'firearmsHandgun'] },
      { type: 'choice', count: 1, options: ['locksmith', 'mechanicalRepair'] },
      'stealth',
      'appraise',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Other criminals', 'Local police'],
    recommendedCharacteristicsOrder: ['dexterity', 'appearance', 'education', 'intelligence', 'strength', 'constitution', 'power', 'size']
  };
