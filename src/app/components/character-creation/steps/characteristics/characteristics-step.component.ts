import { DiceService } from './../../../../services/dice.service';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { CharacterSheetCreate, StepValidation } from '../../../../models/character.model';
import { OCCUPATIONS } from '../../../../models/skills.model';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';

type Characteristic = { key: string, min: number, max: number, current: number | null, pool?: 'A' | 'B' };

@Component({
  selector: 'app-characteristics-step',
  standalone: true,
  imports: [CommonModule, DynamicTranslatePipe],
  templateUrl: './characteristics-step.component.html',
  styleUrls: ['./characteristics-step.component.css']
})
export class CharacteristicsStepComponent implements OnInit, OnDestroy {
  @Input() characterSheet!: CharacterSheetCreate;
  @Output() characterSheetChange = new EventEmitter<CharacterSheetCreate>();
  @Output() stepValidation = new EventEmitter<StepValidation>();

  private destroy$ = new Subject<void>();

  // Generation methods
  generationMethod: 'rolling' | 'quickfire' = 'quickfire';

  // Rolling method dice pools
  rollingPoolA: number[] = []; // 5 × 3d6×5 for wide range characteristics
  rollingPoolB: number[] = []; // 3 × (2d6+6)×5 for higher range characteristics

  // Quick Fire method fixed values
  quickFireValues: number[] = [80, 70, 60, 60, 50, 50, 50, 40];

  // Selection system for Rolling Method
  selectedRollIndex: number | null = null;
  selectedRollPool: 'A' | 'B' | null = null;

  // Selection system for Quick Fire Method
  selectedQuickFireIndex: number | null = null;

  characteristics: Characteristic[] = [
    { key: 'appearance', min: 15, max: 90, current: null, pool: 'A' },
    { key: 'constitution', min: 15, max: 90, current: null, pool: 'A' },
    { key: 'dexterity', min: 15, max: 90, current: null, pool: 'A' },
    { key: 'education', min: 40, max: 90, current: null, pool: 'B' },
    { key: 'intelligence', min: 40, max: 90, current: null, pool: 'B' },
    { key: 'power', min: 15, max: 90, current: null, pool: 'A' },
    { key: 'size', min: 40, max: 90, current: null, pool: 'B' },
    { key: 'strength', min: 15, max: 90, current: null, pool: 'A' }
  ];

  constructor(
    private diceService: DiceService
  ) { }

