export interface Attribute {
  value: number;
  halfValue: number;
  fifthValue: number;
}

export interface Skill {
  id: string;
  baseValue: number;
  personalValue: number;
  occupationValue: number;
  totalValue: number;
  description?: string;
  modifiers?: TemporaryModifier[];

  // For specialized skills (e.g., Art/Craft (Photography), Fighting (Sword))
  parentSkillId?: string; // References the parent skill ID (e.g., 'artCraft' for a photography skill)
  customName?: string; // The specialization name (e.g., 'Photography', 'Sword')

  // For completely custom skills added during play
  isCustom?: boolean; // True if this is a completely new skill not derived from any base skill
}

export interface EquipmentItem {
  id: string; // Unique identifier
  name: string; // Equipment name
  note?: string; // Optional note/description
}

export interface NoteItem {
  id: string; // Unique identifier
  title: string; // Note title
  description: string; // Note description/content
}

export interface Weapon {
  id: string; // Unique identifier for translation or custom weapon
  name?: string; // For custom weapons only
  skillUsed: string; // Skill ID (e.g., 'fightingBrawl', 'firearmsHandgun')
  damage: string; // Damage formula (e.g., '1D6', '1D10+2')
  range: string; // Range (e.g., 'Touch', '15 yards', '-')
  rate: string; // Rate of fire (e.g., '1', '1 (3)', '1 or 2')
  capacity: string; // Ammunition capacity (e.g., '6', '20/30', '-')
  malfunction: string; // Malfunction number (e.g., '100', '96', '-')
  cost?: string; // Informational only (e.g., '$40', 'N/A')
  isCustom?: boolean; // True if user-created weapon
}

export interface SanityLoss {
  encounter: string;
  loss: number;
  date: Date;
  details?: string;
}

export interface TemporaryModifier {
  id: string;
  name: string;
  value: number; // positive for bonus, negative for malus
  description?: string;
  createdAt: Date;
}

export enum Sex {
  Male = 'male',
  Female = 'female',
  Other = 'other',
  Undefined = 'undefined'
}

export interface SkillPointAllocation {
  occupationPointsTotal: number;
  occupationPointsSpent: number;
  personalPointsTotal: number;
  personalPointsSpent: number;
  creditRating: number;
}

export interface CharacterSheetCreate {
  // Basic Information (required for creation)
  name?: string;
  player?: string;
  age?: number;
  sex?: Sex;
  residence?: string;
  birthplace?: string;

  // Occupation (selected during creation)
  occupation?: string;

  // Attributes (generated/assigned during creation)
  strength?: Attribute;
  constitution?: Attribute;
  power?: Attribute;
  dexterity?: Attribute;
  appearance?: Attribute;
  size?: Attribute;
  intelligence?: Attribute;
  education?: Attribute;

  // Characteristics generation method (quickfire or rolling)

  attributeRolls: {
    generationMethod: 'rolling' | 'quickfire';
    rollingPoolA: number[];
    rollingPoolB: number[];
    assigned: { key: string; quickfireValue: number | null, rollingValue: number | null }[];
  };

  // Luck (rolled during creation)
  luckValue?: number;

  // Age modifiers (applied during creation)
  ageModifiers?: {
    strengthReduction: number;
    constitutionReduction: number;
    dexterityReduction: number;
    sizeReduction: number;
    appearanceReduction: number;
    educationReduction: number;
    educationBonus: number;
    selectedLuckValue: number;
    // Education improvement rolls for persistence
    educationRolls?: { roll: number, success: boolean, bonus: number }[];
    // Luck rolls for persistence
    luckRolls?: number[];
  };

  // Skills (assigned during creation)
  skillAssignments?: {
    [skillId: string]: {
      occupation: number;
      personal: number;
    };
  };

  // Custom/specialized skills created during character creation
  customSkills?: Skill[];

  // Credit Rating (set during occupation/skills step)
  creditRating?: number;

  // Personal Details (optional during creation) 
  backstory?: string;
  traits?: string;
  ideologyBeliefs?: string;
  significantPeople?: string;
  meaningfulLocations?: string;
  treasuredPossessions?: string;
}

export interface StepValidation {
  stepNumber?: number; // Optional - let parent component manage step numbers
  isValid: boolean;
  errors: string[];
}

export interface CharacterSheet {
  // Basic Information
  id: string;
  name: string;
  player: string;
  occupation: string;
  age: number;
  sex: Sex;
  residence: string;
  birthplace: string;

  // Attributes
  strength: Attribute;
  constitution: Attribute;
  power: Attribute;
  dexterity: Attribute;
  appearance: Attribute;
  size: Attribute;
  intelligence: Attribute;
  education: Attribute;

  // Derived Attributes
  hitPoints: {
    maximum: number;
    current: number;
    majorWound: boolean;
    modifiers: TemporaryModifier[];
  };

  sanity: {
    maximum: number;
    current: number;
    startingValue: number;
    losses: SanityLoss[];
    modifiers: TemporaryModifier[];
  };

  // Health status tracking
  healthStatus: {
    unconscious: boolean;
    dying: boolean;
    majorInjury: boolean;
    temporaryInsanity: boolean;
    indefiniteInsanity: boolean;
  };

  luck: {
    starting: number;
    current: number;
    modifiers: TemporaryModifier[];
  };

  magicPoints: {
    maximum: number;
    current: number;
    modifiers: TemporaryModifier[];
  };

  // Movement
  movement: {
    normal: number;
    running: number;
    climbing: number;
    swimming: number;
  };

  // Skills
  skills: Skill[];
  skillPoints: SkillPointAllocation;

  // Combat
  weapons: Weapon[];
  armor: {
    name: string;
    protection: number;
    penalty?: number;
  }[];

  // Equipment & Personal Details
  equipment: EquipmentItem[];
  notes: NoteItem[];

  // Finance
  finance: {
    creditRating: number;
    spendingLevel: number;
    cash: number;
    assets: number;
    expenseHistory: {
      id: string;
      description: string;
      amount: number;
      type: 'expense' | 'income';
      target: 'cash' | 'assets';
      date: Date;
    }[];
  };

  backstory: string;
  traits: string;
  ideologyBeliefs: string;
  significantPeople: string;
  meaningfulLocations: string;
  treasuredPossessions: string;
  scarsInjuries: string;
  phobiasManias: string;
  occultTomes: string;
  entityEncounters: string;

  // Relationships
  relationships?: {
    nodes: Array<{
      id: string;
      label: string;
      type: string;
      description?: string;
      characterId?: string;
      occupation?: string;
      isAlive?: boolean;
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
      label?: string;
      type: string;
      description?: string;
      strength?: number;
      isDirected?: boolean;
      customTypeName?: string;
    }>;
  };

  // Meta
  createdAt: Date;
  updatedAt: Date;
}