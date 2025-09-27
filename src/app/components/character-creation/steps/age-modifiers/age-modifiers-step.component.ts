import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { CharacterSheetCreate, StepValidation } from '../../../../models/character.model';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';
import { AgeModifierService, AgeModifiers } from '../../../../services/age-modifier.service';
import { DiceService } from '../../../../services/dice.service';

@Component({
  selector: 'app-age-modifiers-step',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, FormsModule, DynamicTranslatePipe],
  templateUrl: './age-modifiers-step.component.html',
  styleUrls: ['./age-modifiers-step.component.css']
})
export class AgeModifiersStepComponent implements OnInit, OnDestroy {
  @Input() characterSheet!: CharacterSheetCreate;
  @Output() characterSheetChange = new EventEmitter<CharacterSheetCreate>();
  @Output() stepValidation = new EventEmitter<StepValidation>();

  private destroy$ = new Subject<void>();
  Math = Math; // Expose Math to template

  ageModifiers!: AgeModifiers;
  remainingPenaltyPoints = 0;
  previousAge?: number;

  constructor(
    private ageModifierService: AgeModifierService,
    private diceService: DiceService
  ) {
    this.ageModifiers = this.ageModifierService.initializeAgeModifiers();
  }

  ngOnInit(): void {
    // Initialize previousAge to detect changes
    this.previousAge = this.characterSheet.age;
    this.calculateAgeModifiers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private calculateAgeModifiers(): void {
    if (this.characterSheet.age) {
      const currentEducation = this.characterSheet.education?.value || 50;
      const previousAgeModifiers = { ...this.ageModifiers };

      // Calculate new age modifiers but preserve existing rolls
      this.ageModifiers = this.ageModifierService.calculateAgeModifiers(this.characterSheet.age, currentEducation);
      this.remainingPenaltyPoints = this.ageModifierService.getRemainingPenaltyPoints(this.characterSheet.age, this.ageModifiers);

      // Preserve existing luck rolls and education rolls when possible
      this.preserveExistingRolls(previousAgeModifiers);

      // Initialize rolls only if needed
      this.initializeRollsIfNeeded();

      // Update previous age for next comparison
      this.previousAge = this.characterSheet.age;

      this.updateCharacterSheetAgeModifiers();
    }
  }

  private preserveExistingRolls(previousModifiers: AgeModifiers): void {
    // Preserve luck rolls if they exist and the luck roll count requirement hasn't changed
    const wasYoung = this.previousAge ? this.isAgeYoung(this.previousAge) : false;
    const isCurrentlyYoung = this.characterSheet.age ? (this.characterSheet.age >= 15 && this.characterSheet.age <= 19) : false;

    if (previousModifiers.luckRolls && previousModifiers.luckRolls.length > 0) {
      if (wasYoung === isCurrentlyYoung) {
        // Same luck roll requirement (1 or 2 rolls), keep existing rolls
        this.ageModifiers.luckRolls = [...previousModifiers.luckRolls];
        this.ageModifiers.selectedLuckValue = previousModifiers.selectedLuckValue;
      } else if (wasYoung && !isCurrentlyYoung) {
        // Changed from young (2 rolls) to adult/older (1 roll), keep selected value as single roll
        this.ageModifiers.luckRolls = [previousModifiers.selectedLuckValue || previousModifiers.luckRolls[0]];
        this.ageModifiers.selectedLuckValue = this.ageModifiers.luckRolls[0];
      }
      // If changed from adult to young, we'll need new rolls (handled in initializeRollsIfNeeded)
    }

    // Preserve education rolls if they exist and the education roll count hasn't changed
    if (previousModifiers.educationRolls && previousModifiers.educationRolls.length > 0) {
      const previousEducationRollCount = this.previousAge ? this.getEducationRollCount(this.previousAge) : 0;
      const currentEducationRollCount = this.getEducationRollCount(this.characterSheet.age || 25);

      if (previousEducationRollCount === currentEducationRollCount) {
        // Same number of education rolls required, keep existing rolls
        this.ageModifiers.educationRolls = [...previousModifiers.educationRolls];
      } else if (previousEducationRollCount > currentEducationRollCount) {
        // Fewer rolls needed now, keep only the first N rolls
        this.ageModifiers.educationRolls = previousModifiers.educationRolls.slice(0, currentEducationRollCount);
      }
      // If more rolls needed now, we'll generate additional ones in initializeRollsIfNeeded
    }
  }

  private initializeRollsIfNeeded(): void {
    // Initialize luck rolls if not already done or if we need more rolls
    const needsYoungLuckRolls = this.characterSheet.age && this.characterSheet.age >= 15 && this.characterSheet.age <= 19;

    if (!this.ageModifiers.luckRolls || this.ageModifiers.luckRolls.length === 0) {
      if (needsYoungLuckRolls) {
        // Young characters: roll twice
        this.ageModifiers.luckRolls = this.ageModifierService.rerollLuckValues(2);
      } else {
        // Adult/older characters: roll once
        this.ageModifiers.luckRolls = this.ageModifierService.rerollLuckValues(1);
      }
    } else if (needsYoungLuckRolls && this.ageModifiers.luckRolls.length === 1) {
      // Changed from adult to young, need to add a second roll
      const secondRoll = this.ageModifierService.rerollLuckValues(1)[0];
      this.ageModifiers.luckRolls.push(secondRoll);
      this.ageModifiers.luckRolls.sort((a, b) => b - a);
    }
    this.ageModifiers.selectedLuckValue = this.ageModifiers.luckRolls[0];

    // Initialize education rolls if not enough are present
    const requiredEducationRolls = this.getEducationRollCount(this.characterSheet.age || 25);
    const currentEducationRolls = this.ageModifiers.educationRolls?.length || 0;

    if (currentEducationRolls < requiredEducationRolls) {
      const currentEducation = this.characterSheet.education?.value || 50;
      const existingRolls = this.ageModifiers.educationRolls || [];
      const additionalRollsNeeded = requiredEducationRolls - currentEducationRolls;

      const newRolls = this.diceService.rollMultipleEducationChecks(currentEducation, additionalRollsNeeded);
      this.ageModifiers.educationRolls = [...existingRolls, ...newRolls];
    }
  }

  private isAgeYoung(age: number): boolean {
    return age >= 15 && age <= 19;
  }

  private getEducationRollCount(age: number): number {
    if (age >= 15 && age <= 19) return 0; // Young characters get no education bonus rolls
    if (age >= 20 && age <= 39) return 1; // Adult characters get 1 roll
    if (age >= 40) {
      // Older characters get 2 + 1 per decade after 40
      const decades = Math.floor((age - 40) / 10) + 1;
      return decades + 1;
    }
    return 0;
  }

  getAgeDisplayValue(): string {
    return this.characterSheet.age?.toString() ?? '';
  }

  onAgeChange(event: any): void {
    const newAge = parseInt(event.target.value, 10);
    if (isNaN(newAge)) {
      return;
    }

    this.characterSheet.age = newAge;
    this.calculateAgeModifiers();
    this.characterSheetChange.emit(this.characterSheet);
    this.validateStep();
  }

  private validateStep(): void {
    let isValid = true;
    const errors: string[] = [];

    if (!this.characterSheet.age) {
      isValid = false;
      errors.push('Age is required');
    } else {
      // Validate age modifiers completion
      if (!this.ageModifierService.validateAgeModifiers(this.characterSheet.age, this.ageModifiers)) {
        isValid = false;

        if (this.characterSheet.age >= 15 && this.characterSheet.age <= 19) {
          errors.push('Please select a luck value');
        } else if (this.characterSheet.age >= 40) {
          errors.push('Please allocate all penalty points among Strength, Constitution, and Dexterity');
        }
      }
    }

    this.stepValidation.emit({
      isValid: isValid,
      errors: errors
    });
  }

  getAgeCategory(): string {
    if (!this.characterSheet.age) return '';
    return this.ageModifierService.getAgeCategory(this.characterSheet.age);
  }

  // Unified methods for handling luck (all ages)
  selectLuckValue(value: number): void {
    this.ageModifiers.selectedLuckValue = value;
    this.updateCharacterSheetAgeModifiers();
    this.validateStep();
  }

  rerollLuckValues(): void {
    if (this.characterSheet.age && this.characterSheet.age >= 15 && this.characterSheet.age <= 19) {
      // Young characters: roll twice
      this.ageModifiers.luckRolls = this.ageModifierService.rerollLuckValues(2);
    } else {
      // Adult/older characters: roll once
      this.ageModifiers.luckRolls = this.ageModifierService.rerollLuckValues(1);
    }
    this.ageModifiers.selectedLuckValue = this.ageModifiers.luckRolls[0];
    this.updateCharacterSheetAgeModifiers();
    this.validateStep();
  }

  getLuckDisplayValue(): string {
    return this.ageModifiers.selectedLuckValue?.toString() || '';
  }

  onLuckInputChange(event: any): void {
    const newLuckValue = parseInt(event.target.value, 10);
    if (!isNaN(newLuckValue) && newLuckValue >= 15 && newLuckValue <= 90) {
      this.ageModifiers.selectedLuckValue = newLuckValue;
      this.updateCharacterSheetAgeModifiers();
      this.validateStep();
    }
  }

  isYoungCharacter(): boolean {
    return this.characterSheet.age ? (this.characterSheet.age >= 15 && this.characterSheet.age <= 19) : false;
  }

  // Methods for handling penalty distribution (older characters)
  adjustPenalty(attribute: 'strength' | 'constitution' | 'dexterity', delta: number): void {
    if (!this.characterSheet.age || this.characterSheet.age < 40) return;

    const currentValue = this.ageModifiers[attribute + 'Reduction' as keyof AgeModifiers] as number;
    const newValue = Math.max(0, currentValue + delta);

    // Check if we have enough penalty points to allocate
    if (delta > 0 && this.remainingPenaltyPoints < delta) return;

    (this.ageModifiers as any)[attribute + 'Reduction'] = newValue;
    this.remainingPenaltyPoints = this.ageModifierService.getRemainingPenaltyPoints(this.characterSheet.age, this.ageModifiers);
    this.updateCharacterSheetAgeModifiers();
    this.validateStep();
  }

  // Methods for handling education bonus re-rolls
  rerollEducationBonuses(): void {
    if (!this.characterSheet.age) return;

    const currentEducation = this.characterSheet.education?.value || 50;
    this.ageModifiers.educationRolls = this.ageModifierService.rerollEducationBonuses(this.characterSheet.age, currentEducation);
    this.updateCharacterSheetAgeModifiers();
    this.validateStep();
  }

  getTotalEducationBonus(): number {
    return this.ageModifierService.getTotalEducationBonus(this.ageModifiers);
  }

  getMaxPenaltyForAttribute(attribute: 'strength' | 'constitution' | 'dexterity'): number {
    if (!this.characterSheet.age) return 0;
    const totalPenalty = this.ageModifierService.getTotalAttributePenalty(this.characterSheet.age);
    const currentValue = this.ageModifiers[attribute + 'Reduction' as keyof AgeModifiers] as number;
    return currentValue + this.remainingPenaltyPoints;
  }



  // Methods for calculating final attribute values with modifiers
  getFinalAttributeValue(attributeKey: string): number {
    const baseValue = this.getBaseAttributeValue(attributeKey);
    const modifier = this.getAttributeModifier(attributeKey);
    return Math.max(0, baseValue + modifier);
  }

  getBaseAttributeValue(attributeKey: string): number {
    const attribute = (this.characterSheet as any)[attributeKey];
    return attribute?.value || 0;
  }

  getAttributeModifier(attributeKey: string): number {
    if (!this.characterSheet.age) return 0;

    switch (attributeKey) {
      case 'strength':
        return -this.ageModifiers.strengthReduction;
      case 'constitution':
        return -this.ageModifiers.constitutionReduction;
      case 'dexterity':
        return -this.ageModifiers.dexterityReduction;
      case 'size':
        return -this.ageModifiers.sizeReduction;
      case 'appearance':
        return -this.ageModifiers.appearanceReduction;
      case 'education':
        return this.getTotalEducationBonus() - this.ageModifiers.educationReduction;
      default:
        return 0;
    }
  }

  getAttributeModifierClass(attributeKey: string): string {
    const modifier = this.getAttributeModifier(attributeKey);
    if (modifier > 0) return 'text-green-600';
    if (modifier < 0) return 'text-red-600';
    return 'text-gray-600';
  }

  getAttributeCardClass(attributeKey: string): string {
    const modifier = this.getAttributeModifier(attributeKey);
    if (modifier > 0) return 'border-green-300 bg-green-50';
    if (modifier < 0) return 'border-red-300 bg-red-50';
    return 'border-gray-300 bg-white';
  }

  // Get all attributes for the summary
  getAllAttributes(): Array<{ key: string, name: string }> {
    return [
      { key: 'strength', name: 'Strength' },
      { key: 'constitution', name: 'Constitution' },
      { key: 'power', name: 'Power' },
      { key: 'dexterity', name: 'Dexterity' },
      { key: 'appearance', name: 'Appearance' },
      { key: 'size', name: 'Size' },
      { key: 'intelligence', name: 'Intelligence' },
      { key: 'education', name: 'Education' }
    ];
  }

  private updateCharacterSheetAgeModifiers(): void {
    this.characterSheet.ageModifiers = {
      strengthReduction: this.ageModifiers.strengthReduction,
      constitutionReduction: this.ageModifiers.constitutionReduction,
      dexterityReduction: this.ageModifiers.dexterityReduction,
      sizeReduction: this.ageModifiers.sizeReduction,
      appearanceReduction: this.ageModifiers.appearanceReduction,
      educationReduction: this.ageModifiers.educationReduction,
      educationBonus: this.getTotalEducationBonus(),
      selectedLuckValue: this.ageModifiers.selectedLuckValue
    };

    // Update luck value if selected
    if (this.ageModifiers.selectedLuckValue > 0) {
      this.characterSheet.luckValue = this.ageModifiers.selectedLuckValue;
    }

    this.characterSheetChange.emit(this.characterSheet);
  }
}