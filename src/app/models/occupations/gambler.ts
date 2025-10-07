import { Occupation } from './occupation.types';

/**
 * Gambler occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/joueur-professionnel/
 */
export const gambler: Occupation = {
    id: 'gambler',
    creditRating: { min: 8, max: 50 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'appearance', multiplier: 2 },
        { attribute: 'dexterity', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftActing'] },
      'accounting',
      'listen',
      'sleightOfHand',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Bookmakers', 'Organized crime', 'Ordinary people'],
    recommendedCharacteristicsOrder: ['appearance', 'dexterity', 'education', 'intelligence', 'power', 'constitution', 'size', 'strength']
  };
