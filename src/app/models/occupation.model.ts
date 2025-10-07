type CharacteristicValue = 'strength' | 'constitution' | 'dexterity' | 'appearance' | 'size' | 'intelligence' | 'power' | 'education';

// Occupation skill specification
export type OccupationSkillSpec =
  | string // Simple skill ID
  | {
    type: 'choice';
    count: number; // Number of skills to choose
    options: string[]; // List of skill IDs to choose from
  }
  | {
    type: 'specialization';
    baseSkillId: string; // The base skill that requires specialization (e.g., 'artCraft')
    suggestedSpecializations?: string[]; // Optional suggested specializations
    allowCustom: boolean; // Allow custom specialization names
  }
  | {
    type: 'any';
    count: number; // Number of any skills the player can choose
    description?: string; // Optional description (e.g., "personal specialties or era-appropriate")
  };

// Common occupations with skill bonuses
export interface SkillPointFormula {
  type: 'simple' | 'choice' | 'composite'; // simple: single formula, choice: choose best of multiple, composite: required + choice
  formulas: {
    attribute: CharacteristicValue;
    multiplier: number; // multiplier (e.g., 4 for "EDU × 4")
  }[];
  // For composite type: additional choice formulas
  choiceFormulas?: {
    attribute: CharacteristicValue;
    multiplier: number;
  }[];
}

export interface Occupation {
  id: string;
  creditRating: { min: number; max: number };
  occupationSkillPoints: SkillPointFormula;
  personalSkillPoints: SkillPointFormula;
  occupationSkills: OccupationSkillSpec[]; // Updated to support choices and specializations
  suggestedContacts: string[];
  recommendedCharacteristicsOrder: CharacteristicValue[];
}

export const OCCUPATIONS: Occupation[] = [
  {
    id: 'antiquarian',
    creditRating: { min: 30, max: 70 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'appraise',
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
      'history',
      'libraryUse',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'navigate',
      'occult',
      'spotHidden'
    ],
    suggestedContacts: ['Auction houses', 'Dealers', 'Historians', 'Museums'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'appearance', 'constitution', 'size', 'power', 'strength']
  },
  {
    id: 'doctor',
    creditRating: { min: 60, max: 90 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'firstAid',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'medicine',
      'psychology',
      { type: 'specialization', baseSkillId: 'science', allowCustom: true, suggestedSpecializations: ['scienceBiology', 'scienceChemistry', 'sciencePharmacy'] },
      { type: 'specialization', baseSkillId: 'science', allowCustom: true, suggestedSpecializations: ['scienceBiology', 'scienceChemistry', 'sciencePharmacy'] }
    ],
    suggestedContacts: ['Hospitals', 'Nurses', 'Patients', 'Medical suppliers'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'constitution', 'appearance', 'size', 'power', 'strength']
  },
  {
    id: 'privateInvestigator',
    creditRating: { min: 9, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [
        { attribute: 'education', multiplier: 2 }
      ],
      choiceFormulas: [
        { attribute: 'dexterity', multiplier: 2 },
        { attribute: 'strength', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true, suggestedSpecializations: ['artCraftPhotography', 'artCraftForgery'] },
      'disguise',
      'law',
      'libraryUse',
      'listen',
      'locksmith',
      'psychology',
      'spotHidden',
      'stealth'
    ],
    suggestedContacts: ['Police', 'Criminals', 'Clients', 'Informants'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'appearance', 'power', 'constitution', 'size', 'strength']
  },
  {
    id: 'journalist',
    creditRating: { min: 9, max: 30 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true, suggestedSpecializations: ['artCraftWriting', 'artCraftPhotography'] },
      'libraryUse',
      'history',
      'languageOwn',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'listen',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Publishers', 'Editors', 'Sources', 'Government officials'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'appearance', 'power', 'constitution', 'size', 'strength']
  }
];