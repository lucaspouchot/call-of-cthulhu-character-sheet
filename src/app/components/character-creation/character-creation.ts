import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CharacterService } from '../../services/character.service';
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
    CommonModule, LanguageSwitcherComponent, DynamicTranslatePipe,
    BasicInfoStepComponent, OccupationStepComponent, CharacteristicsStepComponent,
    AgeModifiersStepComponent, SkillsStepComponent, PersonalDetailsStepComponent
  ],
  templateUrl: './character-creation.html',
  styleUrl: './character-creation.css'
})
export class CharacterCreation {
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

  constructor(
    private characterService: CharacterService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.characterSheet = this.createEmptyCharacterSheet();
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
