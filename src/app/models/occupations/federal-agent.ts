import { Occupation } from './occupation.types';

/**
 * FederalAgent occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/agent-federal/
 * Verified: 2025-01-07
 */
export const federalAgent: Occupation = {
  id: 'federalAgent',
  creditRating: { min: 20, max: 40 },
  occupationSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'education', multiplier: 4 }]
  },
  personalSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'intelligence', multiplier: 2 }]
  },
  occupationSkills: [
    'firearmsHandgun',
    'fightingBrawl',
    'driveAuto',
    'stealth',
    'law',
    'persuade',
    'spotHidden',
    { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['Federal agencies', 'Police', 'Organized crime'],
  recommendedCharacteristicsOrder: ['education', 'strength', 'dexterity', 'constitution', 'intelligence', 'power', 'appearance', 'size']
};
