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
}

export interface Weapon {
  name: string;
  damage: string;
  range: string;
  attacksPerRound: number;
  ammo: number;
  malfunction: number;
  skillUsed: string;
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
  generationMethod?: 'rolling' | 'quickfire';

  // Luck (rolled during creation)
  luckValue?: number;

  // Skills (assigned during creation)
  skillAssignments?: {
    [skillId: string]: {
      occupation: number;
      personal: number;
    };
  };

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
  equipment: string[];

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
  injuriesScars: string;
  phobiasManias: string;
  arcaneTomes: string;
  spellsRituals: string;
  encounters: string;

  // Meta
  createdAt: Date;
  updatedAt: Date;
}