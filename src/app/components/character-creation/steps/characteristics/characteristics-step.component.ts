import { DiceService } from './../../../../services/dice.service';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { CharacterSheetCreate, StepValidation } from '../../../../models/character.model';
import { OCCUPATIONS } from '../../../../models/skills.model';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';

type Characteristic = {
  key: string,
  min: number,
  max: number,
  current: number | null,
  pool: 'A' | 'B',
  currentEasy: number | null,
  currentAdvanced: number | null
};

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
  defaultQuickFireValuesCount: { value: number, count: number }[] = [
    { value: 80, count: 1 },
    { value: 70, count: 1 },
    { value: 60, count: 2 },
    { value: 50, count: 3 },
    { value: 40, count: 1 }
  ];
  quickFireValues: number[] = [];

  // Selection system for Rolling Method
  selectedRollIndex: number | null = null;
  selectedRollPool: 'A' | 'B' | null = null;

  // Selection system for Quick Fire Method
  selectedQuickFireIndex: number | null = null;

  characteristics: Characteristic[] = [
    { key: 'appearance', min: 15, max: 90, current: null, pool: 'A', currentEasy: null, currentAdvanced: null },
    { key: 'constitution', min: 15, max: 90, current: null, pool: 'A', currentEasy: null, currentAdvanced: null },
    { key: 'dexterity', min: 15, max: 90, current: null, pool: 'A', currentEasy: null, currentAdvanced: null },
    { key: 'education', min: 40, max: 90, current: null, pool: 'B', currentEasy: null, currentAdvanced: null },
    { key: 'intelligence', min: 40, max: 90, current: null, pool: 'B', currentEasy: null, currentAdvanced: null },
    { key: 'power', min: 15, max: 90, current: null, pool: 'A', currentEasy: null, currentAdvanced: null },
    { key: 'size', min: 40, max: 90, current: null, pool: 'B', currentEasy: null, currentAdvanced: null },
    { key: 'strength', min: 15, max: 90, current: null, pool: 'A', currentEasy: null, currentAdvanced: null }
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
    if (this.characterSheet.attributeRolls.generationMethod) {
      this.generationMethod = this.characterSheet.attributeRolls.generationMethod;
    }

    this.rollingPoolA = this.characterSheet.attributeRolls.rollingPoolA || [];
    this.rollingPoolB = this.characterSheet.attributeRolls.rollingPoolB || [];

    this.characterSheet.attributeRolls.assigned.forEach(assignment => {
      const characteristic = this.characteristics.find(c => c.key === assignment.key)!;
      characteristic.currentEasy = assignment.quickfireValue;
      characteristic.currentAdvanced = assignment.rollingValue;
      if (this.generationMethod === 'rolling') {
        characteristic.current = assignment.rollingValue;
      }
      if (this.generationMethod === 'quickfire') {
        characteristic.current = assignment.quickfireValue;
      }
    });

    this.generateRollingPools();
    this.updateCharacterSheet();

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
    const previousMethod = this.generationMethod;

    // Save current values to the appropriate properties before switching
    if (previousMethod !== method) {
      this.characteristics.forEach(characteristic => {
        if (characteristic.current !== null) {
          if (previousMethod === 'rolling') {
            characteristic.currentAdvanced = characteristic.current;
          } else if (previousMethod === 'quickfire') {
            characteristic.currentEasy = characteristic.current;
          }
        }
      });
    }

    this.generationMethod = method;

    // Restore values from the new method if they exist
    this.characteristics.forEach(characteristic => {
      if (method === 'rolling') {
        characteristic.current = characteristic.currentAdvanced;
      } else {
        characteristic.current = characteristic.currentEasy;
      }
    });

    this.updateCharacterSheet();
    // Validate the step with updated values
    this.validateStep();
  }

  onCharacteristicInputChange(event: any, characteristicKey: string): void {
    const inputValue = parseInt(event.target.value, 10);
    const characteristic = this.characteristics.find(c => c.key === characteristicKey);
    if (!characteristic) return;

    // Update the characteristic's current value and the appropriate mode-specific value
    characteristic.current = inputValue;
    if (this.generationMethod === 'rolling') {
      characteristic.currentAdvanced = inputValue;
    } else if (this.generationMethod === 'quickfire') {
      characteristic.currentEasy = inputValue;
    }

    // Emit the changes to the parent component
    this.updateCharacterSheet();

    // Validate the step after input change
    this.validateStep();
  }

  // Rolling Method: Generate dice pools
  generateRollingPools(): void {
    // Clear any current selection
    this.selectedRollIndex = null;
    this.selectedRollPool = null;

    let assignedQuickFire = this.characteristics.filter(c => c.currentEasy !== null).map(c => c.currentEasy) as number[];
    this.defaultQuickFireValuesCount.forEach(item => {
      const assignedCount = assignedQuickFire.filter(v => v === item.value).length;
      let missingCount = item.count - assignedCount;
      console.log(`For quickfire value ${item.value}, assigned count: ${assignedCount}, missing count: ${missingCount}`);
      for (let i = 0; i < missingCount; i++) {
        console.log(`Adding quickfire value: ${item.value}`);
        this.quickFireValues.push(item.value);
      }
    });
    this.quickFireValues.sort((a, b) => b - a);

    let assignedRollingFromPoolA = this.characteristics.filter(c => c.pool === 'A' && c.currentAdvanced !== null).map(c => c.currentAdvanced) as number[];
    if (Math.abs(this.rollingPoolA.length - assignedRollingFromPoolA.length) < 5) {
      // missing rolls in pool A, need to complete
      let missingCount = 5 - (this.rollingPoolA.length + assignedRollingFromPoolA.length);
      console.log(`Rolling Pool A missing count: ${missingCount} (PoolA: ${this.rollingPoolA.length}, AssignedA: ${assignedRollingFromPoolA.length})`);
      for (let i = 0; i < missingCount; i++) {
        this.rollingPoolA.push(this.diceService.rollDiceFormula('3d6*5'));
      }
    }
    this.rollingPoolA.sort((a, b) => b - a);

    let assignedRollingFromPoolB = this.characteristics.filter(c => c.pool === 'B' && c.currentAdvanced !== null).map(c => c.currentAdvanced) as number[];
    if (Math.abs(this.rollingPoolB.length - assignedRollingFromPoolB.length) < 3) {
      // missing rolls in pool B, need to complete
      let missingCount = 3 - (this.rollingPoolB.length + assignedRollingFromPoolB.length);
      console.log(`Rolling Pool B missing count: ${missingCount} (PoolB: ${this.rollingPoolB.length}, AssignedB: ${assignedRollingFromPoolB.length})`);
      for (let i = 0; i < missingCount; i++) {
        this.rollingPoolB.push(this.diceService.rollDiceFormula('(2d6+6)*5'));
      }
    }
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

      // Update the characteristic values
      characteristic.current = value;
      characteristic.currentEasy = value;

      this.quickFireValues.splice(this.selectedQuickFireIndex, 1);
      if (valueToAddBack !== null) {
        this.quickFireValues.push(valueToAddBack);
      }
      this.quickFireValues.sort((a, b) => b - a); // Keep sorted descending

      // Clear selection
      this.selectedQuickFireIndex = null;

      // Emit the changes to the parent component
      this.updateCharacterSheet();

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
      characteristic.currentEasy = null;

      this.quickFireValues.sort((a, b) => b - a); // Keep sorted descending

      this.updateCharacterSheet();
      // Validate the step
      this.validateStep();
    }
  }

  // Quick Fire Method: Check if we can assign to a characteristic
  canAssignQuickFireValue(characteristicKey: string): boolean {
    return this.selectedQuickFireIndex !== null;
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

    // Update the characteristic values
    characteristic.current = value;
    characteristic.currentAdvanced = value;

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
    this.updateCharacterSheet();

    // Validate the step
    this.validateStep();
  }

  // Return value from characteristic back to specific pool A (for wideRangeCharacteristics)
  returnCharacteristicValue(characteristicKey: string): void {
    const characteristic = this.characteristics.find(c => c.key === characteristicKey)!;
    const targetPool = characteristic.pool === 'A' ? this.rollingPoolA : this.rollingPoolB;

    // Only allow return if the characteristic is assigned and has a value > minimum
    if (characteristic.current && characteristic.current >= characteristic.min) {
      // Return the value specifically to the appropriate pool
      targetPool.push(characteristic.current);
      targetPool.sort((a, b) => b - a);
      characteristic.current = null;
      characteristic.currentAdvanced = null;

      // Emit the changes to the parent component
      this.updateCharacterSheet();

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

  private createAttribute(value: number): { value: number, halfValue: number, fifthValue: number } {
    return {
      value: value,
      halfValue: Math.floor(value / 2),
      fifthValue: Math.floor(value / 5)
    };
  }

  // Auto-assign characteristics based on occupation's recommended order
  autoAssignCharacteristics(): void {
    if (!this.characterSheet.occupation) {
      return; // No occupation selected
    }

    const occupation = OCCUPATIONS.find(occ => occ.id === this.characterSheet.occupation);
    if (!occupation || !occupation.recommendedCharacteristicsOrder) {
      return; // No occupation found or no recommended order
    }

    // Get unassigned characteristics only
    const unassignedCharacteristics = this.characteristics.filter(c => c.current === null);
    if (unassignedCharacteristics.length === 0) {
      return; // All characteristics are already assigned
    }

    // Filter recommended order to only include unassigned characteristics
    const unassignedRecommendedOrder = occupation.recommendedCharacteristicsOrder
      .filter(charKey => unassignedCharacteristics.some(c => c.key === charKey));

    if (this.generationMethod === 'quickfire') {
      // Quick Fire method: assign available values to unassigned characteristics
      if (unassignedRecommendedOrder.length !== this.quickFireValues.length) {
        return; // Mismatch in counts, cannot auto-assign
      }
      unassignedRecommendedOrder.forEach(charKey => {
        const characteristic = this.characteristics.find(c => c.key === charKey)!;
        const value = this.quickFireValues.shift()!;
        characteristic.current = value;
        characteristic.currentEasy = value;
      });

    } else if (this.generationMethod === 'rolling') {
      // Rolling method: assign from appropriate pools to unassigned characteristics
      if (unassignedRecommendedOrder.length !== (this.rollingPoolA.length + this.rollingPoolB.length)) {
        return; // Mismatch in counts, cannot auto-assign
      }

      unassignedRecommendedOrder.forEach(charKey => {
        const characteristic = this.characteristics.find(c => c.key === charKey)!;
        const value = characteristic.pool === 'A' ? this.rollingPoolA.shift()! : this.rollingPoolB.shift()!;
        characteristic.current = value;
        characteristic.currentAdvanced = value;
      });
    }

    // Emit changes and validate
    this.updateCharacterSheet();
    this.validateStep();
  }

  updateCharacterSheet(): void {
    this.characterSheet.attributeRolls.assigned = [];
    this.characteristics.forEach(characteristic => {
      const attributeKey = characteristic.key as keyof CharacterSheetCreate;
      if (characteristic.current !== null) {
        (this.characterSheet as any)[attributeKey] = this.createAttribute(characteristic.current);
      } else {
        (this.characterSheet as any)[attributeKey] = null;
      }
      this.characterSheet.attributeRolls.assigned.push({
        key: characteristic.key,
        quickfireValue: characteristic.currentEasy,
        rollingValue: characteristic.currentAdvanced
      });
    });
    this.characterSheet.attributeRolls.rollingPoolA = this.rollingPoolA;
    this.characterSheet.attributeRolls.rollingPoolB = this.rollingPoolB;
    this.characterSheet.attributeRolls.generationMethod = this.generationMethod;
    this.characterSheetChange.emit(this.characterSheet);
  }

  // Check if auto-assign is available (has occupation and available values)
  canAutoAssign(): boolean {
    if (!this.characterSheet.occupation) {
      return false;
    }

    const occupation = OCCUPATIONS.find(occ => occ.id === this.characterSheet.occupation);
    if (!occupation || !occupation.recommendedCharacteristicsOrder) {
      return false;
    }

    // Don't allow auto-assign if a roll/value is currently selected
    if (this.generationMethod === 'rolling' && (this.selectedRollIndex !== null || this.selectedRollPool !== null)) {
      return false;
    }

    if (this.generationMethod === 'quickfire' && this.selectedQuickFireIndex !== null) {
      return false;
    }

    // Check if there are available values to assign
    if (this.generationMethod === 'quickfire') {
      return this.quickFireValues.length > 0;
    } else if (this.generationMethod === 'rolling') {
      return this.rollingPoolA.length > 0 || this.rollingPoolB.length > 0;
    }

    return false;
  }
}