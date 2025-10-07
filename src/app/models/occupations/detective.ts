import { Occupation } from './occupation.types';

/**
 * Detective occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/inspecteur/
 * Verified: 2025-10-07
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
    {
      type: 'mixedChoice', count: 1, options: [
        { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftActing'] },
        'disguise'
      ]
    },
    'firearmsHandgun',
    'law',
    'listen',
    'psychology',
    'spotHidden',
    { type: 'choice', count: 1, options: ['charm', 'fastTalk', 'intimidate', 'persuade'] },
    { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['Law enforcement', 'Street contacts', 'Organized crime', 'Legal system'],
  recommendedCharacteristicsOrder: ['intelligence', 'education', 'dexterity', 'strength', 'constitution', 'power', 'appearance', 'size']
};
