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
    type: 'customSkill';
    skillNameKey: string; // Translation key for the custom skill name (e.g., "skills.humanResources", "skills.elocution")
    baseValue: number; // Base value for this skill (e.g., 5, 20, etc.)
    description?: string; // Optional description of what this skill does
  }
  | {
    type: 'any';
    count: number; // Number of any skills the player can choose
    description?: string; // Optional description (e.g., "personal specialties or era-appropriate")
  }
  | {
    type: 'mixedChoice';
    count: number; // Number of skills to choose (usually 1)
    options: Array<
      | string // Simple skill ID
      | { type: 'specialization'; baseSkillId: string; suggestedSpecializations?: string[]; allowCustom: boolean }
    >; // Mix of simple skills and specializations to choose from
  };

// Common occupations with skill bonuses
export interface SkillPointFormula {
  type: 'simple' | 'choice' | 'composite' | 'cumulative';
  // simple: single formula
  // choice: choose best of multiple formulas
  // composite: required formula + choice of additional formulas (formulas[0] + choice from choiceFormulas)
  // cumulative: sum of all formulas (formula1 + formula2 + ...)
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
