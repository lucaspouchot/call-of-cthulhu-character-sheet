import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { CharacterSheetCreate, StepValidation } from '../../../../models/character.model';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';
import { AgeModifierService } from '../../../../services/age-modifier.service';

@Component({
  selector: 'app-age-modifiers-step',
  standalone: true,
  imports: [CommonModule, DynamicTranslatePipe],
  templateUrl: './age-modifiers-step.component.html',
  styleUrls: ['./age-modifiers-step.component.css']
})
export class AgeModifiersStepComponent implements OnInit, OnDestroy {
  @Input() characterSheet!: CharacterSheetCreate;
  @Output() characterSheetChange = new EventEmitter<CharacterSheetCreate>();
  @Output() stepValidation = new EventEmitter<StepValidation>();

  private destroy$ = new Subject<void>();
  Math = Math; // Expose Math to template

  ageModifiers: any = {};

  constructor(
    private ageModifierService: AgeModifierService
  ) { }

  ngOnInit(): void {
    this.calculateAgeModifiers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private calculateAgeModifiers(): void {
    if (this.characterSheet.age) {
      this.ageModifiers = this.ageModifierService.calculateAgeModifiers(this.characterSheet.age);
    }
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
    const isValid = true;
    const errors: string[] = [];

    this.stepValidation.emit({
      isValid: isValid,
      errors: errors
    });
  }

  getAgeCategory(): string {
    if (!this.characterSheet.age) return '';

    if (this.characterSheet.age < 20) return 'young';
    if (this.characterSheet.age < 40) return 'adult';
    if (this.characterSheet.age < 50) return 'middleAged';
    if (this.characterSheet.age < 60) return 'mature';
    if (this.characterSheet.age < 70) return 'elderly';
    return 'venerable';
  }
}