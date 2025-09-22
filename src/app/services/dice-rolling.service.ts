import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DiceRoll, DiceResult, DiceService } from '../models/dice.model';

@Injectable({
  providedIn: 'root'
})
export class DiceRollingService {
  private rollHistorySubject = new BehaviorSubject<DiceRoll[]>([]);
  public rollHistory$ = this.rollHistorySubject.asObservable();

  constructor() { }

  rollSkillCheck(skillValue: number, skillName: string, bonus: number = 0): DiceRoll {
    const target = skillValue + bonus;
    const roll = DiceService.rollPercentile();
    const check = DiceService.checkSuccess(roll, target);

    const diceRoll: DiceRoll = {
      type: 'skill',
      target: target,
      dice: '1d100',
      result: roll,
      success: check.success,
      criticalSuccess: check.criticalSuccess,
      criticalFailure: check.criticalFailure,
      fumble: check.fumble,
      timestamp: new Date(),
      description: `${skillName} check (${target}%)`
    };

    this.addToHistory(diceRoll);
    return diceRoll;
  }

  rollCharacteristicCheck(characteristicValue: number, characteristicName: string, bonus: number = 0): DiceRoll {
    const target = characteristicValue + bonus;
    const roll = DiceService.rollPercentile();
    const check = DiceService.checkSuccess(roll, target);

    const diceRoll: DiceRoll = {
      type: 'characteristic',
      target: target,
      dice: '1d100',
      result: roll,
      success: check.success,
      criticalSuccess: check.criticalSuccess,
      criticalFailure: check.criticalFailure,
      fumble: check.fumble,
      timestamp: new Date(),
      description: `${characteristicName} check (${target}%)`
    };

    this.addToHistory(diceRoll);
    return diceRoll;
  }

  rollDamage(damageFormula: string, weaponName?: string): DiceRoll {
    try {
      const result = DiceService.rollDice(damageFormula);

      const diceRoll: DiceRoll = {
        type: 'damage',
        dice: damageFormula,
        result: result.total,
        timestamp: new Date(),
        description: weaponName ? `${weaponName} damage` : 'Damage roll'
      };

      this.addToHistory(diceRoll);
      return diceRoll;
    } catch (error) {
      throw new Error(`Invalid damage formula: ${damageFormula}`);
    }
  }

  rollSanityLoss(sanityFormula: string, encounter?: string): DiceRoll {
    try {
      const result = DiceService.rollDice(sanityFormula);

      const diceRoll: DiceRoll = {
        type: 'sanity',
        dice: sanityFormula,
        result: result.total,
        timestamp: new Date(),
        description: encounter ? `Sanity loss from ${encounter}` : 'Sanity loss'
      };

      this.addToHistory(diceRoll);
      return diceRoll;
    } catch (error) {
      throw new Error(`Invalid sanity formula: ${sanityFormula}`);
    }
  }

  rollCustomDice(diceFormula: string, description?: string): DiceRoll {
    try {
      const result = DiceService.rollDice(diceFormula);

      const diceRoll: DiceRoll = {
        type: 'damage', // Using damage type for generic rolls
        dice: diceFormula,
        result: result.total,
        timestamp: new Date(),
        description: description || `Custom dice roll (${diceFormula})`
      };

      this.addToHistory(diceRoll);
      return diceRoll;
    } catch (error) {
      throw new Error(`Invalid dice formula: ${diceFormula}`);
    }
  }

  private addToHistory(roll: DiceRoll): void {
    const history = this.rollHistorySubject.value;
    const newHistory = [roll, ...history].slice(0, 50); // Keep last 50 rolls
    this.rollHistorySubject.next(newHistory);
  }

  clearHistory(): void {
    this.rollHistorySubject.next([]);
  }

  getHistory(): Observable<DiceRoll[]> {
    return this.rollHistory$;
  }
}