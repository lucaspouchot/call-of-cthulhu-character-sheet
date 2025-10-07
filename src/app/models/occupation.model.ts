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
    id: 'acrobat',
    creditRating: { min: 9, max: 20 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'dodge',
      'climb',
      'throw',
      'swim',
      'jump',
      'spotHidden',
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Amateur athletic clubs', 'Sports journalists', 'Circuses and carnivals'],
    recommendedCharacteristicsOrder: ['dexterity', 'strength', 'constitution', 'education', 'intelligence', 'power', 'appearance', 'size']
  },
  {
    id: 'movieActor',
    creditRating: { min: 20, max: 90 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftActing'] },
      'driveAuto',
      'disguise',
      'psychology',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Film industry', 'Studio directors', 'Critics', 'Screenwriters'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'intelligence', 'dexterity', 'constitution', 'power', 'size', 'strength']
  },
  {
    id: 'theaterActor',
    creditRating: { min: 9, max: 40 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftActing'] },
      'fightingBrawl',
      'history',
      'disguise',
      'psychology',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Theater community', 'Critics', 'Actors guild or union'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'intelligence', 'dexterity', 'constitution', 'power', 'size', 'strength']
  },
  {
    id: 'federalAgent',
    creditRating: { min: 20, max: 40 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'firearmsHandgun',
      'fightingBrawl',
      'driveAuto',
      'stealth',
      'law',
      'persuade',
      'spotHidden',
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Federal agencies', 'Police', 'Organized crime'],
    recommendedCharacteristicsOrder: ['education', 'strength', 'dexterity', 'constitution', 'intelligence', 'power', 'appearance', 'size']
  },
  {
    id: 'farmer',
    creditRating: { min: 9, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
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
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftFarming'] },
      'driveAuto',
      'operateHeavyMachinery',
      'mechanicalRepair',
      'naturalWorld',
      'track',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Banks', 'Local officials', 'Agriculture department'],
    recommendedCharacteristicsOrder: ['strength', 'constitution', 'dexterity', 'education', 'intelligence', 'power', 'size', 'appearance']
  },
  {
    id: 'orderly',
    creditRating: { min: 6, max: 15 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'strength', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'fightingBrawl',
      'stealth',
      'listen',
      'electricalRepair',
      'mechanicalRepair',
      'firstAid',
      'psychology',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Hospital staff', 'Patients', 'Privileged access'],
    recommendedCharacteristicsOrder: ['strength', 'constitution', 'education', 'dexterity', 'intelligence', 'power', 'appearance', 'size']
  },
  {
    id: 'alienist',
    creditRating: { min: 10, max: 60 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'law',
      'listen',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'medicine',
      'psychoanalysis',
      'psychology',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceBiology'] },
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceChemistry'] }
    ],
    suggestedContacts: ['Other mental illness specialists', 'Physicians', 'Police detectives'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'size', 'strength']
  },
  {
    id: 'mountaineer',
    creditRating: { min: 30, max: 60 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
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
      'listen',
      'climb',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'navigate',
      'track',
      'firstAid',
      'jump',
      { type: 'specialization', baseSkillId: 'survival', allowCustom: false, suggestedSpecializations: ['survivalMountain'] }
    ],
    suggestedContacts: ['Other mountaineers', 'Ecologists', 'Clients and patrons', 'Local police or rescuers', 'National park wardens', 'Sports clubs'],
    recommendedCharacteristicsOrder: ['dexterity', 'strength', 'constitution', 'education', 'intelligence', 'power', 'size', 'appearance']
  },
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
    id: 'archaeologist',
    creditRating: { min: 10, max: 40 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'archaeology',
      'libraryUse',
      'appraise',
      'history',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'mechanicalRepair',
      { type: 'choice', count: 1, options: ['navigate', 'scienceChemistry', 'sciencePhysics', 'scienceGeology'] },
      'spotHidden'
    ],
    suggestedContacts: ['Clients', 'Museums', 'Universities'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'strength', 'constitution', 'power', 'appearance', 'size']
  },
  {
    id: 'architect',
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
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftTechnicalDrawing'] },
      'accounting',
      'law',
      'history',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'psychology',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceEngineering'] },
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Construction companies', 'Engineers', 'City officials', 'Clients'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'appearance', 'power', 'constitution', 'size', 'strength']
  },
  {
    id: 'conArtist',
    creditRating: { min: 10, max: 65 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'appraise',
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftForgery'] },
      'disguise',
      'law',
      'locksmith',
      'psychology',
      'sleightOfHand',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Fences', 'Other criminals', 'Law enforcement', 'Marks'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'intelligence', 'dexterity', 'power', 'constitution', 'size', 'strength']
  },
  {
    id: 'craftsman',
    creditRating: { min: 10, max: 40 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
      'accounting',
      'appraise',
      'electricalRepair',
      'mechanicalRepair',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Customers', 'Suppliers', 'Trade associations'],
    recommendedCharacteristicsOrder: ['dexterity', 'education', 'intelligence', 'strength', 'constitution', 'power', 'appearance', 'size']
  },
  {
    id: 'fineArtist',
    creditRating: { min: 9, max: 50 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'dexterity', multiplier: 2 },
        { attribute: 'power', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true, suggestedSpecializations: ['artCraftFineArt', 'artCraftSculpture', 'artCraftPhotography'] },
      'history',
      'psychology',
      'appraise',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'spotHidden',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Art galleries', 'Critics', 'Patrons', 'Other artists'],
    recommendedCharacteristicsOrder: ['dexterity', 'power', 'education', 'intelligence', 'appearance', 'constitution', 'size', 'strength']
  },
  {
    id: 'entertainer',
    creditRating: { min: 9, max: 70 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true, suggestedSpecializations: ['artCraftActing', 'artCraftSinging', 'artCraftComedy'] },
      'disguise',
      'listen',
      'psychology',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Entertainment industry', 'Venues', 'Fans', 'Critics'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'dexterity', 'intelligence', 'power', 'constitution', 'size', 'strength']
  },
  {
    id: 'athlete',
    creditRating: { min: 9, max: 70 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
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
      'climb',
      'jump',
      'fightingBrawl',
      'ride',
      'swim',
      'throw',
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Sports teams', 'Coaches', 'Fans', 'Sports journalists'],
    recommendedCharacteristicsOrder: ['dexterity', 'strength', 'constitution', 'education', 'appearance', 'intelligence', 'power', 'size']
  },
  {
    id: 'aviator',
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
      { type: 'specialization', baseSkillId: 'pilot', allowCustom: false, suggestedSpecializations: ['pilotAircraft'] },
      'electricalRepair',
      'mechanicalRepair',
      'navigate',
      'listen',
      'spotHidden',
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Airlines', 'Military', 'Aviation clubs', 'Aircraft manufacturers'],
    recommendedCharacteristicsOrder: ['education', 'dexterity', 'intelligence', 'constitution', 'power', 'strength', 'appearance', 'size']
  },
  {
    id: 'lawyer',
    creditRating: { min: 30, max: 80 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'law',
      'libraryUse',
      'listen',
      'psychology',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Legal community', 'Clients', 'Police', 'Judges'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'appearance', 'power', 'constitution', 'dexterity', 'size', 'strength']
  },
  {
    id: 'bartender',
    creditRating: { min: 8, max: 25 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'accounting',
      'fastTalk',
      'fightingBrawl',
      'listen',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 2, options: ['charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Regular customers', 'Local community', 'Suppliers', 'Law enforcement'],
    recommendedCharacteristicsOrder: ['appearance', 'constitution', 'education', 'intelligence', 'dexterity', 'power', 'strength', 'size']
  },
  {
    id: 'outdoorsman',
    creditRating: { min: 5, max: 20 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
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
      'climb',
      'firearmsRifle',
      'jump',
      'listen',
      'naturalWorld',
      'navigate',
      'spotHidden',
      { type: 'specialization', baseSkillId: 'survival', allowCustom: true }
    ],
    suggestedContacts: ['Hunters', 'Park rangers', 'Outdoor enthusiasts', 'Wildlife experts'],
    recommendedCharacteristicsOrder: ['dexterity', 'strength', 'constitution', 'intelligence', 'education', 'power', 'size', 'appearance']
  },
  {
    id: 'librarian',
    creditRating: { min: 9, max: 35 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'accounting',
      'libraryUse',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'history',
      'spotHidden',
      { type: 'any', count: 3, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Scholars', 'Researchers', 'Book collectors', 'University staff'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'appearance', 'power', 'constitution', 'size', 'strength']
  },
  {
    id: 'boxer',
    creditRating: { min: 9, max: 60 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'strength', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'dodge',
      'fightingBrawl',
      'intimidate',
      'jump',
      'psychology',
      'spotHidden',
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Sports promoters', 'Gyms', 'Boxing community', 'Sports journalists'],
    recommendedCharacteristicsOrder: ['strength', 'constitution', 'dexterity', 'education', 'intelligence', 'power', 'appearance', 'size']
  },
  {
    id: 'bankRobber',
    creditRating: { min: 5, max: 75 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'strength', multiplier: 2 },
        { attribute: 'dexterity', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'appraise',
      'driveAuto',
      'electricalRepair',
      'firearmsHandgun',
      'fightingBrawl',
      'intimidate',
      'locksmith',
      'mechanicalRepair'
    ],
    suggestedContacts: ['Criminal underworld', 'Fences', 'Corrupt officials', 'Former accomplices'],
    recommendedCharacteristicsOrder: ['dexterity', 'strength', 'constitution', 'intelligence', 'education', 'power', 'appearance', 'size']
  },
  {
    id: 'lumberjack',
    creditRating: { min: 9, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
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
      'climb',
      'firstAid',
      'jump',
      'listen',
      'mechanicalRepair',
      'naturalWorld',
      'spotHidden',
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Logging companies', 'Forestry workers', 'Environmental groups', 'Equipment suppliers'],
    recommendedCharacteristicsOrder: ['strength', 'constitution', 'dexterity', 'education', 'intelligence', 'power', 'size', 'appearance']
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
  },
  {
    id: 'burglar',
    creditRating: { min: 5, max: 40 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'locksmith',
      'stealth',
      'listen',
      { type: 'choice', count: 1, options: ['electricalRepair', 'mechanicalRepair'] },
      'appraise',
      'climb',
      'sleightOfHand',
      'spotHidden'
    ],
    suggestedContacts: ['Fences', 'Other burglars'],
    recommendedCharacteristicsOrder: ['dexterity', 'education', 'intelligence', 'strength', 'constitution', 'power', 'size', 'appearance']
  },
  {
    id: 'stuntPerformer',
    creditRating: { min: 10, max: 50 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
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
      'fightingBrawl',
      { type: 'choice', count: 1, options: ['electricalRepair', 'mechanicalRepair'] },
      'dodge',
      'climb',
      'swim',
      'firstAid',
      'jump',
      { type: 'choice', count: 1, options: ['driveAuto', 'ride', 'pilotAircraft'] }
    ],
    suggestedContacts: ['Film and TV industry', 'Explosives and fireworks suppliers', 'Actors and directors'],
    recommendedCharacteristicsOrder: ['dexterity', 'strength', 'constitution', 'education', 'intelligence', 'power', 'size', 'appearance']
  },
  {
    id: 'chauffeur',
    creditRating: { min: 10, max: 40 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'driveAuto',
      'listen',
      'mechanicalRepair',
      'navigate',
      'spotHidden',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Prosperous businesspeople', 'Politicians'],
    recommendedCharacteristicsOrder: ['dexterity', 'education', 'intelligence', 'constitution', 'power', 'appearance', 'size', 'strength']
  },
  {
    id: 'taxiDriver',
    creditRating: { min: 9, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'fastTalk',
      'accounting',
      'driveAuto',
      'electricalRepair',
      'mechanicalRepair',
      'navigate',
      'spotHidden',
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Random people', 'Notable clients'],
    recommendedCharacteristicsOrder: ['dexterity', 'education', 'intelligence', 'constitution', 'power', 'appearance', 'size', 'strength']
  },
  {
    id: 'bountyHunter',
    creditRating: { min: 9, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
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
      { type: 'choice', count: 1, options: ['fightingBrawl', 'firearmsHandgun'] },
      'driveAuto',
      'stealth',
      'law',
      { type: 'choice', count: 1, options: ['electronics', 'electricalRepair'] },
      'track',
      'psychology',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Bail bondsmen', 'Local police', 'Informants'],
    recommendedCharacteristicsOrder: ['dexterity', 'strength', 'constitution', 'education', 'intelligence', 'power', 'size', 'appearance']
  },
  {
    id: 'professionalHunter',
    creditRating: { min: 20, max: 50 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
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
      'firearmsRifle',
      'stealth',
      { type: 'choice', count: 1, options: ['listen', 'spotHidden'] },
      {
        type: 'mixedChoice',
        count: 1,
        options: [
          { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
          { type: 'specialization', baseSkillId: 'survival', allowCustom: true }
        ]
      },
      'naturalWorld',
      'navigate',
      'track',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceBiology', 'scienceBotany'] }
    ],
    suggestedContacts: ['Administration of visited countries', 'Park wardens', 'Former wealthy clients', 'Black market gangs and vendors', 'Zoo directors'],
    recommendedCharacteristicsOrder: ['dexterity', 'strength', 'constitution', 'education', 'intelligence', 'power', 'size', 'appearance']
  },
  {
    id: 'mobBoss',
    creditRating: { min: 60, max: 95 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'firearmsHandgun',
      'fightingBrawl',
      'law',
      'listen',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Organized crime', 'Street criminals', 'Corrupt police', 'Local politicians', 'Judges', 'Union leaders', 'Lawyers', 'Ethnic community members'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'intelligence', 'power', 'constitution', 'dexterity', 'strength', 'size']
  },
  {
    id: 'researcher',
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
      'libraryUse',
      'history',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'spotHidden',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 3, description: 'character.creation.skills.anySkills.occupationDescription.researchFields' }
    ],
    suggestedContacts: ['Scholars and academics', 'Large corporations', 'Foreign governments'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'constitution', 'power', 'appearance', 'size', 'strength']
  },
  {
    id: 'actor',
    creditRating: { min: 10, max: 60 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftActing'] },
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.dance' },
      'psychology',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Actors and actresses', 'Theater directors', 'Film studios'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'dexterity', 'intelligence', 'power', 'constitution', 'size', 'strength']
  },
  {
    id: 'shopkeeper',
    creditRating: { min: 20, max: 40 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'appearance', multiplier: 2 },
        { attribute: 'dexterity', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'accounting',
      'listen',
      'electricalRepair',
      'mechanicalRepair',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Neighborhood residents and merchants', 'Police', 'Local officials', 'Customers'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'intelligence', 'dexterity', 'power', 'constitution', 'size', 'strength']
  },
  {
    id: 'accountant',
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
      'libraryUse',
      'accounting',
      'law',
      'listen',
      'persuade',
      'spotHidden',
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Clients', 'Business lawyers', 'Financial sector'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'appearance', 'power', 'constitution', 'size', 'strength']
  },
  {
    id: 'driver',
    creditRating: { min: 10, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'driveAuto',
      'mechanicalRepair',
      'dodge',
      'listen',
      'navigate',
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.repair' },
      { type: 'any', count: 2, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['Truckers', 'Taxi drivers', 'Rental agencies'],
    recommendedCharacteristicsOrder: ['dexterity', 'education', 'constitution', 'intelligence', 'power', 'strength', 'appearance', 'size']
  },
  {
    id: 'curator',
    creditRating: { min: 10, max: 30 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'archaeology',
      'libraryUse',
      'accounting',
      'appraise',
      'history',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'occult',
      'spotHidden'
    ],
    suggestedContacts: ['Local academics and scholars', 'Publishing houses', 'Museum visitors'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'appearance', 'power', 'constitution', 'size', 'strength']
  },
  {
    id: 'smuggler',
    creditRating: { min: 20, max: 60 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'appearance', multiplier: 2 },
        { attribute: 'dexterity', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'firearmsHandgun',
      { type: 'choice', count: 1, options: ['driveAuto', 'pilotAircraft', 'pilotBoat'] },
      'listen',
      'navigate',
      'sleightOfHand',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Organized crime', 'Coast guard', 'Customs agents'],
    recommendedCharacteristicsOrder: ['appearance', 'dexterity', 'education', 'intelligence', 'constitution', 'power', 'size', 'strength']
  },
  {
    id: 'correspondent',
    creditRating: { min: 10, max: 40 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'listen',
      'history',
      'languageOwn',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'psychology',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1, description: 'character.creation.skills.anySkills.occupationDescription.personalOrEra' }
    ],
    suggestedContacts: ['National or international media', 'Foreign governments', 'Military'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'appearance', 'dexterity', 'power', 'constitution', 'size', 'strength']
  },
  {
    id: 'cowboy',
    creditRating: { min: 9, max: 20 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
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
      { type: 'choice', count: 1, options: ['fightingBrawl', 'firearmsHandgun'] },
      'ride',
      'dodge',
      'throw',
      'track',
      { type: 'choice', count: 1, options: ['firstAid', 'naturalWorld'] },
      'jump',
      { type: 'specialization', baseSkillId: 'survival', allowCustom: true }
    ],
    suggestedContacts: ['Cattle dealers', 'Federal Agriculture Agency', 'Rodeo and show organizers'],
    recommendedCharacteristicsOrder: ['dexterity', 'strength', 'constitution', 'education', 'intelligence', 'power', 'size', 'appearance']
  },
  {
    id: 'independentCriminal',
    creditRating: { min: 5, max: 65 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'dexterity', multiplier: 2 },
        { attribute: 'appearance', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      {
        type: 'mixedChoice',
        count: 1,
        options: [
          { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftActing'] },
          'disguise'
        ]
      },
      { type: 'choice', count: 1, options: ['fightingBrawl', 'firearmsHandgun'] },
      { type: 'choice', count: 1, options: ['locksmith', 'mechanicalRepair'] },
      'stealth',
      'appraise',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Other criminals', 'Local police'],
    recommendedCharacteristicsOrder: ['dexterity', 'appearance', 'education', 'intelligence', 'strength', 'constitution', 'power', 'size']
  },
  {
    id: 'undertaker',
    creditRating: { min: 20, max: 40 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'accounting',
      'driveAuto',
      'history',
      'occult',
      'psychology',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceBiology'] },
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceChemistry'] },
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Bereaved families', 'Related services (priests, coffin suppliers)'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'appearance', 'power', 'constitution', 'dexterity', 'size', 'strength']
  },
  {
    id: 'deprogrammer',
    creditRating: { min: 20, max: 50 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'choice', count: 1, options: ['fightingBrawl', 'firearmsHandgun'] },
      'driveAuto',
      'stealth',
      'history',
      'occult',
      'psychology',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Law enforcement', 'Criminal underworld', 'Religious communities'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'strength', 'size']
  },
  {
    id: 'agencyDetective',
    creditRating: { min: 20, max: 45 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'strength', multiplier: 2 },
        { attribute: 'dexterity', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'libraryUse',
      'firearmsHandgun',
      'fightingBrawl',
      'stealth',
      'law',
      'track',
      'psychology',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Police', 'Clients'],
    recommendedCharacteristicsOrder: ['education', 'strength', 'dexterity', 'intelligence', 'constitution', 'power', 'size', 'appearance']
  },
  {
    id: 'privateInvestigator',
    creditRating: { min: 9, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
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
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftPhotography'] },
      'libraryUse',
      'law',
      'disguise',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Police', 'Clients'],
    recommendedCharacteristicsOrder: ['education', 'dexterity', 'intelligence', 'strength', 'constitution', 'power', 'size', 'appearance']
  },
  {
    id: 'dilettante',
    creditRating: { min: 50, max: 99 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
      'firearmsHandgun',
      'ride',
      { type: 'specialization', baseSkillId: 'language', allowCustom: true },
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 3 }
    ],
    suggestedContacts: ['People of the same status', 'Fraternities and artistic circles', 'High society'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'intelligence', 'power', 'constitution', 'dexterity', 'size', 'strength']
  },
  {
    id: 'domestic',
    creditRating: { min: 9, max: 40 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [
        { attribute: 'education', multiplier: 4 },
        { attribute: 'dexterity', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true, suggestedSpecializations: ['artCraftCooking', 'artCraftBarber'] },
      { type: 'choice', count: 1, options: ['accounting', 'appraise'] },
      'listen',
      { type: 'specialization', baseSkillId: 'language', allowCustom: true },
      'firstAid',
      'psychology',
      'spotHidden',
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Domestic staff from other households', 'Local suppliers', 'Local merchants'],
    recommendedCharacteristicsOrder: ['education', 'dexterity', 'intelligence', 'appearance', 'constitution', 'power', 'size', 'strength']
  },
  {
    id: 'animalTrainer',
    creditRating: { min: 10, max: 40 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'appearance', multiplier: 2 },
        { attribute: 'power', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'stealth',
      'listen',
      'naturalWorld',
      'track',
      'psychology',
      'jump',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceZoology'] },
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Zoo directors', 'Circus people', 'Clients', 'Actors'],
    recommendedCharacteristicsOrder: ['education', 'appearance', 'power', 'intelligence', 'constitution', 'dexterity', 'strength', 'size']
  },
  {
    id: 'writer',
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
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftWriting'] },
      'libraryUse',
      'history',
      { type: 'specialization', baseSkillId: 'language', allowCustom: true },
      { type: 'choice', count: 1, options: ['naturalWorld', 'occult'] },
      'psychology',
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Publishing houses', 'Literary critics', 'Historians', 'Other writers'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'size', 'strength']
  },
  {
    id: 'employee',
    creditRating: { min: 9, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'accounting',
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
      'listen',
      { type: 'specialization', baseSkillId: 'language', allowCustom: true },
      'psychology',
      { type: 'any', count: 3 }
    ],
    suggestedContacts: ['Office colleagues', 'Former university classmates', 'Friends or family in other companies'],
    recommendedCharacteristicsOrder: ['education', 'dexterity', 'intelligence', 'appearance', 'constitution', 'power', 'size', 'strength']
  },
  {
    id: 'executive',
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
      { type: 'choice', count: 1, options: ['libraryUse', 'computerUse'] },
      'accounting',
      'law',
      'listen',
      { type: 'specialization', baseSkillId: 'language', allowCustom: true },
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Management colleagues', 'Business lawyers', 'External consultants'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'appearance', 'power', 'constitution', 'dexterity', 'size', 'strength']
  },
  {
    id: 'spy',
    creditRating: { min: 20, max: 60 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'appearance', multiplier: 2 },
        { attribute: 'dexterity', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      {
        type: 'mixedChoice', count: 1, options: [
          'disguise',
          { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftActing'] }
        ]
      },
      'firearmsHandgun',
      'stealth',
      'listen',
      { type: 'specialization', baseSkillId: 'language', allowCustom: true },
      'sleightOfHand',
      'psychology',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Superior handler', 'Contacts based on cover identity', 'Local informants'],
    recommendedCharacteristicsOrder: ['education', 'appearance', 'dexterity', 'intelligence', 'power', 'constitution', 'size', 'strength']
  },
  {
    id: 'student',
    creditRating: { min: 5, max: 10 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'libraryUse',
      'listen',
      { type: 'specialization', baseSkillId: 'language', allowCustom: true },
      { type: 'any', count: 5 }
    ],
    suggestedContacts: ['Professors', 'Other students', 'Company contacts (for interns)'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'size', 'strength']
  },
  {
    id: 'explorer',
    creditRating: { min: 30, max: 70 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'appearance', multiplier: 2 },
        { attribute: 'dexterity', multiplier: 2 },
        { attribute: 'strength', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'firearmsRifle',
      { type: 'choice', count: 1, options: ['climb', 'swim'] },
      'history',
      { type: 'specialization', baseSkillId: 'language', allowCustom: true },
      'naturalWorld',
      'navigate',
      'jump',
      { type: 'specialization', baseSkillId: 'survival', allowCustom: true }
    ],
    suggestedContacts: ['Libraries and universities', 'Museums', 'Wealthy patrons', 'Other explorers', 'Publishing houses', 'Foreign bureaucrats', 'Primitive tribes'],
    recommendedCharacteristicsOrder: ['education', 'strength', 'dexterity', 'appearance', 'constitution', 'intelligence', 'power', 'size']
  },
  {
    id: 'fanatic',
    creditRating: { min: 0, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'appearance', multiplier: 2 },
        { attribute: 'power', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'stealth',
      'history',
      'psychology',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 3 }
    ],
    suggestedContacts: ['Religious or community groups', 'Media contacts'],
    recommendedCharacteristicsOrder: ['power', 'education', 'appearance', 'intelligence', 'constitution', 'dexterity', 'strength', 'size']
  },
  {
    id: 'forger',
    creditRating: { min: 20, max: 60 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftForgery'] },
      'libraryUse',
      'accounting',
      'appraise',
      'history',
      'sleightOfHand',
      'spotHidden',
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Organized crime', 'Businessmen'],
    recommendedCharacteristicsOrder: ['education', 'dexterity', 'intelligence', 'power', 'appearance', 'constitution', 'size', 'strength']
  },
  {
    id: 'gangsterMoll',
    creditRating: { min: 10, max: 80 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
      { type: 'choice', count: 1, options: ['fightingBrawl', 'firearmsHandgun'] },
      'driveAuto',
      'stealth',
      'listen',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Gangsters', 'Police', 'Luxury merchants'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'dexterity', 'intelligence', 'constitution', 'power', 'size', 'strength']
  },
  {
    id: 'zookeeper',
    creditRating: { min: 9, max: 40 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'accounting',
      'animalHandling',
      'dodge',
      'medicine',
      'naturalWorld',
      'firstAid',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['sciencePharmacy'] },
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceZoology'] }
    ],
    suggestedContacts: ['Scientists', 'Ecologists'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'constitution', 'dexterity', 'power', 'strength', 'size', 'appearance']
  },
  {
    id: 'gentleman',
    creditRating: { min: 40, max: 90 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
      'firearmsRifle',
      'ride',
      'history',
      { type: 'specialization', baseSkillId: 'language', allowCustom: true },
      'navigate',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Aristocrats and wealthy bourgeois', 'Politicians', 'Domestic servants and agricultural workers'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'intelligence', 'power', 'constitution', 'dexterity', 'size', 'strength']
  },
  {
    id: 'guru',
    creditRating: { min: 10, max: 60 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'accounting',
      'occult',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Ordinary worshippers', 'Celebrities'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'power', 'intelligence', 'constitution', 'dexterity', 'strength', 'size']
  },
  {
    id: 'hobo',
    creditRating: { min: 0, max: 5 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'appearance', multiplier: 2 },
        { attribute: 'dexterity', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
      { type: 'choice', count: 1, options: ['locksmith', 'sleightOfHand'] },
      'stealth',
      'listen',
      'climb',
      'navigate',
      'jump',
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Other hobos', 'Charitable individuals', 'Shelter staff'],
    recommendedCharacteristicsOrder: ['dexterity', 'constitution', 'strength', 'education', 'intelligence', 'power', 'appearance', 'size']
  },
  {
    id: 'politician',
    creditRating: { min: 50, max: 90 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'fastTalk',
      'charm',
      'listen',
      'history',
      'intimidate',
      'persuade',
      'psychology',
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Bureaucrats', 'Elected officials', 'Media', 'Businessmen', 'Foreign governments', 'Criminal underworld'],
    recommendedCharacteristicsOrder: ['appearance', 'education', 'intelligence', 'power', 'constitution', 'dexterity', 'size', 'strength']
  },
  {
    id: 'nurse',
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
      'listen',
      'medicine',
      'firstAid',
      'psychology',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceBiology'] },
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Hospital staff', 'Doctors', 'Social workers'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'strength', 'size']
  },
  {
    id: 'computerProgrammer',
    creditRating: { min: 10, max: 70 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'libraryUse',
      'electricalRepair',
      'electronics',
      'computerUse',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceMathematics'] },
      'spotHidden',
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Other programmers', 'Company employees and executives', 'Internet communities'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'power', 'constitution', 'appearance', 'strength', 'size']
  },
  {
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
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Civil or military workers', 'Local bureaucrats', 'Architects'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'constitution', 'power', 'strength', 'size', 'appearance']
  },
  {
    id: 'gambler',
    creditRating: { min: 8, max: 50 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'appearance', multiplier: 2 },
        { attribute: 'dexterity', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftActing'] },
      'accounting',
      'listen',
      'sleightOfHand',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Bookmakers', 'Organized crime', 'Ordinary people'],
    recommendedCharacteristicsOrder: ['appearance', 'dexterity', 'education', 'intelligence', 'power', 'constitution', 'size', 'strength']
  },
  {
    id: 'investigativeJournalist',
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
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftFineArt', 'artCraftPhotography'] },
      'libraryUse',
      'history',
      'psychology',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 3 }
    ],
    suggestedContacts: ['Media circles', 'Politicians', 'Local police', 'Low-level criminals'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'size', 'strength']
  },
  {
    id: 'judge',
    creditRating: { min: 50, max: 80 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'libraryUse',
      'law',
      'listen',
      'history',
      'intimidate',
      'persuade',
      'psychology',
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Legal professionals', 'Organized crime'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'size', 'strength']
  },
  {
    id: 'labAssistant',
    creditRating: { min: 10, max: 30 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'electricalRepair',
      { type: 'choice', count: 1, options: ['computerUse', 'libraryUse'] },
      'otherLanguage',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceChemistry'] },
      { type: 'specialization', baseSkillId: 'science', allowCustom: true },
      { type: 'specialization', baseSkillId: 'science', allowCustom: true },
      'spotHidden',
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Universities', 'Scientists', 'Libraries'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'power', 'constitution', 'strength', 'appearance', 'size']
  },
  {
    id: 'bookseller',
    creditRating: { min: 20, max: 40 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'accounting',
      'appraise',
      'driveAuto',
      'history',
      'libraryUse',
      'ownLanguage',
      'otherLanguage',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Bibliographers', 'Booksellers', 'Libraries', 'Universities', 'Clients'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'appearance', 'power', 'constitution', 'dexterity', 'size', 'strength']
  },
  {
    id: 'antiqueDealer',
    creditRating: { min: 30, max: 50 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'libraryUse',
      'accounting',
      'driveAuto',
      'appraise',
      'history',
      'navigate',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Local historians', 'Other antique dealers', 'Fences'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'appearance', 'power', 'constitution', 'dexterity', 'size', 'strength']
  },
  {
    id: 'gangster',
    creditRating: { min: 20, max: 40 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
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
      'firearm',
      'fighting',
      'driveAuto',
      'psychology',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Street criminals', 'Corrupt police', 'Local community members'],
    recommendedCharacteristicsOrder: ['dexterity', 'strength', 'education', 'appearance', 'constitution', 'power', 'intelligence', 'size']
  },
  {
    id: 'manager',
    creditRating: { min: 40, max: 90 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'accounting',
      'law',
      'otherLanguage',
      'psychology',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Former classmates', 'Secret societies', 'Local and federal officials', 'Media and advertising'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'appearance', 'power', 'constitution', 'dexterity', 'strength', 'size']
  },
  {
    id: 'merchantMarine',
    creditRating: { min: 20, max: 40 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
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
      'mechanicalRepair',
      'swim',
      'naturalWorld',
      'navigate',
      'pilotBoat',
      'firstAid',
      'spotHidden',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Coast guard', 'Smugglers', 'Organized crime'],
    recommendedCharacteristicsOrder: ['education', 'strength', 'dexterity', 'intelligence', 'constitution', 'power', 'appearance', 'size']
  },
  {
    id: 'navyOfficer',
    creditRating: { min: 9, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
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
      'firearm',
      'fighting',
      { type: 'choice', count: 1, options: ['electricalRepair', 'mechanicalRepair'] },
      'swim',
      'navigate',
      'pilotBoat',
      'firstAid',
      { type: 'specialization', baseSkillId: 'survival', allowCustom: false, suggestedSpecializations: ['survivalSea'] }
    ],
    suggestedContacts: ['Military personnel', 'Veteran associations'],
    recommendedCharacteristicsOrder: ['education', 'strength', 'dexterity', 'intelligence', 'constitution', 'power', 'appearance', 'size']
  },
  {
    id: 'mechanic',
    creditRating: { min: 9, max: 40 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
      'operateHeavyMachinery',
      'driveAuto',
      'electricalRepair',
      'climb',
      'mechanicalRepair',
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Union members', 'Specialists in their field'],
    recommendedCharacteristicsOrder: ['education', 'dexterity', 'strength', 'intelligence', 'constitution', 'power', 'appearance', 'size']
  },
  {
    id: 'doctor',
    creditRating: { min: 30, max: 80 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: false, suggestedSpecializations: ['languageLatin'] },
      'medicine',
      'firstAid',
      'psychology',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceBiology'] },
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['sciencePharmacy'] },
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Other doctors', 'Hospital staff', 'Patients and former patients'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'dexterity', 'constitution', 'appearance', 'strength', 'size']
  },
  {
    id: 'coroner',
    creditRating: { min: 40, max: 60 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'libraryUse',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: false, suggestedSpecializations: ['languageLatin'] },
      'medicine',
      'persuade',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceBiology'] },
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceForensics'] },
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['sciencePharmacy'] },
      'spotHidden'
    ],
    suggestedContacts: ['Lab workers', 'Police', 'Hospital staff'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'dexterity', 'constitution', 'appearance', 'strength', 'size']
  },
  {
    id: 'miner',
    creditRating: { min: 9, max: 30 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 2 }, { attribute: 'strength', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'operateHeavyMachinery',
      'stealth',
      'climb',
      'mechanicalRepair',
      'jump',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceGeology'] },
      'spotHidden',
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Union members', 'Political organizations'],
    recommendedCharacteristicsOrder: ['strength', 'education', 'constitution', 'dexterity', 'intelligence', 'power', 'size', 'appearance']
  },
  {
    id: 'missionary',
    creditRating: { min: 0, max: 30 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 2 }, { attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
      'mechanicalRepair',
      'medicine',
      'naturalWorld',
      'firstAid',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Church hierarchy', 'Foreign bureaucrats'],
    recommendedCharacteristicsOrder: ['education', 'appearance', 'intelligence', 'power', 'constitution', 'dexterity', 'strength', 'size']
  },
  {
    id: 'musician',
    creditRating: { min: 9, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [
        { attribute: 'appearance', multiplier: 2 },
        { attribute: 'dexterity', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
      'listen',
      'psychology',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 4 }
    ],
    suggestedContacts: ['Club owners', 'Musician union', 'Organized crime', 'Street criminals'],
    recommendedCharacteristicsOrder: ['education', 'appearance', 'dexterity', 'power', 'constitution', 'intelligence', 'strength', 'size']
  },
  {
    id: 'occultist',
    creditRating: { min: 9, max: 65 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'anthropology',
      'history',
      'libraryUse',
      'occult',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      { type: 'any', count: 3 }
    ],
    suggestedContacts: ['Libraries', 'Occult societies', 'Other occultists'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'constitution', 'dexterity', 'appearance', 'strength', 'size']
  },
  {
    id: 'militaryOfficer',
    creditRating: { min: 20, max: 70 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }, { attribute: 'strength', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'firearms',
      'navigate',
      'firstAid',
      'psychology',
      { type: 'choice', count: 1, options: ['charm', 'persuade'] },
      { type: 'any', count: 3 }
    ],
    suggestedContacts: ['Military', 'Government'],
    recommendedCharacteristicsOrder: ['education', 'dexterity', 'strength', 'constitution', 'power', 'intelligence', 'appearance', 'size']
  },
  {
    id: 'unskilledWorker',
    creditRating: { min: 9, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [
        { attribute: 'education', multiplier: 2 },
        { attribute: 'strength', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'drive',
      'electricalRepair',
      'fighting',
      'firstAid',
      'mechanicalRepair',
      'throw',
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Union', 'Coworkers', 'Organized crime'],
    recommendedCharacteristicsOrder: ['strength', 'dexterity', 'constitution', 'education', 'size', 'power', 'intelligence', 'appearance']
  },
  {
    id: 'parapsychologist',
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
      'anthropology',
      'history',
      'libraryUse',
      'occult',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'psychology',
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Universities', 'Parapsychology societies', 'Libraries'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'constitution', 'dexterity', 'appearance', 'strength', 'size']
  },
  {
    id: 'thug',
    creditRating: { min: 3, max: 10 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }, { attribute: 'strength', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'climb',
      'fighting',
      'firearms',
      'intimidate',
      'jump',
      'stealth',
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Street gangs', 'Organized crime', 'Fences'],
    recommendedCharacteristicsOrder: ['strength', 'dexterity', 'constitution', 'size', 'power', 'appearance', 'intelligence', 'education']
  },
  {
    id: 'pharmacist',
    creditRating: { min: 35, max: 75 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'accounting',
      'firstAid',
      'libraryUse',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: false, suggestedSpecializations: ['languageLatin'] },
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceChemistry'] },
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['sciencePharmacy'] },
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Doctors', 'Patients', 'Drug manufacturers'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'constitution', 'power', 'appearance', 'strength', 'size']
  },
  {
    id: 'photographer',
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
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftPhotography'] },
      'charm',
      'psychology',
      'stealth',
      'spotHidden',
      { type: 'any', count: 3 }
    ],
    suggestedContacts: ['Clients', 'Advertising agencies', 'Newspapers'],
    recommendedCharacteristicsOrder: ['education', 'dexterity', 'appearance', 'intelligence', 'power', 'constitution', 'strength', 'size']
  },
  {
    id: 'photojournalist',
    creditRating: { min: 10, max: 30 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftPhotography'] },
      'charm',
      'stealth',
      'spotHidden',
      { type: 'choice', count: 1, options: ['languageOther', 'ownLanguage'] },
      { type: 'any', count: 3 }
    ],
    suggestedContacts: ['Newspapers', 'Press agencies', 'Magazines'],
    recommendedCharacteristicsOrder: ['education', 'dexterity', 'intelligence', 'constitution', 'power', 'appearance', 'strength', 'size']
  },
  {
    id: 'pilot',
    creditRating: { min: 20, max: 70 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [
        { attribute: 'education', multiplier: 2 },
        { attribute: 'dexterity', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'pilot', allowCustom: true },
      'electricalRepair',
      'mechanicalRepair',
      'navigate',
      'spotHidden',
      { type: 'any', count: 3 }
    ],
    suggestedContacts: ['Airlines', 'Military', 'Airport staff'],
    recommendedCharacteristicsOrder: ['dexterity', 'education', 'intelligence', 'constitution', 'strength', 'power', 'appearance', 'size']
  },
  {
    id: 'hacker',
    creditRating: { min: 10, max: 70 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'computerUse',
      'electronics',
      'libraryUse',
      'spotHidden',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceComputing'] },
      { type: 'any', count: 3 }
    ],
    suggestedContacts: ['Other hackers', 'Online communities', 'Software companies'],
    recommendedCharacteristicsOrder: ['intelligence', 'education', 'dexterity', 'constitution', 'power', 'appearance', 'strength', 'size']
  },
  {
    id: 'diver',
    creditRating: { min: 9, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [
        { attribute: 'education', multiplier: 2 },
        { attribute: 'dexterity', multiplier: 2 }
      ]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'mechanicalRepair',
      'swim',
      { type: 'specialization', baseSkillId: 'pilot', allowCustom: false, suggestedSpecializations: ['pilotBoat'] },
      'diving',
      'firstAid',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceBiology'] },
      'spotHidden',
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Marine research', 'Salvage companies', 'Coast guard'],
    recommendedCharacteristicsOrder: ['dexterity', 'constitution', 'strength', 'education', 'intelligence', 'power', 'size', 'appearance']
  },
  {
    id: 'policeOfficer',
    creditRating: { min: 9, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }, { attribute: 'strength', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'firearms',
      'fighting',
      { type: 'choice', count: 1, options: ['drive', 'ride'] },
      'law',
      'firstAid',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 1, options: ['charm', 'fastTalk', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Law enforcement', 'Street contacts', 'Organized crime'],
    recommendedCharacteristicsOrder: ['strength', 'dexterity', 'constitution', 'education', 'intelligence', 'power', 'size', 'appearance']
  },
  {
    id: 'detective',
    creditRating: { min: 20, max: 50 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }, { attribute: 'strength', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftActing'] },
      'firearms',
      'law',
      'listen',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 1, options: ['charm', 'fastTalk', 'intimidate', 'persuade'] },
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Law enforcement', 'Street contacts', 'Organized crime', 'Legal system'],
    recommendedCharacteristicsOrder: ['intelligence', 'education', 'dexterity', 'strength', 'constitution', 'power', 'appearance', 'size']
  },
  {
    id: 'firefighter',
    creditRating: { min: 9, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }, { attribute: 'strength', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'drive', allowCustom: false, suggestedSpecializations: ['driveHeavyMachinery'] },
      'drive',
      'dodge',
      'climb',
      'throw',
      'mechanicalRepair',
      'firstAid',
      'jump'
    ],
    suggestedContacts: ['Fire department', 'Emergency services', 'Local community'],
    recommendedCharacteristicsOrder: ['strength', 'dexterity', 'constitution', 'education', 'intelligence', 'power', 'size', 'appearance']
  },
  {
    id: 'professor',
    creditRating: { min: 20, max: 70 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 4 }, { attribute: 'intelligence', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'libraryUse',
      'ownLanguage',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'psychology',
      { type: 'any', count: 4 }
    ],
    suggestedContacts: ['Scholars', 'Academics', 'Library staff'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'strength', 'size']
  },
  {
    id: 'prostitute',
    creditRating: { min: 5, max: 50 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }, { attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: true },
      'stealth',
      'dodge',
      'sleightOfHand',
      'psychology',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Street people', 'Police', 'Organized crime', 'Regular clients'],
    recommendedCharacteristicsOrder: ['appearance', 'dexterity', 'constitution', 'intelligence', 'power', 'education', 'strength', 'size']
  },
  {
    id: 'psychiatrist',
    creditRating: { min: 30, max: 80 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'listen',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'medicine',
      'persuade',
      'psychoanalysis',
      'psychology',
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceBiology'] },
      { type: 'specialization', baseSkillId: 'science', allowCustom: false, suggestedSpecializations: ['scienceChemistry'] }
    ],
    suggestedContacts: ['Mental health specialists', 'Doctors', 'Police detectives'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'strength', 'size']
  },
  {
    id: 'psychologist',
    creditRating: { min: 10, max: 40 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'libraryUse',
      'accounting',
      'listen',
      'persuade',
      'psychoanalysis',
      'psychology',
      { type: 'any', count: 2 }
    ],
    suggestedContacts: ['Other psychologists', 'Patients', 'University researchers'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'strength', 'size']
  },
  {
    id: 'newsReporter',
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
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftActing'] },
      'stealth',
      'listen',
      'history',
      'ownLanguage',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Media', 'Politicians', 'Business', 'Police', 'Street criminals', 'High society'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'constitution', 'appearance', 'dexterity', 'power', 'strength', 'size']
  },
  {
    id: 'truckDriver',
    creditRating: { min: 9, max: 20 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }, { attribute: 'strength', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'accounting',
      'drive',
      'listen',
      'mechanicalRepair',
      'navigate',
      'psychology',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Clients', 'Merchants', 'Local police', 'Street criminals'],
    recommendedCharacteristicsOrder: ['dexterity', 'constitution', 'strength', 'intelligence', 'education', 'power', 'appearance', 'size']
  },
  {
    id: 'fence',
    creditRating: { min: 20, max: 40 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }, { attribute: 'appearance', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'specialization', baseSkillId: 'artCraft', allowCustom: false, suggestedSpecializations: ['artCraftForging'] },
      'libraryUse',
      'accounting',
      'appraise',
      'history',
      'spotHidden',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Organized crime', 'Business associates', 'Potential buyers', 'Black market'],
    recommendedCharacteristicsOrder: ['appearance', 'intelligence', 'education', 'dexterity', 'power', 'constitution', 'strength', 'size']
  },
  {
    id: 'priestMonk',
    creditRating: { min: 9, max: 60 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'libraryUse',
      'accounting',
      'listen',
      'history',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'psychology',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'any', count: 1 }
    ],
    suggestedContacts: ['Church hierarchy', 'Parishioners', 'Influential church members'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'power', 'appearance', 'constitution', 'dexterity', 'strength', 'size']
  },
  {
    id: 'scientist',
    creditRating: { min: 9, max: 50 },
    occupationSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'education', multiplier: 4 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'choice', count: 1, options: ['computerUse', 'libraryUse'] },
      'ownLanguage',
      { type: 'specialization', baseSkillId: 'languageOther', allowCustom: true },
      'spotHidden',
      { type: 'choice', count: 1, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] },
      { type: 'specialization', baseSkillId: 'science', allowCustom: true },
      { type: 'specialization', baseSkillId: 'science', allowCustom: true },
      { type: 'specialization', baseSkillId: 'science', allowCustom: true }
    ],
    suggestedContacts: ['Other scientists', 'Professors', 'Universities', 'Current and former employers'],
    recommendedCharacteristicsOrder: ['education', 'intelligence', 'dexterity', 'constitution', 'power', 'appearance', 'strength', 'size']
  },
  {
    id: 'tribal',
    creditRating: { min: 0, max: 15 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }, { attribute: 'strength', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      { type: 'choice', count: 1, options: ['fighting', 'throw'] },
      'listen',
      'climb',
      'swim',
      'naturalWorld',
      'occult',
      { type: 'specialization', baseSkillId: 'survival', allowCustom: true },
      'spotHidden'
    ],
    suggestedContacts: ['Tribe members', 'Spiritual guides', 'Shamans', 'Allied tribes'],
    recommendedCharacteristicsOrder: ['strength', 'dexterity', 'constitution', 'power', 'size', 'intelligence', 'education', 'appearance']
  },
  {
    id: 'trafficker',
    creditRating: { min: 5, max: 30 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }, { attribute: 'strength', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'firearms',
      'fighting',
      'drive',
      'stealth',
      'psychology',
      'spotHidden',
      { type: 'choice', count: 2, options: ['fastTalk', 'charm', 'intimidate', 'persuade'] }
    ],
    suggestedContacts: ['Organized crime', 'Local police', 'Local merchants'],
    recommendedCharacteristicsOrder: ['strength', 'dexterity', 'constitution', 'intelligence', 'power', 'appearance', 'education', 'size']
  },
  {
    id: 'hitMan',
    creditRating: { min: 30, max: 60 },
    occupationSkillPoints: {
      type: 'composite',
      formulas: [{ attribute: 'education', multiplier: 2 }],
      choiceFormulas: [{ attribute: 'dexterity', multiplier: 2 }, { attribute: 'strength', multiplier: 2 }]
    },
    personalSkillPoints: {
      type: 'simple',
      formulas: [{ attribute: 'intelligence', multiplier: 2 }]
    },
    occupationSkills: [
      'firearms',
      'fighting',
      'locksmith',
      'stealth',
      'electricalRepair',
      'disguise',
      'mechanicalRepair',
      'psychology'
    ],
    suggestedContacts: ['Criminal underworld', 'Anonymous clients'],
    recommendedCharacteristicsOrder: ['dexterity', 'strength', 'intelligence', 'constitution', 'power', 'appearance', 'education', 'size']
  }
];