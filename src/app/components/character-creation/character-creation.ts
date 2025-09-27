import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { DiceRollingService } from '../../services/dice-rolling.service';
import { EntityTranslationService } from '../../services/entity-translation.service';
import { DiceService } from '../../services/dice.service';
import { AttributeService } from '../../services/attribute.service';
import { AgeModifierService, AgeModifiers } from '../../services/age-modifier.service';
import { OCCUPATIONS, Occupation, DEFAULT_SKILLS, SkillPointFormula } from '../../models/skills.model';
import { Attribute } from '../../models/character.model';
import { CharacterSheetCreate, StepValidation } from '../../models/character.model';
import { LanguageSwitcherComponent } from '../language-switcher/language-switcher';
import { DynamicTranslatePipe } from '../../pipes/dynamic-translate.pipe';
import {
  BasicInfoStepComponent,
  OccupationStepComponent,
  CharacteristicsStepComponent,
  AgeModifiersStepComponent,
  SkillsStepComponent,
  PersonalDetailsStepComponent
} from './steps';

@Component({
  selector: 'app-character-creation',
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, LanguageSwitcherComponent, DynamicTranslatePipe,
    BasicInfoStepComponent, OccupationStepComponent, CharacteristicsStepComponent,
    AgeModifiersStepComponent, SkillsStepComponent, PersonalDetailsStepComponent
  ],
  templateUrl: './character-creation.html',
  styleUrl: './character-creation.css'
})
export class CharacterCreation {
  characterForm: FormGroup;
  occupations = OCCUPATIONS;
  defaultSkills = DEFAULT_SKILLS;
  selectedOccupation: Occupation | null = null;
  currentStep = signal(1);
  totalSteps = 6; // Luck merged with Age Modifiers step

  // Character sheet data
  characterSheet!: CharacterSheetCreate;

  // Step validation tracking
  stepValidations: Record<number, StepValidation> = {
    1: { stepNumber: 1, isValid: false, errors: [] }, // Basic Info
    2: { stepNumber: 2, isValid: false, errors: [] }, // Occupation
    3: { stepNumber: 3, isValid: false, errors: [] }, // Characteristics
    4: { stepNumber: 4, isValid: false, errors: [] }, // Age Modifiers & Luck
    5: { stepNumber: 5, isValid: false, errors: [] }, // Personal Details
    6: { stepNumber: 6, isValid: false, errors: [] }  // Skills
  };

  // Skill points management
  creditRating = 0;
  occupationPointsTotal = 0;
  personalPointsTotal = 0;
  skillAssignments: { [skillId: string]: { occupation: number, personal: number } } = {};

  get occupationPointsSpent(): number {
    return Object.values(this.skillAssignments).reduce((total, assignment) => total + (assignment.occupation || 0), 0);
  }

  get personalPointsSpent(): number {
    return Object.values(this.skillAssignments).reduce((total, assignment) => total + (assignment.personal || 0), 0);
  }

  // Credit Rating calculation methods
  getCreditRatingInfo() {
    const cr = this.creditRating;

    if (cr === 0) {
      return {
        level: 'creditRating.levels.penniless.name',
        description: 'creditRating.levels.penniless.description',
        cash: 0.50,
        assets: 0,
        spendingLevel: 0.50
      };
    } else if (cr >= 1 && cr <= 9) {
      return {
        level: 'creditRating.levels.poor.name',
        description: 'creditRating.levels.poor.description',
        cash: cr * 1,
        assets: cr * 10,
        spendingLevel: 2
      };
    } else if (cr >= 10 && cr <= 49) {
      return {
        level: 'creditRating.levels.average.name',
        description: 'creditRating.levels.average.description',
        cash: cr * 2,
        assets: cr * 50,
        spendingLevel: 10
      };
    } else if (cr >= 50 && cr <= 89) {
      return {
        level: 'creditRating.levels.wealthy.name',
        description: 'creditRating.levels.wealthy.description',
        cash: cr * 5,
        assets: cr * 500,
        spendingLevel: 50
      };
    } else if (cr >= 90 && cr <= 98) {
      return {
        level: 'creditRating.levels.rich.name',
        description: 'creditRating.levels.rich.description',
        cash: cr * 20,
        assets: cr * 2000,
        spendingLevel: 250
      };
    } else if (cr === 99) {
      return {
        level: 'creditRating.levels.superRich.name',
        description: 'creditRating.levels.superRich.description',
        cash: 50000,
        assets: 5000000,
        spendingLevel: 5000
      };
    }

    return {
      level: 'creditRating.levels.unknown.name',
      description: 'creditRating.levels.unknown.description',
      cash: 0,
      assets: 0,
      spendingLevel: 0
    };
  }

