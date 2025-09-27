import { Injectable } from '@angular/core';

/**
 * Service for handling dice rolling functionality
 * Provides consistent dice rolling methods for the Call of Cthulhu system
 */
@Injectable({
  providedIn: 'root'
})
export class DiceService {

  /**
   * Roll a single d6 (1-6)
   */
  rollD6(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  /**
   * Roll multiple d6 dice
   */
  rollMultipleD6(count: number): number[] {
    const results: number[] = [];
    for (let i = 0; i < count; i++) {
      results.push(this.rollD6());
    }
    return results;
  }

  /**
   * Roll and sum multiple d6 dice
   */
  rollAndSumD6(count: number): number {
    return this.rollMultipleD6(count).reduce((sum, die) => sum + die, 0);
  }

  /**
   * Roll a d100 (1-100)
   */
  rollD100(): number {
    return Math.floor(Math.random() * 100) + 1;
  }

  /**
   * Roll a d10 (1-10)
   */
  rollD10(): number {
    return Math.floor(Math.random() * 10) + 1;
  }

  /**
   * Parse and execute dice formula
   * Supports: '3d6*5', '(2d6+6)*5', '(1d6+12)*5'
   */
  rollDiceFormula(formula: string): number {
    try {
      if (formula === '3d6*5') {
        return this.rollAndSumD6(3) * 5;
      } else if (formula === '(2d6+6)*5') {
        return (this.rollAndSumD6(2) + 6) * 5;
      } else if (formula === '(1d6+12)*5') {
        return (this.rollD6() + 12) * 5;
      } else {
        // Fallback to standard 3d6*5
        console.warn(`Unknown dice formula: ${formula}, using 3d6*5 as fallback`);
        return this.rollAndSumD6(3) * 5;
      }
    } catch (error) {
      console.error('Error rolling dice formula:', error);
      // Fallback to standard roll
      return this.rollAndSumD6(3) * 5;
    }
  }

  /**
   * Roll luck using the default formula: (2d6+6)*5
   */
  rollLuck(): number {
    return this.rollDiceFormula('(2d6+6)*5');
  }

  /**
   * Roll multiple luck values for young characters
   */
  rollMultipleLuck(count: number = 2): number[] {
    const results: number[] = [];
    for (let i = 0; i < count; i++) {
      results.push(this.rollLuck());
    }
    results.sort((a, b) => b - a);
    return results;
  }

  /**
   * Roll education improvement check
   */
  rollEducationCheck(currentEducation: number): { roll: number, success: boolean, bonus: number } {
    const roll = this.rollD100();
    const success = roll > currentEducation;
    const bonus = success ? this.rollD10() : 0;

    return { roll, success, bonus };
  }

  /**
   * Roll multiple education checks for age modifiers
   */
  rollMultipleEducationChecks(currentEducation: number, count: number): { roll: number, success: boolean, bonus: number }[] {
    const results = [];
    for (let i = 0; i < count; i++) {
      results.push(this.rollEducationCheck(currentEducation));
    }
    return results;
  }

  /**
   * Generate a pool of attribute values using specified formulas
   */
  generateAttributePool(formulas: { formula: string, count: number }[]): { value: number, used: boolean, formula: string }[] {
    const pool: { value: number, used: boolean, formula: string }[] = [];

    for (const rollConfig of formulas) {
      for (let i = 0; i < rollConfig.count; i++) {
        const value = this.rollDiceFormula(rollConfig.formula);
        pool.push({
          value,
          used: false,
          formula: rollConfig.formula
        });
      }
    }

    return pool;
  }
}