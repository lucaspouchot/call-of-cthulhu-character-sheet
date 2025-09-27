import { Injectable } from '@angular/core';
import { DiceService } from './dice.service';

export interface AgeModifiers {
  strengthReduction: number;
  constitutionReduction: number;
  dexterityReduction: number;
  sizeReduction: number;
  appearanceReduction: number;
  educationReduction: number;
  educationBonusRolls: number;
  educationRolls: { roll: number, success: boolean, bonus: number }[];
  luckRolls: number[];
  selectedLuckValue: number;
}

/**
 * Service for handling age-based character modifications
 * Implements Call of Cthulhu age modifier rules
 */
@Injectable({
  providedIn: 'root'
})
export class AgeModifierService {

  constructor(private diceService: DiceService) { }

  /**
   * Initialize age modifiers structure
   */
  initializeAgeModifiers(): AgeModifiers {
    return {
      strengthReduction: 0,
      constitutionReduction: 0,
      dexterityReduction: 0,
      sizeReduction: 0,
      appearanceReduction: 0,
      educationReduction: 0,
      educationBonusRolls: 0,
      educationRolls: [],
      luckRolls: [],
      selectedLuckValue: 0
    };
  }

  /**
   * Calculate age modifiers based on character age
   */
  calculateAgeModifiers(age: number, currentEducation: number = 50): AgeModifiers {
    const modifiers = this.initializeAgeModifiers();

    // Validate age range
    if (age < 15 || age > 90) {
      return modifiers;
    }

    if (age >= 15 && age <= 19) {
      // Young character penalties and luck bonus
      // Remove 5 points from Strength, Size, and Education
      modifiers.strengthReduction = 5;
      modifiers.sizeReduction = 5;
      modifiers.educationReduction = 5;
      modifiers.educationBonusRolls = 0;
      modifiers.appearanceReduction = 0;
      // Roll luck twice, player chooses
      modifiers.luckRolls = this.diceService.rollMultipleLuck(2);
      modifiers.selectedLuckValue = Math.max(...modifiers.luckRolls);
    } else if (age >= 20 && age <= 39) {
      // Young adult - one education check
      modifiers.educationBonusRolls = 1;
      modifiers.educationRolls = this.diceService.rollMultipleEducationChecks(currentEducation, 1);
    } else if (age >= 40) {
      // Older characters - penalties and education bonuses
      const decades = Math.floor((age - 40) / 10) + 1;
      modifiers.educationBonusRolls = decades + 1; // Base 2 for 40-49, +1 per decade after
      modifiers.appearanceReduction = decades * 5;
      modifiers.educationRolls = this.diceService.rollMultipleEducationChecks(currentEducation, modifiers.educationBonusRolls);

      // Physical attribute penalties (to be distributed)
      const totalPenalty = decades * 5;
      // These will be distributed by the user among STR, CON, DEX
      modifiers.strengthReduction = 0;
      modifiers.constitutionReduction = 0;
      modifiers.dexterityReduction = 0;
    }

    return modifiers;
  }

  /**
   * Get total education bonus from successful rolls
   */
  getTotalEducationBonus(modifiers: AgeModifiers): number {
    return modifiers.educationRolls.reduce((total, roll) => total + roll.bonus, 0);
  }

  /**
   * Get total attribute penalty for older characters (STR, CON, DEX)
   */
  getTotalAttributePenalty(age: number): number {
    if (age >= 40) {
      const decades = Math.floor((age - 40) / 10) + 1;
      return decades * 5;
    }
    return 0;
  }

  /**
   * Get fixed penalties for young characters
   */
  getYoungCharacterPenalties(): { strength: number, size: number, education: number } {
    return { strength: 5, size: 5, education: 5 };
  }

  /**
   * Get remaining penalty points to assign
   */
  getRemainingPenaltyPoints(age: number, modifiers: AgeModifiers): number {
    const total = this.getTotalAttributePenalty(age);
    const assigned = modifiers.strengthReduction +
      modifiers.constitutionReduction +
      modifiers.dexterityReduction;
    return total - assigned;
  }

  /**
   * Check if penalty points can still be assigned
   */
  canAssignPenalty(age: number, modifiers: AgeModifiers): boolean {
    return this.getRemainingPenaltyPoints(age, modifiers) > 0;
  }

  /**
   * Validate age modifier completion
   */
  validateAgeModifiers(age: number, modifiers: AgeModifiers): boolean {
    // For young characters, ensure luck value is selected
    if (age >= 15 && age <= 19) {
      return modifiers.selectedLuckValue > 0;
    }

    // For older characters, ensure penalty distribution is complete
    if (age >= 40) {
      return this.getRemainingPenaltyPoints(age, modifiers) === 0;
    }

    // For adults, no special validation needed
    return true;
  }

  /**
   * Get appearance penalty for given age
   */
  getAppearancePenalty(age: number): number {
    if (age >= 40) {
      const decades = Math.floor((age - 40) / 10) + 1;
      return decades * 5;
    }
    return 0;
  }

  /**
   * Get age category description
   */
  getAgeCategory(age: number): 'young' | 'adult' | 'older' {
    if (age >= 15 && age <= 19) return 'young';
    if (age >= 20 && age <= 39) return 'adult';
    return 'older';
  }

  /**
   * Re-roll education bonuses
   */
  rerollEducationBonuses(age: number, currentEducation: number): { roll: number, success: boolean, bonus: number }[] {
    const modifiers = this.calculateAgeModifiers(age, currentEducation);
    return modifiers.educationRolls;
  }

  /**
   * Re-roll luck values for young characters
   */
  rerollLuckValues(count: number = 2): number[] {
    return this.diceService.rollMultipleLuck(count);
  }

  /**
   * Apply age-based movement penalties
   */
  applyMovementPenalty(baseMovement: number, age: number): number {
    // Apply age penalty: -1 per decade above 30
    const agePenalty = Math.max(0, Math.floor((age - 30) / 10));
    return Math.max(1, baseMovement - agePenalty); // Minimum MOV of 1
  }
}