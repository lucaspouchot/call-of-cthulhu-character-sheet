import { Occupation } from './occupation.types';

/**
 * Burglar occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/cambrioleur/
 */
export const burglar: Occupation = {
    id: 'burglar',
    creditRating: { min: 5, max: 40 },
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
      'locksmith',
      'stealth',
      'listen',
      { type: 'choice', count: 1, options: ['electricalRepair', 'mechanicalRepair'] },
      'appraise',
      'climb',
      'sleightOfHand',
      'spotHidden'
    ],
    suggestedContacts: ['Fences', 'Other burglars'],
    recommendedCharacteristicsOrder: ['dexterity', 'education', 'intelligence', 'strength', 'constitution', 'power', 'size', 'appearance']
  };
