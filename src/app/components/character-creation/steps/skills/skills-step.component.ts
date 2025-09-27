import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CharacterSheetCreate, StepValidation } from '../../../../models/character.model';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';

@Component({
  selector: 'app-skills-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicTranslatePipe],
  templateUrl: './skills-step.component.html',
  styleUrls: ['./skills-step.component.css']
})
export class SkillsStepComponent implements OnInit, OnDestroy {
  @Input() characterSheet!: CharacterSheetCreate;
  @Output() characterSheetChange = new EventEmitter<CharacterSheetCreate>();
  @Output() stepValidation = new EventEmitter<StepValidation>();

  skillsForm!: FormGroup;
  private destroy$ = new Subject<void>();

  occupationSkills = [
    'anthropology',
    'archaeology',
    'history',
    'library_use',
    'other_language',
    'own_language',
    'psychology',
    'spot_hidden'
  ];

  personalSkills = [
    'climb',
    'dodge',
    'drive_auto',
    'first_aid',
    'jump',
    'listen',
    'mechanical_repair',
    'swim',
    'throw'
  ];

  occupationPoints = 0;
  personalPoints = 0;
  occupationPointsSpent = 0;
  personalPointsSpent = 0;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.calculateSkillPoints();
    this.initializeForm();
    this.setupFormSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private calculateSkillPoints(): void {
    // Calculate occupation skill points (Education x 4)
    if (this.characterSheet.education?.value) {
      this.occupationPoints = this.characterSheet.education.value * 4;
    }

    // Calculate personal interest points (Intelligence x 2)
    if (this.characterSheet.intelligence?.value) {
      this.personalPoints = this.characterSheet.intelligence.value * 2;
    }
  }

  private initializeForm(): void {
    const formControls: any = {};

    // Initialize occupation skills
    this.occupationSkills.forEach(skill => {
      const currentValue = this.characterSheet.skillAssignments?.[skill]?.occupation || 0;
      formControls[`occupation_${skill}`] = [currentValue, [Validators.min(0), Validators.max(100)]];
    });

    // Initialize personal skills
    this.personalSkills.forEach(skill => {
      const currentValue = this.characterSheet.skillAssignments?.[skill]?.personal || 0;
      formControls[`personal_${skill}`] = [currentValue, [Validators.min(0), Validators.max(100)]];
    });

    this.skillsForm = this.fb.group(formControls);
    this.calculatePointsSpent();
  }

  private setupFormSubscription(): void {
    this.skillsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(values => {
        this.calculatePointsSpent();

        const skillAssignments: any = {};

        // Process occupation skill assignments
        this.occupationSkills.forEach(skill => {
          const occupationValue = values[`occupation_${skill}`] || 0;
          skillAssignments[skill] = {
            ...skillAssignments[skill],
            occupation: occupationValue
          };
        });

        // Process personal skill assignments
        this.personalSkills.forEach(skill => {
          const personalValue = values[`personal_${skill}`] || 0;
          skillAssignments[skill] = {
            ...skillAssignments[skill],
            personal: personalValue
          };
        });

        const updatedCharacterSheet: CharacterSheetCreate = {
          ...this.characterSheet,
          skillAssignments: skillAssignments
        };

        this.characterSheetChange.emit(updatedCharacterSheet);
        this.validateStep();
      });
  }

  private calculatePointsSpent(): void {
    const values = this.skillsForm.value;

    this.occupationPointsSpent = this.occupationSkills.reduce((total, skill) => {
      return total + (values[`occupation_${skill}`] || 0);
    }, 0);

    this.personalPointsSpent = this.personalSkills.reduce((total, skill) => {
      return total + (values[`personal_${skill}`] || 0);
    }, 0);
  }

  private validateStep(): void {
    const isValid = this.skillsForm.valid &&
      this.occupationPointsSpent <= this.occupationPoints &&
      this.personalPointsSpent <= this.personalPoints;

    const errors: string[] = [];

    if (this.occupationPointsSpent > this.occupationPoints) {
      errors.push('skills.validation.occupation.overspent');
    }

    if (this.personalPointsSpent > this.personalPoints) {
      errors.push('skills.validation.personal.overspent');
    }

    this.stepValidation.emit({
      isValid: isValid,
      errors: errors
    });
  }

  getRemainingOccupationPoints(): number {
    return this.occupationPoints - this.occupationPointsSpent;
  }

  getRemainingPersonalPoints(): number {
    return this.personalPoints - this.personalPointsSpent;
  }

  isOccupationOverspent(): boolean {
    return this.occupationPointsSpent > this.occupationPoints;
  }

  isPersonalOverspent(): boolean {
    return this.personalPointsSpent > this.personalPoints;
  }
}