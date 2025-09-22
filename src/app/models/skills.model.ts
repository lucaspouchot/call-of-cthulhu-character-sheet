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

// Common occupations with skill bonuses
export interface Occupation {
  id: string;
  creditRating: { min: number; max: number };
  skillPoints: string; // Formula like "EDU × 4"
  occupationSkills: string[]; // Skill IDs that get occupation points
  personalSkills: number; // Number of personal interest skills
  suggestedContacts: string[];
}

export const OCCUPATIONS: Occupation[] = [
  {
    id: 'antiquarian',
    creditRating: { min: 30, max: 70 },
    skillPoints: 'EDU × 4',
    occupationSkills: ['appraise', 'artCraft', 'history', 'libraryUse', 'languageOther', 'navigate', 'occult', 'spotHidden'],
    personalSkills: 4,
    suggestedContacts: ['Auction houses', 'Dealers', 'Historians', 'Museums']
  },
  {
    id: 'doctor',
    creditRating: { min: 60, max: 90 },
    skillPoints: 'EDU × 4',
    occupationSkills: ['firstAid', 'languageOther', 'medicine', 'psychology', 'science', 'science'],
    personalSkills: 4,
    suggestedContacts: ['Hospitals', 'Nurses', 'Patients', 'Medical suppliers']
  },
  {
    id: 'privateInvestigator',
    creditRating: { min: 9, max: 30 },
    skillPoints: 'EDU × 2 + (DEX × 2 or STR × 2)',
    occupationSkills: ['artCraft', 'disguise', 'law', 'libraryUse', 'listen', 'locksmith', 'psychology', 'spotHidden', 'stealth'],
    personalSkills: 4,
    suggestedContacts: ['Police', 'Criminals', 'Clients', 'Informants']
  },
  {
    id: 'journalist',
    creditRating: { min: 9, max: 30 },
    skillPoints: 'EDU × 4',
    occupationSkills: ['artCraft', 'history', 'libraryUse', 'languageOwn', 'languageOther', 'listen', 'persuade', 'psychology'],
    personalSkills: 4,
    suggestedContacts: ['Publishers', 'Editors', 'Sources', 'Government officials']
  }
];