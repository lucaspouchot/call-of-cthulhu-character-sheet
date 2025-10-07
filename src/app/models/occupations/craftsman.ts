import { Occupation } from './occupation.types';

/**
 * Craftsman occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/artisan/
 */
export const craftsman: Occupation = {
    id: 'craftsman',
    creditRating: { min: 10, max: 40 },
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
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
      'accounting',
      'appraise',
      'electricalRepair',
      'mechanicalRepair',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Customers', 'Suppliers', 'Trade associations'],
    recommendedCharacteristicsOrder: ['dexterity', 'education', 'intelligence', 'strength', 'constitution', 'power', 'appearance', 'size']
  };
