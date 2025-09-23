import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { DiceRollingService } from '../../services/dice-rolling.service';
import { EntityTranslationService } from '../../services/entity-translation.service';
import { OCCUPATIONS, Occupation } from '../../models/skills.model';
import { Attribute } from '../../models/character.model';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher';
import { DynamicTranslatePipe } from '../../pipes/dynamic-translate.pipe';

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

  // Generation method and values pool
  generationMethod = 'standard'; // 'standard' or 'mixed'
  generatedValues: { value: number, used: boolean, formula: string }[] = [];
  selectedAttributeForAssignment: string | null = null;

  // Custom dice formulas
  diceFormulas = [
    { label: '3d6×5', formula: '3d6*5', descriptionKey: 'character.creation.attributes.formulas.descriptions.standard' },
    { label: '(2d6+6)×5', formula: '(2d6+6)*5', descriptionKey: 'character.creation.attributes.formulas.descriptions.consistent' },
    { label: '(1d6+12)×5', formula: '(1d6+12)*5', descriptionKey: 'character.creation.attributes.formulas.descriptions.high' }
  ];

  customRolls: { formula: string, count: number }[] = [
    { formula: '3d6*5', count: 8 }
  ];

  getSkillTranslation(skillId: string): string {
    return this.entityTranslationService.getSkillTranslation(skillId);
  }

  getOccupationName(occupationId: string): string {
    return this.entityTranslationService.getOccupationName(occupationId);
  }

  getOccupationDescription(occupationId: string): string {
    return this.entityTranslationService.getOccupationDescription(occupationId);
  }

  constructor(
    private fb: FormBuilder,
    private characterService: CharacterService,
    private diceService: DiceRollingService,
    private router: Router,
    private entityTranslationService: EntityTranslationService
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

  onGenerationMethodChange() {
    this.clearAllAttributes();
    this.generatedValues = [];
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
    this.generatedValues = [];

    // Generate values based on custom formulas
    for (const rollConfig of this.customRolls) {
      for (let i = 0; i < rollConfig.count; i++) {
        const value = this.rollDiceFormula(rollConfig.formula);
        this.generatedValues.push({
          value,
          used: false,
          formula: rollConfig.formula
        });
      }
    }

    // Clear all attributes
    this.attributeNames.forEach(attr => {
      this.attributes[attr] = this.createAttribute(0);
    });
  }

  private rollDiceFormula(formula: string): number {
    // Parse and execute dice formula
    try {
      // Handle basic formulas like "3d6*5", "2d6*5+6", etc.
      if (formula === '3d6*5') {
        const roll1 = Math.floor(Math.random() * 6) + 1;
        const roll2 = Math.floor(Math.random() * 6) + 1;
        const roll3 = Math.floor(Math.random() * 6) + 1;
        return (roll1 + roll2 + roll3) * 5;
      } else if (formula === '2d6*5+6') {
        const roll1 = Math.floor(Math.random() * 6) + 1;
        const roll2 = Math.floor(Math.random() * 6) + 1;
        return (roll1 + roll2) * 5 + 6;
      } else if (formula === '4d6*5') {
        const roll1 = Math.floor(Math.random() * 6) + 1;
        const roll2 = Math.floor(Math.random() * 6) + 1;
        const roll3 = Math.floor(Math.random() * 6) + 1;
        const roll4 = Math.floor(Math.random() * 6) + 1;
        return (roll1 + roll2 + roll3 + roll4) * 5;
      } else if (formula === '(2d6+6)*5') {
        const roll1 = Math.floor(Math.random() * 6) + 1;
        const roll2 = Math.floor(Math.random() * 6) + 1;
        return (roll1 + roll2 + 6) * 5;
      } else if (formula === '(1d6+12)*5') {
        const roll1 = Math.floor(Math.random() * 6) + 1;
        return (roll1 + 12) * 5;
      } else {
        // Fallback to standard
        const roll1 = Math.floor(Math.random() * 6) + 1;
        const roll2 = Math.floor(Math.random() * 6) + 1;
        const roll3 = Math.floor(Math.random() * 6) + 1;
        return (roll1 + roll2 + roll3) * 5;
      }
    } catch {
      // Fallback to standard roll
      const roll1 = Math.floor(Math.random() * 6) + 1;
      const roll2 = Math.floor(Math.random() * 6) + 1;
      const roll3 = Math.floor(Math.random() * 6) + 1;
      return (roll1 + roll2 + roll3) * 5;
    }
  }

  private rollStandardAttribute(): number {
    // Roll 3d6 * 5
    const roll1 = Math.floor(Math.random() * 6) + 1;
    const roll2 = Math.floor(Math.random() * 6) + 1;
    const roll3 = Math.floor(Math.random() * 6) + 1;
    return (roll1 + roll2 + roll3) * 5;
  }

  private rollMixedAttribute(): number {
    // Roll 2d6 * 5 + 6
    const roll1 = Math.floor(Math.random() * 6) + 1;
    const roll2 = Math.floor(Math.random() * 6) + 1;
    return (roll1 + roll2) * 5 + 6;
  }

  generateSingleAttribute(attributeName: string) {
    // Use the first formula from custom rolls or default
    const formula = this.customRolls.length > 0 ? this.customRolls[0].formula : '3d6*5';
    const value = this.rollDiceFormula(formula);
    this.attributes[attributeName] = this.createAttribute(value);
  }

  clearAllAttributes() {
    this.attributeNames.forEach(attr => {
      this.attributes[attr] = this.createAttribute(0);
    });
    this.generatedValues.forEach(value => value.used = false);
  }

  clearAttribute(attributeName: string) {
    // If the attribute had a value from the pool, mark it as unused
    const currentValue = this.attributes[attributeName].value;
    if (currentValue > 0) {
      const poolItem = this.generatedValues.find(v => v.value === currentValue && v.used);
      if (poolItem) {
        poolItem.used = false;
      }
    }

    this.attributes[attributeName] = this.createAttribute(0);
  }

  updateAttribute(attributeName: string) {
    const value = this.attributes[attributeName].value;
    this.attributes[attributeName] = this.createAttribute(value);
  }

  selectAttributeForAssignment(attributeName: string) {
    this.selectedAttributeForAssignment = attributeName;
  }

  openAttributeAssignment(value: number, index: number) {
    if (this.selectedAttributeForAssignment) {
      // Assign to selected attribute
      this.attributes[this.selectedAttributeForAssignment] = this.createAttribute(value);
      this.generatedValues[index].used = true;
      this.selectedAttributeForAssignment = null;
    } else {
      // Find first empty attribute
      const emptyAttribute = this.attributeNames.find(attr => this.attributes[attr].value === 0);
      if (emptyAttribute) {
        this.attributes[emptyAttribute] = this.createAttribute(value);
        this.generatedValues[index].used = true;
      }
    }
  }

  addCustomRoll() {
    this.customRolls.push({ formula: '3d6*5', count: 1 });
  }

  removeCustomRoll(index: number) {
    this.customRolls.splice(index, 1);
  }

  updateCustomRoll(index: number, field: 'formula' | 'count', value: string | number) {
    if (field === 'formula' && typeof value === 'string') {
      this.customRolls[index].formula = value;
    } else if (field === 'count' && typeof value === 'number') {
      this.customRolls[index].count = value;
    }
  } generateAttribute(attributeName: string) {
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
