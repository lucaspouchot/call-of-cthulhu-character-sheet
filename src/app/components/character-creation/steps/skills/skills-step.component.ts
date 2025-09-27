import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
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

  private destroy$ = new Subject<void>();

  occupationPoints = 0;
  personalPoints = 0;
  occupationPointsSpent = 0;
  personalPointsSpent = 0;

  constructor() { }

  ngOnInit(): void {
    this.validateStep();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private validateStep(): void {
    const isValid = this.occupationPointsSpent === this.occupationPoints &&
      this.personalPointsSpent === this.personalPoints;

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