  ngOnInit(): void {
    this.initializeCharacteristics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeCharacteristics(): void {
    // Restore the generation method from characterSheet if it exists
    if (this.characterSheet.generationMethod) {
      this.generationMethod = this.characterSheet.generationMethod;
    }

    // Load existing characteristic values from characterSheet
    this.characteristics.forEach(characteristic => {
      const attributeKey = characteristic.key as keyof CharacterSheetCreate;
      const existingAttribute = this.characterSheet[attributeKey] as any;

      if (existingAttribute?.value) {
        characteristic.current = existingAttribute.value;
      }
    });

    // Check if we have any assigned characteristics to determine if we need to restore pools
    const hasAssignedCharacteristics = this.characteristics.some(c => c.current !== null);

    if (hasAssignedCharacteristics && this.generationMethod === 'rolling') {
      // If we have assigned characteristics but no pools, we need to reconstruct the pools
      if (this.rollingPoolA.length === 0 && this.rollingPoolB.length === 0) {
        this.generateRollingPools();
        this.removeAssignedValuesFromPools();
      }
    } else if (hasAssignedCharacteristics && this.generationMethod === 'quickfire') {
      // Remove assigned values from quick fire values
      this.removeAssignedValuesFromQuickFire();
    }

    // Validate the step with current state
    this.validateStep();
  }

  private validateStep(): void {
    this.stepValidation.emit({
      isValid: this.characteristics.every(c => c.current !== null && c.current >= c.min && c.current <= c.max),
      errors: []
    });
  }

  // Method selection
  setGenerationMethod(method: 'rolling' | 'quickfire'): void {
    // Only reset if no characteristics have been assigned yet
    const hasAssignedCharacteristics = this.characteristics.some(c => c.current !== null);

    this.generationMethod = method;

    // Save the generation method in the character sheet
    this.characterSheet.generationMethod = method;
    this.characterSheetChange.emit(this.characterSheet);

    if (!hasAssignedCharacteristics) {
      this.resetCharacteristics();
    }

    if (method === 'rolling') {
      this.generateRollingPools();
      if (hasAssignedCharacteristics) {
        this.removeAssignedValuesFromPools();
      }
    } else if (method === 'quickfire' && hasAssignedCharacteristics) {
      this.removeAssignedValuesFromQuickFire();
    }
  }

  onCharacteristicInputChange(event: any, characteristicKey: string): void {
    const inputValue = parseInt(event.target.value, 10);
    const characteristic = this.characteristics.find(c => c.key === characteristicKey);
    if (!characteristic) return;

    // Update the characteristic's current value
    characteristic.current = inputValue;

    // Update the characterSheet with the new value
    this.updateCharacterSheetAttribute(characteristicKey, inputValue);

    // Emit the changes to the parent component
    this.characterSheetChange.emit(this.characterSheet);

    // Validate the step after input change
    this.validateStep();
  }

  // Rolling Method: Generate dice pools
  generateRollingPools(): void {
    // Don't regenerate if pools already have values (preserve existing rolls)
    if (this.rollingPoolA.length > 0 || this.rollingPoolB.length > 0) {
      return;
    }

    // Clear any current selection
    this.selectedRollIndex = null;
    this.selectedRollPool = null;

    // Generate 5 × 3d6×5 for wide range characteristics
    this.rollingPoolA = [];
    for (let i = 0; i < 5; i++) {
      const roll = this.diceService.rollDiceFormula('3d6*5');
      this.rollingPoolA.push(roll);
    }

    // Generate 3 × (2d6+6)×5 for higher range characteristics
    this.rollingPoolB = [];
    for (let i = 0; i < 3; i++) {
      const roll = this.diceService.rollDiceFormula('(2d6+6)*5');
      this.rollingPoolB.push(roll);
    }

    // Sort pools from highest to lowest
    this.rollingPoolA.sort((a, b) => b - a);
    this.rollingPoolB.sort((a, b) => b - a);
  }

  // Quick Fire Method: Click-based selection
  selectQuickFireValue(valueIndex: number): void {
    if (this.selectedQuickFireIndex === valueIndex) {
      // Deselect if clicking the same value
      this.selectedQuickFireIndex = null;
    } else {
      // Select the clicked value
      this.selectedQuickFireIndex = valueIndex;
    }
  }

  // Quick Fire Method: Assign selected value to characteristic
  assignSelectedQuickFireValue(characteristicKey: string): void {
    if (this.selectedQuickFireIndex === null) {
      return; // No value selected
    }

    if (this.selectedQuickFireIndex >= 0 && this.selectedQuickFireIndex < this.quickFireValues.length) {
      const value = this.quickFireValues[this.selectedQuickFireIndex];
      const characteristic = this.characteristics.find(c => c.key === characteristicKey)!;

      if (value < characteristic.min || value > characteristic.max) {
        return; // Value is out of bounds
      }

      // Check if characteristic already has a value and return it if needed
      let valueToAddBack: number | null = null;
      if (characteristic.current && characteristic.current >= characteristic.min && characteristic.current <= characteristic.max) {
        valueToAddBack = characteristic.current;
      }
      characteristic.current = value;

      // Update the characterSheet with the new value
      this.updateCharacterSheetAttribute(characteristicKey, value);

      this.quickFireValues.splice(this.selectedQuickFireIndex, 1);
      if (valueToAddBack !== null) {
        this.quickFireValues.push(valueToAddBack);
      }
      this.quickFireValues.sort((a, b) => b - a); // Keep sorted descending

      // Clear selection
      this.selectedQuickFireIndex = null;

      // Emit the changes to the parent component
      this.characterSheetChange.emit(this.characterSheet);

      // Validate the step
      this.validateStep();
    }
  }

  // Quick Fire Method: Return value from characteristic back to available values
  returnQuickFireValue(characteristicKey: string): void {
    const characteristic = this.characteristics.find(c => c.key === characteristicKey)!;

    // Only allow return if the characteristic is assigned and has a value > minimum
    if (characteristic.current && characteristic.current >= characteristic.min && characteristic.current <= characteristic.max) {
      // Return the value to available values
      this.quickFireValues.push(characteristic.current);
      characteristic.current = null;

      // Update the characterSheet
      this.updateCharacterSheetAttribute(characteristicKey, null);

      this.quickFireValues.sort((a, b) => b - a); // Keep sorted descending

      // Emit the changes to the parent component
      this.characterSheetChange.emit(this.characterSheet);

      // Validate the step
      this.validateStep();
    }
  }

  // Quick Fire Method: Check if we can assign to a characteristic
  canAssignQuickFireValue(characteristicKey: string): boolean {
    return this.selectedQuickFireIndex !== null;
  }

  // Rolling Method: Assign from pools
  assignRollingValue(characteristic: string, valueIndex: number): void {
    const targetPool = this.characteristics.find(c => c.key === characteristic)?.pool === 'A' ? this.rollingPoolA : this.rollingPoolB;

    if (valueIndex >= 0 && valueIndex < targetPool.length) {
      const value = targetPool[valueIndex];
      this.characteristics.find(c => c.key === characteristic)!.current = value;
      targetPool.splice(valueIndex, 1);
    }
  }

  // Reset all characteristics
  resetCharacteristics(): void {
    this.characteristics.forEach(c => c.current = null);
    this.rollingPoolA = [];
    this.rollingPoolB = [];
    this.quickFireValues = [80, 70, 60, 60, 50, 50, 50, 40];

    // Reset selection
    this.selectedRollIndex = null;
    this.selectedRollPool = null;
    this.selectedQuickFireIndex = null;
  }

  // Get occupation-related characteristics (only occupation, not personal)
  getOccupationRelatedCharacteristics(): string[] {
    if (!this.characterSheet.occupation) return [];

    const occupation = OCCUPATIONS.find(occ => occ.id === this.characterSheet.occupation);
    if (!occupation) return [];

    const relatedAttributes: string[] = [];

    // Get attributes from occupation skill points formula
    if (occupation.occupationSkillPoints.formulas) {
      occupation.occupationSkillPoints.formulas.forEach(formula => {
        if (!relatedAttributes.includes(formula.attribute)) {
          relatedAttributes.push(formula.attribute);
        }
      });
    }

    // Get attributes from choice formulas
    if (occupation.occupationSkillPoints.choiceFormulas) {
      occupation.occupationSkillPoints.choiceFormulas.forEach(formula => {
        if (!relatedAttributes.includes(formula.attribute)) {
          relatedAttributes.push(formula.attribute);
        }
      });
    }

    // NOTE: We don't include personalSkillPoints attributes as they are not occupation-specific

    return relatedAttributes;
  }

  // Get display value for characteristic (show "-" if not assigned, value if assigned)
  getCharacteristicDisplayValue(characteristicKey: string): string {
    return this.characteristics.find(c => c.key === characteristicKey)?.current?.toString() || '-';
  }

  // Get occupation characteristics as chips for display
  getOccupationCharacteristicsChips(): Array<{ label: string, type: 'fixed' | 'choice' }> {
    if (!this.characterSheet.occupation) return [];

    const occupation = OCCUPATIONS.find(occ => occ.id === this.characterSheet.occupation);
    if (!occupation) return [];

    const chips: Array<{ label: string, type: 'fixed' | 'choice' }> = [];

    // Add fixed formulas as individual chips
    if (occupation.occupationSkillPoints.formulas) {
      occupation.occupationSkillPoints.formulas.forEach(formula => {
        chips.push({
          label: formula.attribute,
          type: 'fixed'
        });
      });
    }

    // Add choice formulas as a single choice chip
    if (occupation.occupationSkillPoints.choiceFormulas) {
      const choiceAttributes = occupation.occupationSkillPoints.choiceFormulas.map(f => f.attribute);
      if (choiceAttributes.length > 1) {
        chips.push({
          label: `${choiceAttributes.join(' ou ')}`,
          type: 'choice'
        });
      } else {
        chips.push({
          label: choiceAttributes[0],
          type: 'fixed'
        });
      }
    }

    return chips;
  }

  // Click-based selection system for Rolling Method
  selectRoll(pool: 'A' | 'B', index: number): void {
    if (this.selectedRollPool === pool && this.selectedRollIndex === index) {
      // Deselect if clicking the same roll
      this.selectedRollIndex = null;
      this.selectedRollPool = null;
    } else {
      // Select the clicked roll
      this.selectedRollIndex = index;
      this.selectedRollPool = pool;
    }
  }

  assignSelectedRollToCharacteristic(characteristicKey: string): void {
    if (this.selectedRollIndex === null || this.selectedRollPool === null) {
      return; // No roll selected
    }

    const targetPool = this.selectedRollPool === 'A' ? this.rollingPoolA : this.rollingPoolB;
    const value = targetPool[this.selectedRollIndex];
    const characteristic = this.characteristics.find(c => c.key === characteristicKey)!;
    let valueToAddBack: number | null = null;

    if (value < characteristic.min || value > characteristic.max || characteristic.pool !== this.selectedRollPool) {
      return; // Value is out of bounds or characteristic doesn't belong to selected pool
    }

    if (characteristic.current && characteristic.current >= characteristic.min && characteristic.current <= characteristic.max) {
      valueToAddBack = characteristic.current;
    }
    characteristic.current = value;

    // Update the characterSheet with the new value
    this.updateCharacterSheetAttribute(characteristicKey, value);

    // Remove the used value from the pool
    targetPool.splice(this.selectedRollIndex, 1);
    if (valueToAddBack !== null) {
      targetPool.push(valueToAddBack);
    }
    targetPool.sort((a, b) => b - a); // Keep sorted descending

    // Clear selection
    this.selectedRollIndex = null;
    this.selectedRollPool = null;

    // Emit the changes to the parent component
    this.characterSheetChange.emit(this.characterSheet);

    // Validate the step
    this.validateStep();
  }

  // Return value from characteristic back to specific pool A (for wideRangeCharacteristics)
  returnCharacteristicValue(characteristicKey: string): void {
    const characteristic = this.characteristics.find(c => c.key === characteristicKey)!;
    const targetPool = characteristic.pool === 'A' ? this.rollingPoolA : this.rollingPoolB;

    // Only allow return if the characteristic is assigned and has a value > minimum
    if (characteristic.current && characteristic.current >= characteristic.min) {
      // Return the value specifically to pool A
      targetPool.push(characteristic.current);
      targetPool.sort((a, b) => b - a);
      characteristic.current = null;

      // Update the characterSheet
      this.updateCharacterSheetAttribute(characteristicKey, null);

      // Emit the changes to the parent component
      this.characterSheetChange.emit(this.characterSheet);

      // Validate the step
      this.validateStep();
    }
  }

  canAssignToCharacteristic(characteristic: string): boolean {
    if (this.selectedRollIndex === null || this.selectedRollPool === null) {
      return false;
    }
    return this.characteristics.filter(c => c.pool === this.selectedRollPool).some(c => c.key === characteristic);
  }

  // Check if a characteristic has been explicitly assigned (not just at minimum value)
  isCharacteristicAssigned(characteristicKey: string): boolean {
    return this.characteristics.find(c => c.key === characteristicKey)!.current !== null;
  }

  // Check if characteristic is used by current occupation
  isCharacteristicImportant(characteristic: string): boolean {
    return this.getOccupationRelatedCharacteristics().includes(characteristic);
  }

  getHalfCharacteristicValue(characteristicKey: string): string {
    const characteristic = this.characteristics.find(c => c.key === characteristicKey);
    if (!characteristic || characteristic.current === null) return '-';
    return Math.floor(characteristic.current / 2).toString();
  }

  getFifthCharacteristicValue(characteristicKey: string): string {
    const characteristic = this.characteristics.find(c => c.key === characteristicKey);
    if (!characteristic || characteristic.current === null) return '-';
    return Math.floor(characteristic.current / 5).toString();
  }

  getPoolACharacteristics(): Characteristic[] {
    return this.characteristics.filter(c => c.pool === 'A');
  }

  getPoolBCharacteristics(): Characteristic[] {
    return this.characteristics.filter(c => c.pool === 'B');
  }

  private removeAssignedValuesFromPools(): void {
    // Remove assigned values from the appropriate pools
    this.characteristics.forEach(characteristic => {
      if (characteristic.current !== null) {
        const targetPool = characteristic.pool === 'A' ? this.rollingPoolA : this.rollingPoolB;
        const valueIndex = targetPool.indexOf(characteristic.current);
        if (valueIndex > -1) {
          targetPool.splice(valueIndex, 1);
        }
      }
    });
  }

  private removeAssignedValuesFromQuickFire(): void {
    // Remove assigned values from quickFireValues
    this.characteristics.forEach(characteristic => {
      if (characteristic.current !== null) {
        const valueIndex = this.quickFireValues.indexOf(characteristic.current);
        if (valueIndex > -1) {
          this.quickFireValues.splice(valueIndex, 1);
        }
      }
    });
  }

  private createAttribute(value: number): { value: number, halfValue: number, fifthValue: number } {
    return {
      value: value,
      halfValue: Math.floor(value / 2),
      fifthValue: Math.floor(value / 5)
    };
  }

  private updateCharacterSheetAttribute(characteristicKey: string, value: number | null): void {
    const attributeKey = characteristicKey as keyof CharacterSheetCreate;
    if (value !== null) {
      (this.characterSheet as any)[attributeKey] = this.createAttribute(value);
    } else {
      (this.characterSheet as any)[attributeKey] = null;
    }
  }
}