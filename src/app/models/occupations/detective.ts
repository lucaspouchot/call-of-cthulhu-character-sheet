import { Occupation } from './occupation.types';

/**
 * Detective occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/inspecteur/
 */
export const detective: Occupation = {
    id: 'detective',
    creditRating: { min: 20, max: 50 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }, { attribute: 'strength', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftActing'] },
      'firearms',
      'law',
      'listen',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 1, options: ['charm', 'fastTalk', 'intimidate', 'persuade'] },
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Law enforcement', 'Street contacts', 'Organized crime', 'Legal system'],
    recommendedCharacteristicsOrder: ['intelligence', 'education', 'dexterity', 'strength', 'constitution', 'power', 'appearance', 'size']
  };
