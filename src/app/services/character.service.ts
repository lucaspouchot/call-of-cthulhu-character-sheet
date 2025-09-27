import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CharacterSheet, CharacterSheetCreate, Attribute, Sex, TemporaryModifier, SkillPointAllocation } from '../models/character.model';
import { DEFAULT_SKILLS } from '../models/skills.model';
import { AgeModifierService } from './age-modifier.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private readonly STORAGE_KEY = 'cthulhu_characters';
  private charactersSubject = new BehaviorSubject<CharacterSheet[]>([]);
  public characters$ = this.charactersSubject.asObservable();

  constructor(private ageModifierService: AgeModifierService) {
    this.loadCharacters();
  }

  private loadCharacters(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const characters = JSON.parse(stored).map((char: any) => ({
          ...char,
          createdAt: new Date(char.createdAt),
          updatedAt: new Date(char.updatedAt),
          hitPoints: {
            ...char.hitPoints,
            modifiers: char.hitPoints.modifiers || []
          },
          sanity: {
            ...char.sanity,
            losses: char.sanity.losses.map((loss: any) => ({
              ...loss,
              date: new Date(loss.date)
            })),
            modifiers: char.sanity.modifiers || []
          },
          luck: {
            ...char.luck,
            modifiers: char.luck.modifiers || []
          },
          magicPoints: {
            ...char.magicPoints,
            modifiers: char.magicPoints.modifiers || []
          }
        }));
        this.charactersSubject.next(characters);
      }
    } catch (error) {
      console.error('Error loading characters:', error);
      this.charactersSubject.next([]);
    }
  }

  private saveCharacters(characters: CharacterSheet[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(characters));
      this.charactersSubject.next(characters);
    } catch (error) {
      console.error('Error saving characters:', error);
    }
  }

  getCharacters(): Observable<CharacterSheet[]> {
    return this.characters$;
  }

  getCharacterById(id: string): CharacterSheet | undefined {
    return this.charactersSubject.value.find(char => char.id === id);
  }

  createCharacter(characterData: CharacterSheetCreate): string {
    const id = this.generateId();
    const now = new Date();

    // Ensure we have all required attributes
    const strength = characterData.strength || this.createAttribute(50);
    const constitution = characterData.constitution || this.createAttribute(50);
    const power = characterData.power || this.createAttribute(50);
    const dexterity = characterData.dexterity || this.createAttribute(50);
    const appearance = characterData.appearance || this.createAttribute(50);
    const size = characterData.size || this.createAttribute(50);
    const intelligence = characterData.intelligence || this.createAttribute(50);
    const education = characterData.education || this.createAttribute(50);

    // Calculate derived stats
    const hitPointsMax = Math.floor((constitution.value + size.value) / 10);
    const sanityMax = power.value;
    const magicPointsMax = Math.floor(power.value / 5);
    const luckStarting = characterData.luckValue || 50;

    // Calculate movement with age penalties
    const baseMovement = this.calculateMovement(strength.value, dexterity.value, size.value);
    const movement = this.ageModifierService.applyMovementPenalty(baseMovement, characterData.age || 25);

    // Initialize skills with base values + assignments
    const skills = DEFAULT_SKILLS.map(skill => {
      const assignment = characterData.skillAssignments?.[skill.id] || { occupation: 0, personal: 0 };
      return {
        ...skill,
        personalValue: assignment.personal,
        occupationValue: assignment.occupation,
        totalValue: skill.baseValue + assignment.occupation + assignment.personal
      };
    });

    // Calculate skill points allocation
    const skillPoints: SkillPointAllocation = {
      occupationPointsTotal: 0, // Will be calculated based on occupation
      occupationPointsSpent: Object.values(characterData.skillAssignments || {})
        .reduce((total, assignment: any) => total + assignment.occupation, 0),
      personalPointsTotal: 0, // Will be calculated based on attributes
      personalPointsSpent: Object.values(characterData.skillAssignments || {})
        .reduce((total, assignment: any) => total + assignment.personal, 0),
      creditRating: characterData.creditRating || 0
    };

    const newCharacter: CharacterSheet = {
      id,
      name: characterData.name || 'New Character',
      player: characterData.player || '',
      occupation: characterData.occupation || '',
      age: characterData.age || 25,
      sex: characterData.sex || Sex.Undefined,
      residence: characterData.residence || '',
      birthplace: characterData.birthplace || '',

      // Attributes from creation data
      strength,
      constitution,
      power,
      dexterity,
      appearance,
      size,
      intelligence,
      education,

      // Calculated derived attributes
      hitPoints: {
        maximum: hitPointsMax,
        current: hitPointsMax,
        majorWound: false,
        modifiers: []
      },

      sanity: {
        maximum: sanityMax,
        current: sanityMax,
        startingValue: sanityMax,
        losses: [],
        modifiers: []
      },

      luck: {
        starting: luckStarting,
        current: luckStarting,
        modifiers: []
      },

      magicPoints: {
        maximum: magicPointsMax,
        current: magicPointsMax,
        modifiers: []
      },

      movement: {
        normal: movement,
        running: movement * 5,
        climbing: Math.floor(movement / 2),
        swimming: Math.floor(movement / 2)
      },

      skills,
      skillPoints,
      finance: this.initializeFinanceValues(characterData.creditRating || 0),
      weapons: [],
      armor: [],
      equipment: [],

      backstory: characterData.backstory || '',
      traits: characterData.traits || '',
      ideologyBeliefs: characterData.ideologyBeliefs || '',
      significantPeople: characterData.significantPeople || '',
      meaningfulLocations: characterData.meaningfulLocations || '',
      treasuredPossessions: characterData.treasuredPossessions || '',
      injuriesScars: '',
      phobiasManias: '',
      arcaneTomes: '',
      spellsRituals: '',
      encounters: '',

      createdAt: now,
      updatedAt: now,

      ...characterData
    };

    const characters = [...this.charactersSubject.value, newCharacter];
    this.saveCharacters(characters);
    return id;
  }

  updateCharacter(id: string, updates: Partial<CharacterSheet>): void {
    const characters = this.charactersSubject.value.map(char => {
      if (char.id === id) {
        return {
          ...char,
          ...updates,
          updatedAt: new Date()
        };
      }
      return char;
    });
    this.saveCharacters(characters);
  }

  deleteCharacter(id: string): void {
    const characters = this.charactersSubject.value.filter(char => char.id !== id);
    this.saveCharacters(characters);
  }

  private createAttribute(value: number): Attribute {
    return {
      value,
      halfValue: Math.floor(value / 2),
      fifthValue: Math.floor(value / 5)
    };
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private calculateMovement(strength: number, dexterity: number, size: number): number {
    if (dexterity >= size && strength >= size) {
      return 9; // Both DEX and STR >= SIZ
    } else if (dexterity >= size || strength >= size) {
      return 8; // Only one of DEX or STR >= SIZ
    }
    return 7; // Base value when both DEX and STR < SIZ
  }

  // Utility methods for character calculations
  calculateDerivedAttributes(character: CharacterSheet): Partial<CharacterSheet> {
    const hitPoints = Math.floor((character.constitution.value + character.size.value) / 10);
    const sanityMax = character.power.value;
    const magicPoints = Math.floor(character.power.value / 5);

    // Calculate MOV based on DEX, STR, and SIZ
    let baseMov = 7; // Base value when both DEX and STR < SIZ
    const dex = character.dexterity.value;
    const str = character.strength.value;
    const siz = character.size.value;

    if (dex >= siz && str >= siz) {
      baseMov = 9; // Both DEX and STR >= SIZ
    } else if (dex >= siz || str >= siz) {
      baseMov = 8; // Only one of DEX or STR >= SIZ
    }

    // Apply age penalty: -1 per decade above 30
    const agePenalty = Math.max(0, Math.floor((character.age - 30) / 10));
    const move = Math.max(1, baseMov - agePenalty); // Minimum MOV of 1

    // Update skills that depend on attributes
    const updatedSkills = character.skills.map(skill => {
      let newSkill = { ...skill };

      // Update dodge skill (half DEX)
      if (skill.id === 'dodge') {
        newSkill.baseValue = character.dexterity.halfValue;
        newSkill.totalValue = newSkill.baseValue + newSkill.personalValue + newSkill.occupationValue;
      }

      // Update Language (Own) skill (EDU)
      if (skill.id === 'languageOwn') {
        newSkill.baseValue = character.education.value;
        newSkill.totalValue = newSkill.baseValue + newSkill.personalValue + newSkill.occupationValue;
      }

      return newSkill;
    });

    return {
      hitPoints: {
        maximum: hitPoints,
        current: Math.min(character.hitPoints.current, hitPoints),
        majorWound: character.hitPoints.majorWound,
        modifiers: character.hitPoints.modifiers || []
      },
      sanity: {
        ...character.sanity,
        maximum: sanityMax,
        current: Math.min(character.sanity.current, sanityMax),
        modifiers: character.sanity.modifiers || []
      },
      magicPoints: {
        maximum: magicPoints,
        current: Math.min(character.magicPoints.current, magicPoints),
        modifiers: character.magicPoints.modifiers || []
      },
      movement: {
        normal: move,
        running: move * 5,
        climbing: move / 2,
        swimming: move / 2
      },
      skills: updatedSkills
    };
  }

  // Methods for managing temporary modifiers
  addModifier(characterId: string, type: 'hitPoints' | 'sanity' | 'luck' | 'magicPoints', modifier: Omit<TemporaryModifier, 'id' | 'createdAt'>): void {
    const character = this.getCharacterById(characterId);
    if (!character) return;

    const newModifier: TemporaryModifier = {
      ...modifier,
      id: this.generateId(),
      createdAt: new Date()
    };

    const updatedCharacter = { ...character };
    updatedCharacter[type].modifiers = [...updatedCharacter[type].modifiers, newModifier];

    this.updateCharacter(characterId, updatedCharacter);
  }

  removeModifier(characterId: string, type: 'hitPoints' | 'sanity' | 'luck' | 'magicPoints', modifierId: string): void {
    const character = this.getCharacterById(characterId);
    if (!character) return;

    const updatedCharacter = { ...character };
    updatedCharacter[type].modifiers = updatedCharacter[type].modifiers.filter(mod => mod.id !== modifierId);

    this.updateCharacter(characterId, updatedCharacter);
  }

  getEffectiveMaximum(character: CharacterSheet, type: 'hitPoints' | 'sanity' | 'luck' | 'magicPoints'): number {
    let baseValue: number;
    switch (type) {
      case 'hitPoints':
        baseValue = character.hitPoints.maximum;
        break;
      case 'sanity':
        baseValue = character.sanity.maximum;
        break;
      case 'luck':
        baseValue = character.luck.starting;
        break;
      case 'magicPoints':
        baseValue = character.magicPoints.maximum;
        break;
    }

    const modifiersSum = (character[type].modifiers || []).reduce((sum, mod) => sum + mod.value, 0);
    return Math.max(0, baseValue + modifiersSum);
  }

  private initializeFinanceValues(creditRating: number) {
    // Call of Cthulhu financial calculations based on Credit Rating
    // Using the same logic as getCreditRatingInfo in character-creation.ts
    let spendingLevel = 0;
    let cash = 0;
    let assets = 0;

    if (creditRating === 0) {
      // Penniless
      spendingLevel = 0.50;
      cash = 0.50;
      assets = 0;
    } else if (creditRating >= 1 && creditRating <= 9) {
      // Poor
      spendingLevel = 2;
      cash = creditRating * 1;
      assets = creditRating * 10;
    } else if (creditRating >= 10 && creditRating <= 49) {
      // Average
      spendingLevel = 10;
      cash = creditRating * 2;
      assets = creditRating * 50;
    } else if (creditRating >= 50 && creditRating <= 89) {
      // Wealthy
      spendingLevel = 50;
      cash = creditRating * 5;
      assets = creditRating * 500;
    } else if (creditRating >= 90 && creditRating <= 98) {
      // Rich
      spendingLevel = 250;
      cash = creditRating * 20;
      assets = creditRating * 2000;
    } else if (creditRating === 99) {
      // Super Rich
      spendingLevel = 5000;
      cash = 50000;
      assets = 5000000;
    } else {
      // Unknown/fallback
      spendingLevel = 0;
      cash = 0;
      assets = 0;
    }

    return {
      creditRating,
      spendingLevel,
      cash,
      assets,
      expenseHistory: []
    };
  }
}