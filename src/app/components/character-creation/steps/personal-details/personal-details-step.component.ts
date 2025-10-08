import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CharacterSheetCreate, StepValidation } from '../../../../models/character.model';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';

@Component({
  selector: 'app-personal-details-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicTranslatePipe],
  templateUrl: './personal-details-step.component.html',
  styleUrls: ['./personal-details-step.component.css']
})
export class PersonalDetailsStepComponent implements OnInit, OnDestroy {
  @Input() characterSheet!: CharacterSheetCreate;
  @Output() characterSheetChange = new EventEmitter<CharacterSheetCreate>();
  @Output() stepValidation = new EventEmitter<StepValidation>();

  personalDetailsForm!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormSubscription();
    this.validateStep();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.personalDetailsForm = this.fb.group({
      backstory: [this.characterSheet.backstory || '', [Validators.maxLength(500)]],
      traits: [this.characterSheet.traits || '', [Validators.maxLength(200)]],
      ideologyBeliefs: [this.characterSheet.ideologyBeliefs || '', [Validators.maxLength(200)]]
    });
  }

  private setupFormSubscription(): void {
    this.personalDetailsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(values => {
        const updatedCharacterSheet: CharacterSheetCreate = {
          ...this.characterSheet,
          backstory: values.backstory,
          traits: values.traits,
          ideologyBeliefs: values.ideologyBeliefs
        };

        this.characterSheetChange.emit(updatedCharacterSheet);
        this.validateStep();
      });
  }

  private validateStep(): void {
    // Personal details are optional, so this step is always valid
    // But we check for form validity (character limits, etc.)
    const isValid = this.personalDetailsForm.valid;
    const errors: string[] = [];

    if (!isValid) {
      Object.keys(this.personalDetailsForm.controls).forEach(key => {
        const control = this.personalDetailsForm.get(key);
        if (control?.invalid) {
          if (control.errors?.['maxlength']) {
            errors.push(`personal.${key}.maxlength`);
          }
        }
      });
    }

    this.stepValidation.emit({
      isValid: isValid,
      errors: errors
    });
  }

  getCharacterCount(fieldName: string): number {
    const control = this.personalDetailsForm.get(fieldName);
    return control?.value?.length || 0;
  }

  getMaxLength(fieldName: string): number {
    if (fieldName === 'backstory') return 500;
    return 200;
  }

  isFieldNearLimit(fieldName: string): boolean {
    const currentLength = this.getCharacterCount(fieldName);
    const maxLength = this.getMaxLength(fieldName);
    return currentLength > maxLength * 0.8;
  }

  isFieldOverLimit(fieldName: string): boolean {
    const currentLength = this.getCharacterCount(fieldName);
    const maxLength = this.getMaxLength(fieldName);
    return currentLength > maxLength;
  }
}