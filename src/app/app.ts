import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Character interfaces
interface Characteristics {
  str: number;
  dex: number;
  int: number;
  con: number;
  app: number;
  pow: number;
  siz: number;
  edu: number;
}

interface Skill {
  name: string;
  value: number;
  base?: number;
}

interface Character {
  name: string;
  occupation: string;
  age: number;
  characteristics: Characteristics;
  currentSanity: number;
  luck: number;
  customSkills: Skill[];
  equipment: string;
  notes: string;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cthulhu-character-sheet');
  
  character: Character = {
    name: '',
    occupation: '',
    age: 0,
    characteristics: {
      str: 0,
      dex: 0,
      int: 0,
      con: 0,
      app: 0,
      pow: 0,
      siz: 0,
      edu: 0
    },
    currentSanity: 0,
    luck: 0,
    customSkills: [],
    equipment: '',
    notes: ''
  };

  coreSkills: Skill[] = [
    { name: 'Accounting', value: 0, base: 5 },
    { name: 'Anthropology', value: 0, base: 1 },
    { name: 'Appraise', value: 0, base: 5 },
    { name: 'Archaeology', value: 0, base: 1 },
    { name: 'Art/Craft', value: 0, base: 5 },
    { name: 'Charm', value: 0, base: 15 },
    { name: 'Climb', value: 0, base: 20 },
    { name: 'Credit Rating', value: 0, base: 0 },
    { name: 'Cthulhu Mythos', value: 0, base: 0 },
    { name: 'Disguise', value: 0, base: 5 },
    { name: 'Dodge', value: 0, base: 0 },
    { name: 'Drive Auto', value: 0, base: 20 },
    { name: 'Electrical Repair', value: 0, base: 10 },
    { name: 'Fast Talk', value: 0, base: 5 },
    { name: 'Fighting (Brawl)', value: 0, base: 25 },
    { name: 'Firearms (Handgun)', value: 0, base: 20 },
    { name: 'Firearms (Rifle)', value: 0, base: 25 },
    { name: 'First Aid', value: 0, base: 30 },
    { name: 'History', value: 0, base: 5 },
    { name: 'Intimidate', value: 0, base: 15 },
    { name: 'Jump', value: 0, base: 20 },
    { name: 'Language (Own)', value: 0, base: 0 },
    { name: 'Law', value: 0, base: 5 },
    { name: 'Library Use', value: 0, base: 20 },
    { name: 'Listen', value: 0, base: 20 },
    { name: 'Locksmith', value: 0, base: 1 },
    { name: 'Mechanical Repair', value: 0, base: 10 },
    { name: 'Medicine', value: 0, base: 1 },
    { name: 'Natural World', value: 0, base: 10 },
    { name: 'Navigate', value: 0, base: 10 },
    { name: 'Occult', value: 0, base: 5 },
    { name: 'Operate Heavy Machine', value: 0, base: 1 },
    { name: 'Persuade', value: 0, base: 10 },
    { name: 'Pilot', value: 0, base: 1 },
    { name: 'Psychology', value: 0, base: 10 },
    { name: 'Ride', value: 0, base: 5 },
    { name: 'Science', value: 0, base: 1 },
    { name: 'Sleight of Hand', value: 0, base: 10 },
    { name: 'Spot Hidden', value: 0, base: 25 },
    { name: 'Stealth', value: 0, base: 20 },
    { name: 'Survival', value: 0, base: 10 },
    { name: 'Swim', value: 0, base: 20 },
    { name: 'Throw', value: 0, base: 20 },
    { name: 'Track', value: 0, base: 10 }
  ];

  getCharacteristicModifier(value: number): string {
    if (!value) return '';
    return Math.floor(value / 2).toString();
  }

  calculateHitPoints(): number {
    const con = this.character.characteristics.con || 0;
    const siz = this.character.characteristics.siz || 0;
    return Math.floor((con + siz) / 10);
  }

  calculateMagicPoints(): number {
    return Math.floor((this.character.characteristics.pow || 0) / 5);
  }

  addCustomSkill(): void {
    this.character.customSkills.push({ name: '', value: 0 });
  }

  removeCustomSkill(index: number): void {
    this.character.customSkills.splice(index, 1);
  }

  saveCharacter(): void {
    const characterData = JSON.stringify(this.character);
    localStorage.setItem('cthulhu-character', characterData);
    alert('Character saved successfully!');
  }

  loadCharacter(): void {
    const savedData = localStorage.getItem('cthulhu-character');
    if (savedData) {
      this.character = JSON.parse(savedData);
      alert('Character loaded successfully!');
    } else {
      alert('No saved character found!');
    }
  }

  newCharacter(): void {
    if (confirm('Are you sure you want to create a new character? All unsaved changes will be lost.')) {
      this.character = {
        name: '',
        occupation: '',
        age: 0,
        characteristics: {
          str: 0,
          dex: 0,
          int: 0,
          con: 0,
          app: 0,
          pow: 0,
          siz: 0,
          edu: 0
        },
        currentSanity: 0,
        luck: 0,
        customSkills: [],
        equipment: '',
        notes: ''
      };
    }
  }
}
