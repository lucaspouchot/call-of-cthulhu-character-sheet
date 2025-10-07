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
  }
];