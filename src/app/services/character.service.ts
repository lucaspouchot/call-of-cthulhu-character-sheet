import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CharacterSheet, Attribute, Sex } from '../models/character.model';
import { DEFAULT_SKILLS } from '../models/skills.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private readonly STORAGE_KEY = 'cthulhu_characters';
  private charactersSubject = new BehaviorSubject<CharacterSheet[]>([]);
  public characters$ = this.charactersSubject.asObservable();

  constructor() {
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
          sanity: {
            ...char.sanity,
            losses: char.sanity.losses.map((loss: any) => ({
              ...loss,
              date: new Date(loss.date)
            }))
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

  createCharacter(characterData: Partial<CharacterSheet>): string {
    const id = this.generateId();
    const now = new Date();

    const newCharacter: CharacterSheet = {
      id,
      name: characterData.name || 'New Character',
      player: characterData.player || '',
      occupation: characterData.occupation || '',
      age: characterData.age || 25,
      sex: characterData.sex || Sex.Undefined,
      residence: characterData.residence || '',
      birthplace: characterData.birthplace || '',

      // Initialize attributes with default values
      strength: this.createAttribute(50),
      constitution: this.createAttribute(50),
      power: this.createAttribute(50),
      dexterity: this.createAttribute(50),
      appearance: this.createAttribute(50),
      size: this.createAttribute(50),
      intelligence: this.createAttribute(50),
      education: this.createAttribute(50),

      hitPoints: {
        maximum: 10,
        current: 10,
        majorWound: false
      },

      sanity: {
        maximum: 99,
        current: 99,
        startingValue: 99,
        losses: []
      },

      luck: {
        starting: 50,
        current: 50
      },

      magicPoints: {
        maximum: 10,
        current: 10
      },

      movement: {
        normal: 8,
        running: 40,
        climbing: 4,
        swimming: 4
      },

      skills: DEFAULT_SKILLS.map(skill => ({ ...skill })),
      weapons: [],
      armor: [],
      equipment: [],

      backstory: '',
      traits: '',
      ideologyBeliefs: '',
      significantPeople: '',
      meaningfulLocations: '',
      treasuredPossessions: '',
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

  // Utility methods for character calculations
  calculateDerivedAttributes(character: CharacterSheet): Partial<CharacterSheet> {
    const hitPoints = Math.floor((character.constitution.value + character.size.value) / 10);
    const sanityMax = character.power.value;
    const magicPoints = Math.floor(character.power.value / 5);
    const move = character.age < 40 ? 8 : character.age < 50 ? 7 : character.age < 60 ? 6 : 5;

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
        majorWound: character.hitPoints.majorWound
      },
      sanity: {
        ...character.sanity,
        maximum: sanityMax,
        current: Math.min(character.sanity.current, sanityMax)
      },
      magicPoints: {
        maximum: magicPoints,
        current: Math.min(character.magicPoints.current, magicPoints)
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
}