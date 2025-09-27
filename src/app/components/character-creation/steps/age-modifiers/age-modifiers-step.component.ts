import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CharacterSheetCreate, StepValidation } from '../../../../models/character.model';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';
import { AgeModifierService } from '../../../../services/age-modifier.service';

@Component({
  selector: 'app-age-modifiers-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicTranslatePipe, KeyValuePipe],
  templateUrl: './age-modifiers-step.component.html',
  styleUrls: ['./age-modifiers-step.component.css']
})
export class AgeModifiersStepComponent implements OnInit, OnDestroy {
  @Input() characterSheet!: CharacterSheetCreate;
  @Output() characterSheetChange = new EventEmitter<CharacterSheetCreate>();
  @Output() stepValidation = new EventEmitter<StepValidation>();

  ageModifiersForm!: FormGroup;
  private destroy$ = new Subject<void>();
  Math = Math; // Expose Math to template

  ageModifiers: any = {};

  constructor(
    private fb: FormBuilder,
    private ageModifierService: AgeModifierService
  ) { }

  ngOnInit(): void {
    this.calculateAgeModifiers();
    this.initializeForm();
    this.setupFormSubscription();
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

  private initializeForm(): void {
    this.ageModifiersForm = this.fb.group({
      age: [this.characterSheet.age || 20, [Validators.required, Validators.min(15), Validators.max(89)]],
      luckValue: [this.characterSheet.luckValue || 50, [Validators.required, Validators.min(15), Validators.max(99)]],
      acknowledgeModifiers: [false, [Validators.requiredTrue]]
    });
  }

  private setupFormSubscription(): void {
    this.ageModifiersForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(values => {
        if (values.age !== this.characterSheet.age) {
          this.calculateAgeModifiers();
        }

        const updatedCharacterSheet: CharacterSheetCreate = {
          ...this.characterSheet,
          age: values.age,
          luckValue: values.luckValue
        };

        this.characterSheetChange.emit(updatedCharacterSheet);
        this.validateStep();
      });
  }

  private validateStep(): void {
    const isValid = this.ageModifiersForm.valid;
    const errors: string[] = [];

    if (!isValid) {
      if (this.ageModifiersForm.get('age')?.invalid) {
        errors.push('skills.validation.age.required');
      }
      if (this.ageModifiersForm.get('luckValue')?.invalid) {
        errors.push('skills.validation.luck.required');
      }
      if (this.ageModifiersForm.get('acknowledgeModifiers')?.invalid) {
        errors.push('ageModifiers.acknowledgment.required');
      }
    }

    this.stepValidation.emit({
      isValid: isValid,
      errors: errors
    });
  }

  onAgeChange(age: number): void {
    this.ageModifiersForm.patchValue({ age });
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

  hasModifiers(): boolean {
    return Object.keys(this.ageModifiers).length > 0;
  }

  rollLuck(): void {
    const age = this.ageModifiersForm.get('age')?.value || 20;

    if (age >= 15 && age <= 19) {
      // For ages 15-19, roll twice and take the better result
      const roll1 = this.rollSingleLuck();
      const roll2 = this.rollSingleLuck();
      const bestRoll = Math.max(roll1, roll2);
      this.ageModifiersForm.patchValue({ luckValue: bestRoll });
    } else {
      // Standard single roll for other ages
      const roll = this.rollSingleLuck();
      this.ageModifiersForm.patchValue({ luckValue: roll });
    }
  }

  private rollSingleLuck(): number {
    // Roll 3d6 × 5 for luck (standard Call of Cthulhu)
    const roll = Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 3;
    return Math.min(roll * 5, 99);
  }

  isYoungAge(): boolean {
    const age = this.ageModifiersForm.get('age')?.value || this.characterSheet.age || 20;
    return age >= 15 && age <= 19;
  }

  getLuckRollDescription(): string {
    return this.isYoungAge() ?
      'character.creation.luck.rollTwice' :
      'character.creation.luck.rollOnce';
  }
}