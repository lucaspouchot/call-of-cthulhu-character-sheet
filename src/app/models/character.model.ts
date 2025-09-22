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
  };

  sanity: {
    maximum: number;
    current: number;
    startingValue: number;
    losses: SanityLoss[];
  };

  luck: {
    starting: number;
    current: number;
  };

  magicPoints: {
    maximum: number;
    current: number;
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