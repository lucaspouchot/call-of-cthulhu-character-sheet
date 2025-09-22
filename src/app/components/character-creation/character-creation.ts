import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { DiceRollingService } from '../../services/dice-rolling.service';
import { OCCUPATIONS, Occupation } from '../../models/skills.model';
import { Attribute } from '../../models/character.model';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher';
import { DynamicTranslatePipe } from '../../pipes/dynamic-translate.pipe';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-character-creation',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LanguageSwitcherComponent, DynamicTranslatePipe],
  templateUrl: './character-creation.html',
  styleUrl: './character-creation.css'
})
export class CharacterCreation {
  characterForm: FormGroup;
  occupations = OCCUPATIONS;
  selectedOccupation: Occupation | null = null;
  currentStep = signal(1);
  totalSteps = 4;

  stepTitle = computed(() => {
    const step = this.currentStep();
    switch (step) {
      case 1: return 'character.creation.basic';
      case 2: return 'character.creation.attributesTitle';
      case 3: return 'character.creation.occupationStep';
      case 4: return 'character.creation.personalStep';
      default: return 'character.creation.default';
    }
  });

  // Attribute generation
  attributes: Record<string, Attribute> = {
    strength: { value: 0, halfValue: 0, fifthValue: 0 },
    constitution: { value: 0, halfValue: 0, fifthValue: 0 },
    power: { value: 0, halfValue: 0, fifthValue: 0 },
    dexterity: { value: 0, halfValue: 0, fifthValue: 0 },
    appearance: { value: 0, halfValue: 0, fifthValue: 0 },
    size: { value: 0, halfValue: 0, fifthValue: 0 },
    intelligence: { value: 0, halfValue: 0, fifthValue: 0 },
    education: { value: 0, halfValue: 0, fifthValue: 0 }
  };

  attributeNames = ['strength', 'constitution', 'power', 'dexterity', 'appearance', 'size', 'intelligence', 'education'];

  getSkillTranslation(skillId: string): string {
    const translationKey = `character.creation.skills.${skillId}`;
    return this.translationService.getTranslation(translationKey) || skillId;
  }

  getOccupationName(occupationId: string): string {
    const translationKey = `character.creation.occupation.preset.${occupationId}.name`;
    return this.translationService.getTranslation(translationKey) || occupationId;
  }

  getOccupationDescription(occupationId: string): string {
    const translationKey = `character.creation.occupation.preset.${occupationId}.description`;
    return this.translationService.getTranslation(translationKey) || '';
  }

  constructor(
    private fb: FormBuilder,
    private characterService: CharacterService,
    private diceService: DiceRollingService,
    private router: Router,
    private translationService: TranslationService
  ) {
    this.characterForm = this.fb.group({
      name: ['', Validators.required],
      player: ['', Validators.required],
      occupation: ['', Validators.required],
      age: [25, [Validators.required, Validators.min(15), Validators.max(89)]],
      sex: ['', Validators.required],
      residence: [''],
      birthplace: [''],

      // Personal details
      backstory: [''],
      traits: [''],
      ideologyBeliefs: [''],
      significantPeople: [''],
      meaningfulLocations: [''],
      treasuredPossessions: ['']
    });
  }

  ngOnInit() {
    this.generateAllAttributes();
  }

  nextStep() {
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update(step => step + 1);
    }
  }

  previousStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(step => step - 1);
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

  generateAllAttributes() {
    this.attributeNames.forEach(attr => {
      this.generateAttribute(attr);
    });
  }

  generateAttribute(attributeName: string) {
    // Roll 3d6 * 5 for each attribute (standard CoC character generation)
    const roll1 = Math.floor(Math.random() * 6) + 1;
    const roll2 = Math.floor(Math.random() * 6) + 1;
    const roll3 = Math.floor(Math.random() * 6) + 1;
    const total = (roll1 + roll2 + roll3) * 5;

    this.attributes[attributeName] = this.createAttribute(total);
  }

  private createAttribute(value: number): Attribute {
    return {
      value,
      halfValue: Math.floor(value / 2),
      fifthValue: Math.floor(value / 5)
    };
  }

  onOccupationChange() {
    const occupationId = this.characterForm.get('occupation')?.value;
    this.selectedOccupation = this.occupations.find(occ => occ.id === occupationId) || null;
  }

  calculateDerivedStats() {
    const hitPoints = Math.floor((this.attributes['constitution'].value + this.attributes['size'].value) / 10);
    const sanity = this.attributes['power'].value;
    const magicPoints = Math.floor(this.attributes['power'].value / 5);
    const luck = this.rollLuck();
    const age = this.characterForm.get('age')?.value || 25;
    const move = age < 40 ? 8 : age < 50 ? 7 : age < 60 ? 6 : 5;

    return {
      hitPoints,
      sanity,
      magicPoints,
      luck,
      movement: {
        normal: move,
        running: move * 5,
        climbing: move / 2,
        swimming: move / 2
      }
    };
  }

  private rollLuck(): number {
    // Roll 3d6 * 5 for luck
    const roll1 = Math.floor(Math.random() * 6) + 1;
    const roll2 = Math.floor(Math.random() * 6) + 1;
    const roll3 = Math.floor(Math.random() * 6) + 1;
    return (roll1 + roll2 + roll3) * 5;
  }

  createCharacter() {
    if (this.characterForm.valid) {
      const derivedStats = this.calculateDerivedStats();
      const formValue = this.characterForm.value;

      const characterData = {
        ...formValue,
        ...this.attributes,
        hitPoints: {
          maximum: derivedStats.hitPoints,
          current: derivedStats.hitPoints,
          majorWound: false
        },
        sanity: {
          maximum: derivedStats.sanity,
          current: derivedStats.sanity,
          startingValue: derivedStats.sanity,
          losses: []
        },
        luck: {
          starting: derivedStats.luck,
          current: derivedStats.luck
        },
        magicPoints: {
          maximum: derivedStats.magicPoints,
          current: derivedStats.magicPoints
        },
        movement: derivedStats.movement
      };

      const characterId = this.characterService.createCharacter(characterData);
      this.router.navigate(['/character', characterId]);
    }
  }
}
