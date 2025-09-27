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

    // Restore existing age modifiers from character sheet if they exist
    this.restoreExistingAgeModifiers();

    // Calculate age modifiers (will preserve restored values)
    this.calculateAgeModifiers();

    this.validateStep();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private restoreExistingAgeModifiers(): void {
    if (this.characterSheet.ageModifiers) {
      const savedModifiers = this.characterSheet.ageModifiers;

      // Restore basic modifiers
      this.ageModifiers.strengthReduction = savedModifiers.strengthReduction;
      this.ageModifiers.constitutionReduction = savedModifiers.constitutionReduction;
      this.ageModifiers.dexterityReduction = savedModifiers.dexterityReduction;
      this.ageModifiers.sizeReduction = savedModifiers.sizeReduction;
      this.ageModifiers.appearanceReduction = savedModifiers.appearanceReduction;
      this.ageModifiers.educationReduction = savedModifiers.educationReduction;
      this.ageModifiers.selectedLuckValue = savedModifiers.selectedLuckValue;

      // Restore education rolls if they exist
      if (savedModifiers.educationRolls) {
        this.ageModifiers.educationRolls = [...savedModifiers.educationRolls];
      }

      // Restore luck rolls if they exist
      if (savedModifiers.luckRolls) {
        this.ageModifiers.luckRolls = [...savedModifiers.luckRolls];
      }
    }
  }

  calculateAgeModifiers(): void {
    if (this.characterSheet.age) {
      const currentEducation = this.characterSheet.education?.value || 50;
      const previousAgeModifiers = { ...this.ageModifiers };

      // Calculate new age modifiers
      const newModifiers = this.ageModifierService.calculateAgeModifiers(this.characterSheet.age, currentEducation);

      // If we have saved modifiers, restore penalty distributions for older characters
      if (this.characterSheet.ageModifiers && this.characterSheet.age >= 40) {
        const savedModifiers = this.characterSheet.ageModifiers;
        newModifiers.strengthReduction = savedModifiers.strengthReduction;
        newModifiers.constitutionReduction = savedModifiers.constitutionReduction;
        newModifiers.dexterityReduction = savedModifiers.dexterityReduction;
      }

      this.ageModifiers = newModifiers;
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
    // First try to restore from saved data in characterSheet
    const savedModifiers = this.characterSheet.ageModifiers;

    // Preserve luck rolls if they exist and the luck roll count requirement hasn't changed
    const wasYoung = this.previousAge ? this.isAgeYoung(this.previousAge) : false;
    const isCurrentlyYoung = this.characterSheet.age ? (this.characterSheet.age >= 15 && this.characterSheet.age <= 19) : false;

    // Use saved rolls from characterSheet if available, otherwise use previous modifiers
    const existingLuckRolls = savedModifiers?.luckRolls || previousModifiers.luckRolls;
    const existingSelectedLuck = savedModifiers?.selectedLuckValue || previousModifiers.selectedLuckValue;

    if (existingLuckRolls && existingLuckRolls.length > 0) {
      if (wasYoung === isCurrentlyYoung) {
        // Same luck roll requirement (1 or 2 rolls), keep existing rolls
        this.ageModifiers.luckRolls = [...existingLuckRolls];
        this.ageModifiers.selectedLuckValue = existingSelectedLuck;
      } else if (wasYoung && !isCurrentlyYoung) {
        // Changed from young (2 rolls) to adult/older (1 roll), keep selected value as single roll
        this.ageModifiers.luckRolls = [existingSelectedLuck || existingLuckRolls[0]];
        this.ageModifiers.selectedLuckValue = this.ageModifiers.luckRolls[0];
      }
      // If changed from adult to young, we'll need new rolls (handled in initializeRollsIfNeeded)
    }

    // Preserve education rolls if they exist and the education roll count hasn't changed
    const existingEducationRolls = savedModifiers?.educationRolls || previousModifiers.educationRolls;

    if (existingEducationRolls && existingEducationRolls.length > 0) {
      const previousEducationRollCount = this.previousAge ? this.getEducationRollCount(this.previousAge) : 0;
      const currentEducationRollCount = this.getEducationRollCount(this.characterSheet.age || 25);

      if (previousEducationRollCount === currentEducationRollCount) {
        // Same number of education rolls required, keep existing rolls
        this.ageModifiers.educationRolls = [...existingEducationRolls];
      } else if (previousEducationRollCount > currentEducationRollCount) {
        // Fewer rolls needed now, keep only the first N rolls
        this.ageModifiers.educationRolls = existingEducationRolls.slice(0, currentEducationRollCount);
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

  updateEducationRoll(index: number, field: 'roll' | 'bonus', event: any): void {
    if (!this.ageModifiers.educationRolls || !this.ageModifiers.educationRolls[index]) return;

    const roll = this.ageModifiers.educationRolls[index];
    const newValue = parseInt(event.target.value, 10);

    if (isNaN(newValue)) return;

    if (field === 'roll') {
      // Validate D100 range
      if (newValue < 1 || newValue > 100) return;
      roll.roll = newValue;

      // Recalculate success based on current education value
      const currentEducation = this.characterSheet.education?.value || 50;
      roll.success = newValue > currentEducation;

      // Reset bonus if failed
      if (!roll.success) {
        roll.bonus = 0;
      }
    } else if (field === 'bonus') {
      // Validate D10 range and only allow if successful
      if (newValue < 1 || newValue > 10 || !roll.success) return;
      roll.bonus = newValue;
    }

    this.updateCharacterSheetAgeModifiers();
    this.validateStep();
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
      selectedLuckValue: this.ageModifiers.selectedLuckValue,
      // Save individual rolls for persistence
      educationRolls: this.ageModifiers.educationRolls ? [...this.ageModifiers.educationRolls] : undefined,
      luckRolls: this.ageModifiers.luckRolls ? [...this.ageModifiers.luckRolls] : undefined
    };

    // Update luck value if selected
    if (this.ageModifiers.selectedLuckValue > 0) {
      this.characterSheet.luckValue = this.ageModifiers.selectedLuckValue;
    }

    this.characterSheetChange.emit(this.characterSheet);
  }
}