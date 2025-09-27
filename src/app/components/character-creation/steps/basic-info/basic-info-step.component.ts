import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';
import { CharacterSheetCreate, StepValidation, Sex } from '../../../../models/character.model';

@Component({
  selector: 'app-basic-info-step',
  imports: [CommonModule, FormsModule, DynamicTranslatePipe],
  templateUrl: './basic-info-step.component.html',
  styleUrl: './basic-info-step.component.css'
})
export class BasicInfoStepComponent implements OnInit, OnChanges {
  @Input() characterSheet!: CharacterSheetCreate;
  @Output() characterSheetChange = new EventEmitter<CharacterSheetCreate>();
  @Output() stepValidation = new EventEmitter<StepValidation>();

  // Local copy to avoid mutating input
  localCharacterSheet!: CharacterSheetCreate;

  ngOnInit() {
    this.initializeLocalData();
    this.validateStep();
  }

  ngOnChanges() {
    this.initializeLocalData();
    this.validateStep();
  }

  private initializeLocalData() {
    this.localCharacterSheet = { ...this.characterSheet };
  }

  get ageInvalid(): boolean {
    return !this.localCharacterSheet.age || this.localCharacterSheet.age < 15 || this.localCharacterSheet.age > 90;
  }

  onInputChange(field: string, value: any) {
    (this.localCharacterSheet as any)[field] = value;

    // Special handling for age
    if (field === 'age') {
      const ageValue = Number(value);
      if (ageValue < 15) {
        this.localCharacterSheet.age = 15;
      } else if (ageValue > 90) {
        this.localCharacterSheet.age = 90;
      }
    }

    this.emitChanges();
  }

  private emitChanges() {
    this.characterSheetChange.emit({ ...this.localCharacterSheet });
    this.validateStep();
  }

  private validateStep() {
    const errors: string[] = [];

    if (!this.localCharacterSheet.name?.trim()) errors.push('Name is required');
    if (!this.localCharacterSheet.player?.trim()) errors.push('Player is required');
    if (!this.localCharacterSheet.age || this.localCharacterSheet.age < 15 || this.localCharacterSheet.age > 90) {
      errors.push('Age must be between 15 and 90');
    }
    if (!this.localCharacterSheet.sex || this.localCharacterSheet.sex === Sex.Undefined) errors.push('Sex is required');

    const validation: StepValidation = {
      isValid: errors.length === 0,
      errors
    };

    this.stepValidation.emit(validation);
  }
}