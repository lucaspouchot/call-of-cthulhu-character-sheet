import { TranslationService } from './../../../../services/translation.service';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CharacterSheetCreate, StepValidation } from '../../../../models/character.model';
import { DynamicTranslatePipe } from '../../../../pipes/dynamic-translate.pipe';
import { OCCUPATIONS, Occupation, OccupationSkillSpec } from '../../../../models/occupation.model';

@Component({
  selector: 'app-occupation-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicTranslatePipe],
  templateUrl: './occupation-step.component.html',
  styleUrls: ['./occupation-step.component.css']
})
export class OccupationStepComponent implements OnInit, OnDestroy {
  @Input() characterSheet!: CharacterSheetCreate;
  @Output() characterSheetChange = new EventEmitter<CharacterSheetCreate>();
  @Output() stepValidation = new EventEmitter<StepValidation>();

  occupationForm!: FormGroup;
  private destroy$ = new Subject<void>();

  availableOccupations: Occupation[] = OCCUPATIONS;

  constructor(
    private fb: FormBuilder,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.setupFormSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.occupationForm = this.fb.group({
      occupation: [this.characterSheet.occupation || '', [Validators.required]]
    });
  }

  private setupFormSubscription(): void {
    this.occupationForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(values => {
        const updatedCharacterSheet: CharacterSheetCreate = {
          ...this.characterSheet,
          occupation: values.occupation
        };

        this.characterSheetChange.emit(updatedCharacterSheet);
        this.validateStep();
      });
  }

  private validateStep(): void {
    const isValid = this.occupationForm.valid && !!this.occupationForm.value.occupation;

    this.stepValidation.emit({
      isValid: isValid,
      errors: isValid ? [] : ['skills.validation.occupation.required']
    });
  }

  onOccupationChange(occupation: string): void {
    this.occupationForm.patchValue({ occupation });
  }

  getSelectedOccupation(): Occupation | undefined {
    const selectedId = this.occupationForm.get('occupation')?.value;
    return this.availableOccupations.find(occ => occ.id === selectedId);
  }

  getOccupationSkills(): string[] {
    const occupation = this.getSelectedOccupation();
    if (!occupation) return [];

    // Convert OccupationSkillSpec[] to display strings
    const displaySkills: string[] = [];

    for (const spec of occupation.occupationSkills) {
      if (typeof spec === 'string') {
        // Simple skill reference
        displaySkills.push(spec);
      } else if (spec.type === 'choice') {
        // Choice between multiple skills
        displaySkills.push(`choice.${spec.count}.from.${spec.options.length}`);
      } else if (spec.type === 'specialization') {
        // Specializable skill
        displaySkills.push(`specialization.${spec.baseSkillId}`);
      } else if (spec.type === 'any') {
        // Any skill
        displaySkills.push(`any.${spec.count}`);
      }
    }

    return displaySkills;
  }

  getSkillPointsFormulaChips(): { type: 'chip' | 'text'; content: string; isTranslatable?: boolean }[] {
    const occupation = this.getSelectedOccupation();
    if (!occupation) return [];

    const formula = occupation.occupationSkillPoints;
    const parts: { type: 'chip' | 'text'; content: string; isTranslatable?: boolean }[] = [];

    if (formula.type === 'simple') {
      parts.push({
        type: 'chip',
        content: `${formula.formulas[0].attribute}|${formula.formulas[0].multiplier}`,
        isTranslatable: true
      });
    } else if (formula.type === 'composite') {
      parts.push({
        type: 'chip',
        content: `${formula.formulas[0].attribute}|${formula.formulas[0].multiplier}`,
        isTranslatable: true
      });
      if (formula.choiceFormulas && formula.choiceFormulas.length > 0) {
        parts.push({ type: 'text', content: ' + (', isTranslatable: false });
        formula.choiceFormulas.forEach((f, index) => {
          if (index > 0) parts.push({ type: 'text', content: ` ${this.translationService.getTranslation('conjunction.or')} `, isTranslatable: false });
          parts.push({
            type: 'chip',
            content: `${f.attribute}|${f.multiplier}`,
            isTranslatable: true
          });
        });
        parts.push({ type: 'text', content: ')', isTranslatable: false });
      }
    } else if (formula.type === 'choice') {
      formula.formulas.forEach((f, index) => {
        if (index > 0) parts.push({ type: 'text', content: ` ${this.translationService.getTranslation('conjunction.or')} `, isTranslatable: false });
        parts.push({
          type: 'chip',
          content: `${f.attribute}|${f.multiplier}`,
          isTranslatable: true
        });
      });
    }

    return parts;
  }

  getPersonalPointsChip(): { attribute: string; multiplier: number } | null {
    const occupation = this.getSelectedOccupation();
    if (!occupation || !occupation.personalSkillPoints.formulas[0]) return null;

    return {
      attribute: occupation.personalSkillPoints.formulas[0].attribute,
      multiplier: occupation.personalSkillPoints.formulas[0].multiplier
    };
  }

  private formatFormula(formula: { attribute: string; multiplier: number }): string {
    const attributeKey = `character.attributes.${formula.attribute}`;
    // For now, return the formula pattern - we'll use the pipe in template for translation
    return `${attributeKey} × ${formula.multiplier}`;
  }
}