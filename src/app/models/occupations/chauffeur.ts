import { Occupation } from './occupation.types';

/**
 * Chauffeur occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/chauffeur/
 */
export const chauffeur: Occupation = {
    id: 'chauffeur',
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
      'driveAuto',
      'listen',
      'mechanicalRepair',
      'navigate',
      'spotHidden',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Prosperous businesspeople', 'Politicians'],
    recommendedCharacteristicsOrder: ['dexterity', 'education', 'intelligence', 'constitution', 'power', 'appearance', 'size', 'strength']
  };