  stepTitle = computed(() => {
    const step = this.currentStep();
    switch (step) {
      case 1: return 'character.creation.basic.title';
      case 2: return 'character.creation.occupation.title';
      case 3: return 'character.creation.attributes.title';
      case 4: return 'character.creation.ageModifiers.title';
      case 5: return 'character.creation.skills.title';
      case 6: return 'character.creation.personal.title';
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

  // Luck attribute (separate from main attributes)
  luck: Attribute = { value: 0, halfValue: 0, fifthValue: 0 };

  // Age modifiers management
  ageModifiers!: AgeModifiers;

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

  getSkillBaseValue(skillId: string): number {
    const skill = DEFAULT_SKILLS.find(s => s.id === skillId);
    return skill?.baseValue || 0;
  }

  constructor(
    private fb: FormBuilder,
    private characterService: CharacterService,
    private diceRollingService: DiceRollingService,
    private router: Router,
    private entityTranslationService: EntityTranslationService,
    private diceService: DiceService,
    private attributeService: AttributeService,
    private ageModifierService: AgeModifierService
  ) {
    this.characterForm = this.fb.group({
      name: ['', Validators.required],
      player: ['', Validators.required],
      occupation: ['', Validators.required],
      age: [25, [Validators.required, Validators.min(15), Validators.max(90)]],
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
    // Initialize character sheet with empty data
    this.characterSheet = this.createEmptyCharacterSheet();

    this.ageModifiers = this.ageModifierService.initializeAgeModifiers();
    this.attributes = this.attributeService.initializeAttributes(this.attributeNames);
    this.generateAllAttributes();
    this.generateLuck();

    // Synchronize initial form values with character sheet
    this.syncFormToCharacterSheet();

    // Validate all steps initially
    this.validateAllSteps();
  }

  createEmptyCharacterSheet(): CharacterSheetCreate {
    return {
      // Basic Information
      name: '',
      player: '',
      age: 25,
      residence: '',
      birthplace: '',

      // Personal Details
      backstory: '',
      traits: '',
      ideologyBeliefs: '',
      significantPeople: '',
      meaningfulLocations: '',
      treasuredPossessions: ''
    };
  }

  syncFormToCharacterSheet() {
    // Sync form values with character sheet
    this.characterSheet.name = this.characterForm.get('name')?.value || '';
    this.characterSheet.player = this.characterForm.get('player')?.value || '';
    this.characterSheet.age = this.characterForm.get('age')?.value || 25;
    this.characterSheet.sex = this.characterForm.get('sex')?.value || '';
    this.characterSheet.residence = this.characterForm.get('residence')?.value || '';
    this.characterSheet.birthplace = this.characterForm.get('birthplace')?.value || '';
    this.characterSheet.traits = this.characterForm.get('traits')?.value || '';
    this.characterSheet.ideologyBeliefs = this.characterForm.get('ideologyBeliefs')?.value || '';
    this.characterSheet.significantPeople = this.characterForm.get('significantPeople')?.value || '';
    this.characterSheet.meaningfulLocations = this.characterForm.get('meaningfulLocations')?.value || '';
    this.characterSheet.treasuredPossessions = this.characterForm.get('treasuredPossessions')?.value || '';
  }

  onGenerationMethodChange() {
    this.clearAllAttributes();
    this.generatedValues = [];
  }

  // Validation methods
  validateStep(stepNumber: number, characterSheet: CharacterSheetCreate): { isValid: boolean; errors: string[] } {
    switch (stepNumber) {
      case 1:
        return this.validateBasicInfo(characterSheet);
      case 2:
        return this.validateOccupation(characterSheet);
      case 3:
        return this.validateCharacteristics(characterSheet);
      case 4:
        return this.validateAgeModifiers(characterSheet);
      case 5:
        return this.validateSkills(characterSheet);
      case 6:
        return this.validatePersonalDetails(characterSheet);
      default:
        return { isValid: false, errors: ['Invalid step number'] };
    }
  }

  private validateBasicInfo(characterSheet: CharacterSheetCreate): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!characterSheet.name?.trim()) errors.push('Name is required');
    if (!characterSheet.player?.trim()) errors.push('Player is required');
    if (!characterSheet.age || characterSheet.age < 15 || characterSheet.age > 90) errors.push('Age must be between 15 and 90');
    if (!characterSheet.sex) errors.push('Sex is required');

    return { isValid: errors.length === 0, errors };
  }

  private validateOccupation(characterSheet: CharacterSheetCreate): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!characterSheet.occupation) errors.push('Occupation is required');

    return { isValid: errors.length === 0, errors };
  }

  private validateCharacteristics(characterSheet: CharacterSheetCreate): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    const attributeNames = ['strength', 'constitution', 'power', 'dexterity', 'appearance', 'size', 'intelligence', 'education'];
    attributeNames.forEach(attr => {
      const attribute = (characterSheet as any)[attr];
      if (!attribute || attribute.value <= 0) {
        errors.push(`${attr} must be greater than 0`);
      }
    });

    if (!characterSheet.luckValue || characterSheet.luckValue <= 0) {
      errors.push('Luck must be greater than 0');
    }

    return { isValid: errors.length === 0, errors };
  }

