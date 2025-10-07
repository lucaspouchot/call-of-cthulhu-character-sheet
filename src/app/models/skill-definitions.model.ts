// Skill categories for organization
export enum SkillCategory {
  Communication = 'communication',
  Interpersonal = 'interpersonal',
  Physical = 'physical',
  Mental = 'mental',
  Combat = 'combat',
  Language = 'language'
}

// Base skill definition with metadata
export interface SkillDefinition {
  id: string;
  baseValue: number;
  category: SkillCategory;

  // Specialization support
  isSpecializable: boolean; // True if this skill requires/allows specializations (e.g., Art/Craft, Fighting)
  requiresSpecialization?: boolean; // True if you CANNOT take the base skill, only specializations
  isCategoryOnly?: boolean; // True if this is just a category (fighting, firearms) that should never appear in skill lists

  // Pre-defined specializations (for skills that have specific variants in rulebook)
  // These are templates with translations, not separate skills
  predefinedSpecializations?: {
    id: string; // e.g., 'fightingSword', 'artCraftPhotography' - used for translation key
  }[];
}

// Standard Call of Cthulhu skill definitions
export const SKILL_DEFINITIONS: SkillDefinition[] = [
  // Communication Skills
  { id: 'charm', baseValue: 15, category: SkillCategory.Communication, isSpecializable: false },
  { id: 'fastTalk', baseValue: 5, category: SkillCategory.Communication, isSpecializable: false },
  { id: 'intimidate', baseValue: 15, category: SkillCategory.Communication, isSpecializable: false },
  { id: 'persuade', baseValue: 10, category: SkillCategory.Communication, isSpecializable: false },

  // Interpersonal Skills
  { id: 'animalHandling', baseValue: 5, category: SkillCategory.Interpersonal, isSpecializable: false },
  { id: 'psychology', baseValue: 10, category: SkillCategory.Interpersonal, isSpecializable: false },
  { id: 'psychoanalysis', baseValue: 1, category: SkillCategory.Interpersonal, isSpecializable: false },

  // Physical Skills
  { id: 'climb', baseValue: 20, category: SkillCategory.Physical, isSpecializable: false },
  { id: 'dodge', baseValue: 0, category: SkillCategory.Physical, isSpecializable: false }, // Half DEX
  { id: 'jump', baseValue: 20, category: SkillCategory.Physical, isSpecializable: false },
  { id: 'ride', baseValue: 5, category: SkillCategory.Physical, isSpecializable: false },
  { id: 'stealth', baseValue: 20, category: SkillCategory.Physical, isSpecializable: false },
  { id: 'swim', baseValue: 20, category: SkillCategory.Physical, isSpecializable: false },
  { id: 'throw', baseValue: 20, category: SkillCategory.Physical, isSpecializable: false },

  // Combat Skills - Specializable
  { id: 'fightingBrawl', baseValue: 25, category: SkillCategory.Physical, isSpecializable: false },
  {
    id: 'fighting',
    baseValue: 0, // Category only - never appears in skill lists
    category: SkillCategory.Combat,
    isSpecializable: true,
    requiresSpecialization: true,
    isCategoryOnly: true, // This is just a category for specialized fighting skills
    predefinedSpecializations: [
      { id: 'fightingSword' },
      { id: 'fightingAxe' },
      { id: 'fightingChainsaw' },
      { id: 'fightingFlail' },
      { id: 'fightingGarrote' },
      { id: 'fightingSpear' },
      { id: 'fightingWhip' }
    ]
  },
  { id: 'firearmsHandgun', baseValue: 20, category: SkillCategory.Physical, isSpecializable: false },
  { id: 'firearmsRifle', baseValue: 25, category: SkillCategory.Physical, isSpecializable: false },
  {
    id: 'firearms',
    baseValue: 0, // Category only - never appears in skill lists
    category: SkillCategory.Combat,
    isSpecializable: true,
    requiresSpecialization: true,
    isCategoryOnly: true, // This is just a category for specialized firearms skills
    predefinedSpecializations: [
      { id: 'firearmsShotgun' },
      { id: 'firearmsMachineGun' },
      { id: 'firearmsSubmachineGun' },
      { id: 'firearmsBowCrossbow' },
      { id: 'firearmsFlamethrower' }
    ]
  },

  // Mental Skills
  { id: 'accounting', baseValue: 5, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'anthropology', baseValue: 1, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'appraise', baseValue: 5, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'archaeology', baseValue: 1, category: SkillCategory.Mental, isSpecializable: false },

  // Art/Craft - Specializable
  {
    id: 'artCraft',
    baseValue: 5,
    category: SkillCategory.Mental,
    isSpecializable: true,
    requiresSpecialization: true,
    predefinedSpecializations: [
      { id: 'artCraftActing' },
      { id: 'artCraftBarber' },
      { id: 'artCraftCarpentry' },
      { id: 'artCraftCooking' },
      { id: 'artCraftFineArt' },
      { id: 'artCraftForgery' },
      { id: 'artCraftPhotography' },
      { id: 'artCraftSculpture' },
      { id: 'artCraftWriting' }
    ]
  },

  { id: 'computerUse', baseValue: 5, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'creditRating', baseValue: 0, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'disguise', baseValue: 5, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'driveAuto', baseValue: 20, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'electricalRepair', baseValue: 10, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'electronics', baseValue: 1, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'firstAid', baseValue: 30, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'history', baseValue: 5, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'law', baseValue: 5, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'libraryUse', baseValue: 20, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'listen', baseValue: 20, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'locksmith', baseValue: 1, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'mechanicalRepair', baseValue: 10, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'medicine', baseValue: 1, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'naturalWorld', baseValue: 10, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'navigate', baseValue: 10, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'occult', baseValue: 5, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'operateHeavyMachinery', baseValue: 1, category: SkillCategory.Mental, isSpecializable: false },

  // Pilot - Specializable
  {
    id: 'pilot',
    baseValue: 1,
    category: SkillCategory.Mental,
    isSpecializable: true,
    requiresSpecialization: true,
    predefinedSpecializations: [
      { id: 'pilotAircraft' },
      { id: 'pilotBoat' },
      { id: 'pilotHelicopter' },
      { id: 'pilotSpacecraft' }
    ]
  },

  // Science - Specializable
  {
    id: 'science',
    baseValue: 1,
    category: SkillCategory.Mental,
    isSpecializable: true,
    requiresSpecialization: true,
    predefinedSpecializations: [
      { id: 'scienceAstronomy' },
      { id: 'scienceBiology' },
      { id: 'scienceBotany' },
      { id: 'scienceChemistry' },
      { id: 'scienceCryptography' },
      { id: 'scienceEngineering' },
      { id: 'scienceForensics' },
      { id: 'scienceGeology' },
      { id: 'scienceMathematics' },
      { id: 'scienceMeteorology' },
      { id: 'sciencePharmacy' },
      { id: 'sciencePhysics' },
      { id: 'scienceZoology' }
    ]
  },

  { id: 'sleightOfHand', baseValue: 10, category: SkillCategory.Mental, isSpecializable: false },
  { id: 'spotHidden', baseValue: 25, category: SkillCategory.Mental, isSpecializable: false },

  // Survival - Specializable
  {
    id: 'survival',
    baseValue: 10,
    category: SkillCategory.Mental,
    isSpecializable: true,
    requiresSpecialization: true,
    predefinedSpecializations: [
      { id: 'survivalArctic' },
      { id: 'survivalDesert' },
      { id: 'survivalJungle' },
      { id: 'survivalSea' },
      { id: 'survivalUrban' }
    ]
  },

  { id: 'track', baseValue: 10, category: SkillCategory.Mental, isSpecializable: false },

  // Languages
  { id: 'languageOwn', baseValue: 0, category: SkillCategory.Language, isSpecializable: false }, // EDU
  {
    id: 'languageOther',
    baseValue: 1,
    category: SkillCategory.Language,
    isSpecializable: true,
    requiresSpecialization: true,
    predefinedSpecializations: [
      { id: 'languageArabic' },
      { id: 'languageChinese' },
      { id: 'languageEnglish' },
      { id: 'languageFrench' },
      { id: 'languageGerman' },
      { id: 'languageGreek' },
      { id: 'languageHebrew' },
      { id: 'languageItalian' },
      { id: 'languageJapanese' },
      { id: 'languageLatin' },
      { id: 'languagePolish' },
      { id: 'languagePortuguese' },
      { id: 'languageRussian' },
      { id: 'languageSpanish' }
    ]
  },
];
