import { Skill } from './character.model';

// Standard Call of Cthulhu skills with base values
export const DEFAULT_SKILLS: Skill[] = [
  // Communication Skills
  { id: 'charm', baseValue: 15, personalValue: 0, occupationValue: 0, totalValue: 15 },
  { id: 'fastTalk', baseValue: 5, personalValue: 0, occupationValue: 0, totalValue: 5 },
  { id: 'intimidate', baseValue: 15, personalValue: 0, occupationValue: 0, totalValue: 15 },
  { id: 'persuade', baseValue: 10, personalValue: 0, occupationValue: 0, totalValue: 10 },

  // Interpersonal Skills
  { id: 'animalHandling', baseValue: 5, personalValue: 0, occupationValue: 0, totalValue: 5 },
  { id: 'psychology', baseValue: 10, personalValue: 0, occupationValue: 0, totalValue: 10 },
  { id: 'psychoanalysis', baseValue: 1, personalValue: 0, occupationValue: 0, totalValue: 1 },

  // Physical Skills
  { id: 'climb', baseValue: 20, personalValue: 0, occupationValue: 0, totalValue: 20 },
  { id: 'dodge', baseValue: 0, personalValue: 0, occupationValue: 0, totalValue: 0 }, // Half DEX
  { id: 'fightingBrawl', baseValue: 25, personalValue: 0, occupationValue: 0, totalValue: 25 },
  { id: 'firearmsHandgun', baseValue: 20, personalValue: 0, occupationValue: 0, totalValue: 20 },
  { id: 'firearmsRifle', baseValue: 25, personalValue: 0, occupationValue: 0, totalValue: 25 },
  { id: 'jump', baseValue: 20, personalValue: 0, occupationValue: 0, totalValue: 20 },
  { id: 'ride', baseValue: 5, personalValue: 0, occupationValue: 0, totalValue: 5 },
  { id: 'stealth', baseValue: 20, personalValue: 0, occupationValue: 0, totalValue: 20 },
  { id: 'swim', baseValue: 20, personalValue: 0, occupationValue: 0, totalValue: 20 },
  { id: 'throw', baseValue: 20, personalValue: 0, occupationValue: 0, totalValue: 20 },

  // Mental Skills
  { id: 'accounting', baseValue: 5, personalValue: 0, occupationValue: 0, totalValue: 5 },
  { id: 'anthropology', baseValue: 1, personalValue: 0, occupationValue: 0, totalValue: 1 },
  { id: 'appraise', baseValue: 5, personalValue: 0, occupationValue: 0, totalValue: 5 },
  { id: 'archaeology', baseValue: 1, personalValue: 0, occupationValue: 0, totalValue: 1 },
  { id: 'artCraft', baseValue: 5, personalValue: 0, occupationValue: 0, totalValue: 5 },
  { id: 'computerUse', baseValue: 5, personalValue: 0, occupationValue: 0, totalValue: 5 },
  { id: 'creditRating', baseValue: 0, personalValue: 0, occupationValue: 0, totalValue: 0 },
  { id: 'disguise', baseValue: 5, personalValue: 0, occupationValue: 0, totalValue: 5 },
  { id: 'driveAuto', baseValue: 20, personalValue: 0, occupationValue: 0, totalValue: 20 },
  { id: 'electricalRepair', baseValue: 10, personalValue: 0, occupationValue: 0, totalValue: 10 },
  { id: 'electronics', baseValue: 1, personalValue: 0, occupationValue: 0, totalValue: 1 },
  { id: 'firstAid', baseValue: 30, personalValue: 0, occupationValue: 0, totalValue: 30 },
  { id: 'history', baseValue: 5, personalValue: 0, occupationValue: 0, totalValue: 5 },
  { id: 'law', baseValue: 5, personalValue: 0, occupationValue: 0, totalValue: 5 },
  { id: 'libraryUse', baseValue: 20, personalValue: 0, occupationValue: 0, totalValue: 20 },
  { id: 'listen', baseValue: 20, personalValue: 0, occupationValue: 0, totalValue: 20 },
  { id: 'locksmith', baseValue: 1, personalValue: 0, occupationValue: 0, totalValue: 1 },
  { id: 'mechanicalRepair', baseValue: 10, personalValue: 0, occupationValue: 0, totalValue: 10 },
  { id: 'medicine', baseValue: 1, personalValue: 0, occupationValue: 0, totalValue: 1 },
  { id: 'naturalWorld', baseValue: 10, personalValue: 0, occupationValue: 0, totalValue: 10 },
  { id: 'navigate', baseValue: 10, personalValue: 0, occupationValue: 0, totalValue: 10 },
  { id: 'occult', baseValue: 5, personalValue: 0, occupationValue: 0, totalValue: 5 },
  { id: 'operateHeavyMachinery', baseValue: 1, personalValue: 0, occupationValue: 0, totalValue: 1 },
  { id: 'pilot', baseValue: 1, personalValue: 0, occupationValue: 0, totalValue: 1 },
  { id: 'science', baseValue: 1, personalValue: 0, occupationValue: 0, totalValue: 1 },
  { id: 'sleightOfHand', baseValue: 10, personalValue: 0, occupationValue: 0, totalValue: 10 },
  { id: 'spotHidden', baseValue: 25, personalValue: 0, occupationValue: 0, totalValue: 25 },
  { id: 'survival', baseValue: 10, personalValue: 0, occupationValue: 0, totalValue: 10 },
  { id: 'track', baseValue: 10, personalValue: 0, occupationValue: 0, totalValue: 10 },

  // Languages
  { id: 'languageOwn', baseValue: 0, personalValue: 0, occupationValue: 0, totalValue: 0 }, // EDU
  { id: 'languageOther', baseValue: 1, personalValue: 0, occupationValue: 0, totalValue: 1 },
];

type CharacteristicValue = 'strength' | 'constitution' | 'dexterity' | 'appearance' | 'size' | 'intelligence' | 'power' | 'education';

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
  occupationSkills: string[]; // Skill IDs that get occupation points
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
    occupationSkills: ['appraise', 'artCraft', 'history', 'libraryUse', 'languageOther', 'navigate', 'occult', 'spotHidden'],
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
    occupationSkills: ['firstAid', 'languageOther', 'medicine', 'psychology', 'science', 'science'],
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
    occupationSkills: ['artCraft', 'disguise', 'law', 'libraryUse', 'listen', 'locksmith', 'psychology', 'spotHidden', 'stealth'],
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
    occupationSkills: ['artCraft', 'history', 'libraryUse', 'languageOwn', 'languageOther', 'listen', 'persuade', 'psychology'],
    suggestedContacts: ['Publishers', 'Editors', 'Sources', 'Government officials'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'appearance', 'power', 'constitution', 'size', 'strength']
  }
];