  private validateAgeModifiers(characterSheet: CharacterSheetCreate): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!characterSheet.age || characterSheet.age < 15 || characterSheet.age > 90) {
      errors.push('Age must be between 15 and 90');
    }

    return { isValid: errors.length === 0, errors };
  }

  private validateSkills(characterSheet: CharacterSheetCreate): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // During creation, skills validation is relaxed
    // Full validation will be done when finalizing the character

    return { isValid: errors.length === 0, errors };
  }

  private validatePersonalDetails(characterSheet: CharacterSheetCreate): { isValid: boolean; errors: string[] } {
    // Personal details are generally optional during creation
    return { isValid: true, errors: [] };
  }

  validateAllSteps() {
    // Each step component now manages its own validation
    // This method is kept for compatibility but steps self-validate via their own onStepValidation events
    // No action needed here since validation is handled by individual step components
  }

  canProceedToNextStep(): boolean {
    const currentStepValue = this.currentStep();
    return this.stepValidations[currentStepValue]?.isValid ?? false;
  }

  nextStep() {
    if (this.currentStep() < this.totalSteps && this.canProceedToNextStep()) {
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
    this.generatedValues = this.diceService.generateAttributePool(this.customRolls);

    // Clear all attributes
    this.attributeNames.forEach(attr => {
      this.attributes[attr] = this.attributeService.createAttribute(0);
    });
  }

  private rollDiceFormula(formula: string): number {
    return this.diceService.rollDiceFormula(formula);
  }

  generateSingleAttribute(attributeName: string) {
    // Use the first formula from custom rolls or default
    const formula = this.customRolls.length > 0 ? this.customRolls[0].formula : '3d6*5';
    const value = this.rollDiceFormula(formula);
    this.attributes[attributeName] = this.attributeService.createAttribute(value);
  }

  // Luck generation methods
  generateLuck() {
    const value = this.diceService.rollLuck();
    this.luck = this.attributeService.createAttribute(value);
  }

  clearLuck() {
    this.luck = this.attributeService.createAttribute(0);
  }

  updateLuck() {
    const value = this.luck.value;
    this.luck = this.attributeService.createAttribute(value);
  }

  clearAllAttributes() {
    this.attributeNames.forEach(attr => {
      this.attributes[attr] = this.attributeService.createAttribute(0);
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

    this.attributes[attributeName] = this.attributeService.createAttribute(0);
  }

  updateAttribute(attributeName: string) {
    const value = this.attributes[attributeName].value;
    this.attributes[attributeName] = this.attributeService.createAttribute(value);
  }

  selectAttributeForAssignment(attributeName: string) {
    this.selectedAttributeForAssignment = attributeName;
  }

  openAttributeAssignment(value: number, index: number) {
    if (this.selectedAttributeForAssignment) {
      // Assign to selected attribute
      this.attributes[this.selectedAttributeForAssignment] = this.attributeService.createAttribute(value);
      this.generatedValues[index].used = true;
      this.selectedAttributeForAssignment = null;
    } else {
      // Find first empty attribute
      const emptyAttribute = this.attributeNames.find(attr => this.attributes[attr].value === 0);
      if (emptyAttribute) {
        this.attributes[emptyAttribute] = this.attributeService.createAttribute(value);
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
  }

  generateAttribute(attributeName: string) {
    // Roll 3d6 * 5 for each attribute (standard CoC character generation)
    const total = this.diceService.rollDiceFormula('3d6*5');
    this.attributes[attributeName] = this.attributeService.createAttribute(total);
  }

  onOccupationChange(occupation?: Occupation | null) {
    if (occupation) {
      // Occupation provided from component event
      this.selectedOccupation = occupation;
      this.characterForm.patchValue({ occupation: occupation.id });
    } else {
      // Get from form (original behavior)
      const occupationId = this.characterForm.get('occupation')?.value;
      this.selectedOccupation = this.occupations.find(occ => occ.id === occupationId) || null;
    }

    if (this.selectedOccupation) {
      this.calculateSkillPoints();
      this.initializeSkillAssignments();
      // Set default credit rating to minimum
      this.creditRating = this.selectedOccupation.creditRating.min;
    }
  }

  calculateSkillPoints() {
    if (!this.selectedOccupation) return;

    // Calculate occupation skill points
    this.occupationPointsTotal = this.calculatePointsFromFormula(this.selectedOccupation.occupationSkillPoints);

    // Calculate personal skill points  
    this.personalPointsTotal = this.calculatePointsFromFormula(this.selectedOccupation.personalSkillPoints);
  }

  private calculatePointsFromFormula(formula: SkillPointFormula): number {
    if (formula.type === 'simple') {
      const f = formula.formulas[0];
      const attributeValue = this.getAttributeValue(f.attribute);
      return attributeValue * f.multiplier;
    } else if (formula.type === 'choice') {
      // Take the best option
      let maxPoints = 0;
      for (const f of formula.formulas) {
        const attributeValue = this.getAttributeValue(f.attribute);
        const points = attributeValue * f.multiplier;
        maxPoints = Math.max(maxPoints, points);
      }
      return maxPoints;
    } else if (formula.type === 'composite') {
      // Required formulas (always included)
      let totalPoints = 0;
      for (const f of formula.formulas) {
        const attributeValue = this.getAttributeValue(f.attribute);
        totalPoints += attributeValue * f.multiplier;
      }

      // Choice formulas (take the best option)
      if (formula.choiceFormulas && formula.choiceFormulas.length > 0) {
        let maxChoicePoints = 0;
        for (const f of formula.choiceFormulas) {
          const attributeValue = this.getAttributeValue(f.attribute);
          const points = attributeValue * f.multiplier;
          maxChoicePoints = Math.max(maxChoicePoints, points);
        }
        totalPoints += maxChoicePoints;
      }

      return totalPoints;
    }
    return 0;
  }

  private getAttributeValue(attributeName: string): number {
    return this.attributes[attributeName]?.value || 0;
  }

  private initializeSkillAssignments() {
    this.skillAssignments = {};
    // Initialize all skills with 0 assigned points
    DEFAULT_SKILLS.forEach(skill => {
      this.skillAssignments[skill.id] = { occupation: 0, personal: 0 };
    });
  }

  assignSkillPoints(skillId: string, type: 'occupation' | 'personal', points: number) {
    if (!this.skillAssignments[skillId]) {
      this.skillAssignments[skillId] = { occupation: 0, personal: 0 };
    }

    this.skillAssignments[skillId][type] = points || 0;
  }

  getSkillTotal(skillId: string): number {
    const skill = DEFAULT_SKILLS.find(s => s.id === skillId);
    if (!skill) return 0;

    const assignments = this.skillAssignments[skillId] || { occupation: 0, personal: 0 };
    return skill.baseValue + assignments.occupation + assignments.personal;
  }

  canAssignToSkill(skillId: string, type: 'occupation' | 'personal'): boolean {
    if (type === 'occupation') {
      return this.selectedOccupation?.occupationSkills.includes(skillId) || false;
    }
    return true; // Personal points can be assigned to any skill
  }

  getRemainingPoints(type: 'occupation' | 'personal'): number {
    if (type === 'occupation') {
      return this.occupationPointsTotal - this.occupationPointsSpent;
    }
    return this.personalPointsTotal - this.personalPointsSpent;
  }

  getFormulaDescription(formula: SkillPointFormula): string {
    if (formula.type === 'simple') {
      const f = formula.formulas[0];
      return `${f.attribute.toUpperCase()} × ${f.multiplier}`;
    } else if (formula.type === 'choice') {
      const formulas = formula.formulas.map(f => `${f.attribute.toUpperCase()} × ${f.multiplier}`);
      return `Meilleur de: ${formulas.join(' ou ')}`;
    } else if (formula.type === 'composite') {
      const required = formula.formulas.map(f => `${f.attribute.toUpperCase()} × ${f.multiplier}`).join(' + ');
      if (formula.choiceFormulas && formula.choiceFormulas.length > 0) {
        const choices = formula.choiceFormulas.map(f => `${f.attribute.toUpperCase()} × ${f.multiplier}`);
        return `${required} + (${choices.join(' ou ')})`;
      }
      return required;
    }
    return '';
  }

  calculateDerivedStats() {
    const age = this.characterForm.get('age')?.value || 25;
    return this.attributeService.calculateDerivedStats(this.attributes, this.luck, age);
  }

  private rollLuck(): number {
    return this.diceService.rollLuck();
  }

  // Age modifier methods
  calculateAgeModifiers() {
    const age = this.characterForm.get('age')?.value || 25;
    const currentEducation = this.attributes['education']?.value || 50;

    this.ageModifiers = this.ageModifierService.calculateAgeModifiers(age, currentEducation);
  }

  rollEducationBonuses() {
    const age = this.characterForm.get('age')?.value || 25;
    const currentEducation = this.attributes['education']?.value || 50;

    this.ageModifiers.educationRolls = this.ageModifierService.rerollEducationBonuses(age, currentEducation);
  }

  getTotalEducationBonus(): number {
    return this.ageModifierService.getTotalEducationBonus(this.ageModifiers);
  }

  getTotalAttributePenalty(): number {
    const age = this.characterForm.get('age')?.value || 25;
    return this.ageModifierService.getTotalAttributePenalty(age);
  }

  getRemainingPenaltyPoints(): number {
    const age = this.characterForm.get('age')?.value || 25;
    return this.ageModifierService.getRemainingPenaltyPoints(age, this.ageModifiers);
  }

  canAssignPenalty(): boolean {
    const age = this.characterForm.get('age')?.value || 25;
    return this.ageModifierService.canAssignPenalty(age, this.ageModifiers);
  }

  onAgeChange(age?: number) {
    const ageValue = age || this.characterForm.get('age')?.value;

    // Enforce age limits
    if (ageValue !== null && ageValue !== undefined) {
      if (ageValue < 15) {
        this.characterForm.get('age')?.setValue(15);
        return;
      }
      if (ageValue > 90) {
        this.characterForm.get('age')?.setValue(90);
        return;
      }
    }

    this.calculateAgeModifiers();
  }

  selectLuckValue(value: number) {
    this.ageModifiers.selectedLuckValue = value;
    this.luck = this.attributeService.createAttribute(value);
  }

  applyAgeModifiers() {
    const totalEducationBonus = this.getTotalEducationBonus();

    const modifiers = {
      strengthReduction: this.ageModifiers.strengthReduction,
      constitutionReduction: this.ageModifiers.constitutionReduction,
      dexterityReduction: this.ageModifiers.dexterityReduction,
      appearanceReduction: this.ageModifiers.appearanceReduction,
      educationBonus: totalEducationBonus
    };

    this.attributes = this.attributeService.applyAgeModifiers(this.attributes, modifiers);
  }

  createCharacter() {
    // Validate that we have a complete character sheet ready for creation
    const allStepsValid = Object.values(this.stepValidations).every(validation => validation.isValid);

    if (allStepsValid && this.characterSheet) {
      // The service will handle all calculations and initialization of derived stats
      const characterId = this.characterService.createCharacter(this.characterSheet);
      this.router.navigate(['/character', characterId]);
    } else {
      console.error('Cannot create character: validation failed or missing data');
      // Optionally show user feedback about which steps need completion
    }
  }

  // Step event handlers
  onCharacterSheetChange(updatedCharacterSheet: CharacterSheetCreate) {
    this.characterSheet = { ...updatedCharacterSheet };
    this.validateAllSteps();
  }

  onStepValidation(validation: StepValidation) {
    // Assign the current step number to the validation (since child components no longer know their step number)
    const currentStepNumber = this.currentStep();
    const validationWithStepNumber: StepValidation = {
      ...validation,
      stepNumber: currentStepNumber
    };
    this.stepValidations[currentStepNumber] = validationWithStepNumber;
  }
}
