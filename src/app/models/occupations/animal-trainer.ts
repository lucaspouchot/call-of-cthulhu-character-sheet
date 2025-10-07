import { Occupation } from './occupation.types';

/**
 * AnimalTrainer occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/dresseur/
 * Verified: 2025-10-07
 */
export const animalTrainer: Occupation = {
  id: 'animalTrainer',
  creditRating: { min: 10, max: 40 },
  occupationSkillPoints: {
    type: 'composite',
    formulas: [{ attribute: 'education', multiplier: 2 }],
    choiceFormulas: [
      { attribute: 'appearance', multiplier: 2 },
      { attribute: 'power', multiplier: 2 }
    ]
  },
  personalSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'intelligence', multiplier: 2 }]
  },
  occupationSkills: [
    'stealth',
    'listen',
    'naturalWorld',
    'track',
    'psychology',
    'jump',
    { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceZoology'] },
    { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['Zoo directors', 'Circus people', 'Clients', 'Actors'],
  recommendedCharacteristicsOrder: ['education', 'appearance', 'power', 'intelligence', 'constitution', 'dexterity', 'strength', 'size']
};
