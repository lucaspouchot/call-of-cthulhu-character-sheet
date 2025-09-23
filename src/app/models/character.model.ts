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

  // Combat
  weapons: Weapon[];
  armor: {
    name: string;
    protection: number;
    penalty?: number;
  }[];

  // Equipment & Personal Details
  equipment: string[];
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