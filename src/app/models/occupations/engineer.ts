import { Occupation } from './occupation.types';

/**
 * Engineer occupation
 * Source: https://appeldecthulhu.fr/jeu-de-role/profession/ingenieur/
 * Verified: 2025-10-07
 */
export const engineer: Occupation = {
  id: 'engineer',
  creditRating: { min: 30, max: 60 },
  occupationSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'education', multiplier: 4 }]
  },
  personalSkillPoints: {
    type: 'simple',
    formulas: [{ attribute: 'intelligence', multiplier: 2 }]
  },
  occupationSkills: [
    { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftTechnicalDrawing'] },
    'libraryUse',
    'operateHeavyMachinery',
    'electricalRepair',
    'mechanicalRepair',
    { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceEngineering'] },
    { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['sciencePhysics'] },
    { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
  ],
  suggestedContacts: ['Civil or military workers', 'Local bureaucrats', 'Architects'],
  recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'constitution', 'power', 'strength', 'size', 'appearance']
};
